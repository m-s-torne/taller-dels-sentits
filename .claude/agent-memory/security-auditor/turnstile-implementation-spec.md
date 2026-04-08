---
name: Turnstile Implementation Spec
description: Exact file-by-file, copy-pasteable implementation spec for Cloudflare Turnstile on the Taller dels Sentits contact form.
type: project
---

# Cloudflare Turnstile — Implementation Spec

**Audience:** a code-implementer agent that has never seen this codebase.
**Goal:** integrate Cloudflare Turnstile (Managed / invisible mode) into the contact form so that every Server Action submission must present a valid, freshly-minted, single-use Turnstile token.

Read [turnstile-security-analysis.md](turnstile-security-analysis.md) before executing if you need the "why". This file is the "what" and "how".

**Do not deviate.** Every code block here is the exact text to write. Where existing code must be kept intact, context is shown; modify only the marked sections.

---

## 0. Prerequisites (manual, performed by the project owner — NOT by the implementer agent)

1. Create a Turnstile widget in the Cloudflare Dashboard:
   - Domains: `tallerdelssentits.com`, `www.tallerdelssentits.com`, and any Vercel preview domain.
   - Widget mode: **Managed** (invisible unless Cloudflare decides to challenge).
   - Pre-clearance: not required.
2. Record the **Site Key** (public) and **Secret Key** (private).
3. Add to Vercel project env vars (Production + Preview + Development):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>`
   - `TURNSTILE_SECRET_KEY=<secret key>`
4. Add to local `.env.local` using the always-pass test keys from the reference doc:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
   ```

The implementer agent assumes these steps are complete.

---

## 1. Ordering of changes

Execute in this exact order. Each step compiles/tests independently where possible.

1. Install the npm package.
2. Extend the `ContactFormData` type (`form.types.ts`).
3. Extend `siteConfig.ts` to require and expose `turnstileSiteKey`.
4. Add `escapeHtml`-style new helper file: `verifyTurnstile.ts`.
5. Modify `handleSubmit.ts`: import the helper, add verification at the very start of `handleFormSubmit`, strip the token from `sanitizedData` before fallback persistence.
6. Modify `useContactForm.ts`: add `turnstileToken: ''` to `initialFormData`, reset it on `resetForm`.
7. Modify `app/contacte/page.tsx`: render the `<Turnstile>` widget, wire `onSuccess`/`onError`/`onExpire`, reset widget after each submission.
8. Modify `SubmitButton.tsx` consumer (`page.tsx`): gate the button on `formData.turnstileToken` being non-empty.
9. Add/modify tests in `app/contacte/actions/__tests__/`.

---

## 2. Install the package

```
pnpm add @marsidev/react-turnstile
```

(If the repo uses `npm`, use `npm install` instead. Check `package-lock.json` vs. `pnpm-lock.yaml` to decide.)

---

## 3. `app/contacte/types/form.types.ts` — add field

Locate the `ContactFormData` interface. Immediately after the honeypot `website?: string;` field, add:

```ts
  // Cloudflare Turnstile token (anti-bot CAPTCHA)
  // Produced client-side by the Turnstile widget, consumed once server-side.
  turnstileToken: string;
```

The `website` field currently stays optional; keep it optional. `turnstileToken` is required (non-optional) because the server action must always check it.

---

## 4. `app/_lib/siteConfig.ts` — add required public env var

Replace the entire file with:

```ts
const requiredPublicEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_OWNER_NAME',
  'NEXT_PUBLIC_OWNER_NIF',
  'NEXT_PUBLIC_BUSINESS_NAME',
  'NEXT_PUBLIC_BUSINESS_ADDRESS',
  'NEXT_PUBLIC_CONTACT_EMAIL',
  'NEXT_PUBLIC_CONTACT_PHONE',
  'NEXT_PUBLIC_CONTACT_PHONE_WA',
  'NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
] as const;

for (const key of requiredPublicEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `[siteConfig] Missing required environment variable: ${key}. ` +
      `Check your .env.local (development) or Vercel environment settings (production).`
    );
  }
}

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME!,
  ownerNif: process.env.NEXT_PUBLIC_OWNER_NIF!,
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME!,
  businessAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS!,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE!,
  contactPhoneWa: process.env.NEXT_PUBLIC_CONTACT_PHONE_WA!,
  contactEmailSchools: process.env.NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS!,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
};
```

Note: `TURNSTILE_SECRET_KEY` is intentionally NOT in `siteConfig.ts`. It is a server-only secret checked lazily in step 5 to avoid crashing SSR on misconfiguration and to keep it out of any bundled object.

---

## 5. New file — `app/contacte/actions/verifyTurnstile.ts`

Create this file exactly:

```ts
/**
 * Cloudflare Turnstile server-side verification.
 *
 * Fails closed: any network error, non-2xx response, malformed JSON,
 * or success: false is treated as failure.
 *
 * Does one retry only on the documented `internal-error` code.
 *
 * SECURITY: never log the token. Do not include `token` in any log line.
 */
const SITEVERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RETRY_DELAY_MS = 500;

type SiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
};

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: 'missing_token' | 'config_error' | 'network_error' | 'invalid_token' | 'duplicate_or_expired' | 'unknown_error'; errorCodes?: string[] };

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const callSiteverify = async (
  secret: string,
  token: string,
  remoteip: string | undefined,
  signal: AbortSignal
): Promise<SiteverifyResponse> => {
  const body: Record<string, string> = { secret, response: token };
  if (remoteip) body.remoteip = remoteip;

  const res = await fetch(SITEVERIFY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`siteverify HTTP ${res.status}`);
  }
  return (await res.json()) as SiteverifyResponse;
};

/**
 * Verify a Turnstile token with Cloudflare.
 *
 * @param token   the token from the client widget (may be empty string)
 * @param rawIp   the raw client IP (NOT the /64-normalized form used for rate limiting);
 *                pass undefined if unknown.
 */
export const verifyTurnstile = async (
  token: string,
  rawIp: string | undefined
): Promise<TurnstileResult> => {
  if (!token) {
    return { ok: false, reason: 'missing_token' };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('[Turnstile] TURNSTILE_SECRET_KEY not configured');
    return { ok: false, reason: 'config_error' };
  }

  // Normalize 'unknown' sentinel to undefined so we omit remoteip entirely.
  const remoteip = rawIp && rawIp !== 'unknown' ? rawIp : undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    let data: SiteverifyResponse;
    try {
      data = await callSiteverify(secret, token, remoteip, controller.signal);
    } catch (err) {
      // One retry on transient failure only
      console.warn('[Turnstile] siteverify attempt 1 failed, retrying:', err instanceof Error ? err.message : 'unknown');
      await delay(RETRY_DELAY_MS);
      try {
        data = await callSiteverify(secret, token, remoteip, controller.signal);
      } catch (err2) {
        console.error('[Turnstile] siteverify failed after retry:', err2 instanceof Error ? err2.message : 'unknown');
        return { ok: false, reason: 'network_error' };
      }
    }

    if (data.success === true) {
      return { ok: true };
    }

    const codes = data['error-codes'] ?? [];
    console.warn('[Turnstile] verification failed:', codes);

    if (codes.includes('timeout-or-duplicate')) {
      return { ok: false, reason: 'duplicate_or_expired', errorCodes: codes };
    }
    if (codes.includes('invalid-input-response') || codes.includes('missing-input-response')) {
      return { ok: false, reason: 'invalid_token', errorCodes: codes };
    }
    if (codes.includes('invalid-input-secret') || codes.includes('missing-input-secret')) {
      return { ok: false, reason: 'config_error', errorCodes: codes };
    }
    return { ok: false, reason: 'unknown_error', errorCodes: codes };
  } finally {
    clearTimeout(timeout);
  }
};
```

---

## 6. `app/contacte/lib/rateLimit.ts` — add a raw-IP extractor

The existing `getClientIp` normalizes IPv6 to `/64`. That normalized form is wrong for Cloudflare's `remoteip`. Add a second exported helper **without modifying the existing one** (so rate-limit tests keep passing).

Locate the top of `rateLimit.ts` after the `normalizeIp` function. Add directly below it:

```ts
/**
 * Extract the raw client IP (NOT normalized) for purposes other than
 * rate-limit bucketing — e.g., passing to Cloudflare Turnstile siteverify
 * as `remoteip`, which expects an actual visitor IP.
 *
 * Mirrors the priority chain of `getClientIp` but skips `normalizeIp`.
 * Returns 'unknown' if no header is present.
 */
export const getRawClientIp = (headers: Headers): string => {
  if (process.env.CLOUDFLARE_PROXY === 'true') {
    const cfIp = headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return 'unknown';
};
```

---

## 7. `app/contacte/actions/handleSubmit.ts` — wire verification in

### 7a. Update imports

Locate this line at the top of the file:

```ts
import { getClientIp, checkRateLimitIp, checkRateLimitEmail, recordRateLimitAttemptIp, recordRateLimitAttemptEmail } from '@/app/contacte/lib/rateLimit';
```

Replace with:

```ts
import { getClientIp, getRawClientIp, checkRateLimitIp, checkRateLimitEmail, recordRateLimitAttemptIp, recordRateLimitAttemptEmail } from '@/app/contacte/lib/rateLimit';
import { verifyTurnstile } from './verifyTurnstile';
```

### 7b. Insert verification at the start of `handleFormSubmit`

Locate the block:

```ts
  try {
    // 0. Rate limiting check (IP-based)
    const requestHeaders = await headers();
    const clientIp = getClientIp(requestHeaders);

    if (checkRateLimitIp(clientIp)) {
```

Replace it with:

```ts
  try {
    // 0. Extract client IP
    const requestHeaders = await headers();
    const clientIp = getClientIp(requestHeaders);
    const rawClientIp = getRawClientIp(requestHeaders);

    // 0a. Cloudflare Turnstile verification — must run BEFORE rate limit,
    //     honeypot, and any DNS/MX lookups so that unverified clients
    //     cannot trigger downstream cost or consume rate-limit buckets.
    const turnstile = await verifyTurnstile(
      formData?.turnstileToken ?? '',
      rawClientIp
    );
    if (!turnstile.ok) {
      console.warn(`[Turnstile] rejected submission: reason=${turnstile.reason}`);
      return {
        success: false,
        error: 'captcha_failed',
        message: 'Verificació de seguretat fallida. Si us plau, torna-ho a intentar.',
      };
    }

    // 0b. Rate limiting check (IP-based)
    if (checkRateLimitIp(clientIp)) {
```

No other lines in that try block change.

### 7c. Strip the token before any fallback persistence

`saveFallbackSubmission` is called in three places. In each, ensure the token is not written to disk. The cleanest way is to strip it once, right after `sanitizedData = validation.data;`. Locate:

```ts
    sanitizedData = validation.data;

    // Record IP attempt for every submission that passes validation
    recordRateLimitAttemptIp(clientIp);
```

Replace with:

```ts
    sanitizedData = validation.data;

    // Defense-in-depth: token is single-use and already consumed by siteverify
    // above, but strip it from any object that may be persisted to fallback
    // storage or logs.
    sanitizedData.turnstileToken = '';

    // Record IP attempt for every submission that passes validation
    recordRateLimitAttemptIp(clientIp);
```

Additionally, in the outer `catch` block that calls `saveFallbackSubmission(sanitizedData ?? formData, ...)`, the raw `formData` still carries a token if validation failed before step 0b. Add a stripping shim. Locate:

```ts
    // Try to save fallback for catastrophic errors
    // Use sanitizedData if validation already completed, otherwise fall back to raw formData
    await saveFallbackSubmission(
      sanitizedData ?? formData,
      `Catastrophic error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
```

Replace with:

```ts
    // Try to save fallback for catastrophic errors
    // Use sanitizedData if validation already completed, otherwise fall back to raw formData.
    // In both cases strip the Turnstile token before persisting.
    const fallbackData = { ...(sanitizedData ?? formData), turnstileToken: '' };
    await saveFallbackSubmission(
      fallbackData,
      `Catastrophic error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
```

### 7d. `validateAndSanitize` — preserve the field

The existing `validateAndSanitize` spreads `formData` into `sanitizedData`, so `turnstileToken` is carried through automatically. No change needed inside `validateAndSanitize` — but the field is now typed as required on `ContactFormData`, so the spread will include it. Verify after the spread block that no explicit override sets it to something weird. It does not.

---

## 8. `app/contacte/hooks/useContactForm.ts`

### 8a. Add to `initialFormData`

Locate the `// Honeypot field (anti-bot)` block in `initialFormData`:

```ts
  // Honeypot field (anti-bot)
  website: '',
};
```

Replace with:

```ts
  // Honeypot field (anti-bot)
  website: '',

  // Cloudflare Turnstile token (anti-bot CAPTCHA)
  turnstileToken: '',
};
```

### 8b. Expose a token setter

At the very bottom of the hook, in the returned object, add `setTurnstileToken`:

Locate:

```ts
  return {
    formData,
    status,
    errors,
    updateField,
    handleSubmit,
    resetForm,
    isFormValid,
    markFieldAsTouched,
  };
```

Replace with:

```ts
  const setTurnstileToken = (token: string) => {
    setFormData((prev) => ({ ...prev, turnstileToken: token }));
  };

  return {
    formData,
    status,
    errors,
    updateField,
    handleSubmit,
    resetForm,
    isFormValid,
    markFieldAsTouched,
    setTurnstileToken,
  };
```

### 8c. Reset the token on non-success responses

Inside `handleSubmit`, after the server action call, the flow already calls `resetForm()` on success and on honeypot. We also need to clear `turnstileToken` on error so the next submission uses a fresh token (the old one was consumed by siteverify).

Locate the `else if` + `else` blocks:

```ts
      } else if (result.error === 'invalid_honeypot') {
        // Silently treat as success to avoid revealing the honeypot trap to bots
        setStatus('success');
        setTimeout(() => resetForm(), 2000);
      } else {
        setStatus('error');
        toast.error(result.message || 'Error en enviar el missatge. Si us plau, torna-ho a intentar.', {
          duration: 6000,
        });
        console.error('Form submission error:', result.error);
      }
```

Replace with:

```ts
      } else if (result.error === 'invalid_honeypot') {
        // Silently treat as success to avoid revealing the honeypot trap to bots
        setStatus('success');
        setTimeout(() => resetForm(), 2000);
      } else {
        setStatus('error');
        toast.error(result.message || 'Error en enviar el missatge. Si us plau, torna-ho a intentar.', {
          duration: 6000,
        });
        console.error('Form submission error:', result.error);
        // Clear the consumed/invalid token so the widget must reset and
        // the next submission uses a fresh token.
        setFormData((prev) => ({ ...prev, turnstileToken: '' }));
      }
```

Also update the outer `catch` in `handleSubmit`:

```ts
    } catch (error) {
      toast.dismiss(loadingToast);

      setStatus('error');
      toast.error('Error inesperat. Si us plau, torna-ho a intentar més tard.', {
        duration: 6000,
      });
      console.error('Unexpected error during form submission:', error);
    }
```

Replace with:

```ts
    } catch (error) {
      toast.dismiss(loadingToast);

      setStatus('error');
      toast.error('Error inesperat. Si us plau, torna-ho a intentar més tard.', {
        duration: 6000,
      });
      console.error('Unexpected error during form submission:', error);
      setFormData((prev) => ({ ...prev, turnstileToken: '' }));
    }
```

### 8d. Gate `isFormValid`

Locate:

```ts
  const isFormValid = (): boolean => {
    return checkFormValidity(formData, errors);
  };
```

Replace with:

```ts
  const isFormValid = (): boolean => {
    // Require a Turnstile token before the submit button becomes enabled.
    if (!formData.turnstileToken) return false;
    return checkFormValidity(formData, errors);
  };
```

---

## 9. `app/contacte/page.tsx` — render the widget

Replace the file contents with:

```tsx
"use client"
import { useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useContactForm } from './hooks/useContactForm';
import { siteConfig } from '@/app/_lib/siteConfig';
import { BasicInformation } from './components/BasicInformation';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { ServiceSpecificFields } from './components/ServiceSpecificFields';
import { MessageField } from './components/MessageField';
import { ContactPreferences } from './components/ContactPreferences';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { SubmitButton } from './components/SubmitButton';

const Contact = () => {
    const {
        formData,
        status,
        errors,
        updateField,
        handleSubmit,
        isFormValid,
        markFieldAsTouched,
        setTurnstileToken,
    } = useContactForm();

    const turnstileRef = useRef<TurnstileInstance | null>(null);

    // When the form is reset (success / honeypot silent-success) or when a
    // submission fails, clear the widget so the next submission gets a
    // fresh, unconsumed token.
    const handleFormSubmitWrapped = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
        // The handleSubmit flow clears formData.turnstileToken on error/reset.
        // Force the widget to re-challenge so it emits a new token.
        turnstileRef.current?.reset();
    };

    return (
        <main className="bg-lilac">
            <form onSubmit={handleFormSubmitWrapped} className="max-w-2xl mx-auto pt-25 p-6 space-y-6">
                {/* Basic Information Section */}
                <BasicInformation formData={formData} updateField={updateField} errors={errors} markFieldAsTouched={markFieldAsTouched} />

                {/* Honeypot Field - Anti-bot trap */}
                <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                {/* Service Type Selection */}
                <ServiceTypeSelector
                    formData={formData}
                    updateField={updateField}
                />

                {/* Service-Specific Conditional Fields */}
                <ServiceSpecificFields formData={formData} updateField={updateField} errors={errors} />

                {/* Message Field */}
                <MessageField formData={formData} updateField={updateField} errors={errors} />

                {/* Contact Preferences */}
                <ContactPreferences formData={formData} updateField={updateField} />

                {/* Privacy Policy */}
                <PrivacyPolicy formData={formData} updateField={updateField} errors={errors} />

                {/* Cloudflare Turnstile (invisible / managed) */}
                <Turnstile
                    ref={turnstileRef}
                    siteKey={siteConfig.turnstileSiteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => {
                        setTurnstileToken('');
                        turnstileRef.current?.reset();
                    }}
                    options={{
                        theme: 'light',
                        size: 'invisible',
                        action: 'contact_form',
                        refreshExpired: 'auto',
                    }}
                />

                {/* Submit Button */}
                <SubmitButton status={status} isFormValid={isFormValid()} />
            </form>
        </main>
    );
};

export default Contact;
```

Notes:
- `siteConfig.turnstileSiteKey` is used rather than `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!` so that the boot-time validation in `siteConfig.ts` is the single source of truth.
- `size: 'invisible'` plus managed mode keeps the widget zero-UI for real users. If Cloudflare decides to challenge, it will surface an interactive modal automatically.
- `action: 'contact_form'` is echoed back by siteverify in the `action` field for monitoring; the server does not currently enforce an action match, and does not need to.

---

## 10. `SubmitButton.tsx` — no change required

The button is already gated on `isFormValid` (updated in step 8d to require a token). No code change here.

---

## 11. Tests

### 11a. Existing tests that need updating

All test fixtures that construct a `ContactFormData` object now need `turnstileToken: ''` because the field is non-optional. Affected files:

- `app/contacte/actions/__tests__/_fixtures.ts` — the `baseValidForm` fixture. Add `turnstileToken: 'test-token'` (or `''`, depending on what the test asserts about validation — see below).
- Any other test file that constructs a `ContactFormData` literal manually.

**Validation-layer tests** (`validateAndSanitize.test.ts`, `handleFormSubmit.test.ts` for the `validateAndSanitize` export) do NOT call the full `handleFormSubmit` and therefore do not hit `verifyTurnstile`. They can safely use `turnstileToken: ''` because `validateAndSanitize` does not inspect it. Keep the fixture as `turnstileToken: ''` and have tests that go through the full `handleFormSubmit` set an explicit value.

### 11b. New test file — `app/contacte/actions/__tests__/verifyTurnstile.test.ts`

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifyTurnstile } from '../verifyTurnstile';

const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

describe('verifyTurnstile', () => {
  const originalFetch = global.fetch;
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;

  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.TURNSTILE_SECRET_KEY = originalSecret;
    vi.restoreAllMocks();
  });

  it('TS1 — returns missing_token when token is empty', async () => {
    const result = await verifyTurnstile('', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('missing_token');
  });

  it('TS2 — returns config_error when secret missing', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const result = await verifyTurnstile('some-token', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('config_error');
  });

  it('TS3 — returns ok:true when siteverify success', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: true, 'error-codes': [] }), { status: 200 })
    ) as unknown as typeof fetch;
    const result = await verifyTurnstile('good-token', '1.2.3.4');
    expect(result.ok).toBe(true);
  });

  it('TS4 — returns duplicate_or_expired on timeout-or-duplicate', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }), { status: 200 })
    ) as unknown as typeof fetch;
    const result = await verifyTurnstile('replayed', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('duplicate_or_expired');
  });

  it('TS5 — returns invalid_token on invalid-input-response', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), { status: 200 })
    ) as unknown as typeof fetch;
    const result = await verifyTurnstile('bad', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('invalid_token');
  });

  it('TS6 — fails closed on network error after retry', async () => {
    global.fetch = vi.fn(async () => { throw new Error('network down'); }) as unknown as typeof fetch;
    const result = await verifyTurnstile('any', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('network_error');
    expect(global.fetch).toHaveBeenCalledTimes(2); // initial + one retry
  });

  it('TS7 — fails closed on non-2xx', async () => {
    global.fetch = vi.fn(async () =>
      new Response('oops', { status: 500 })
    ) as unknown as typeof fetch;
    const result = await verifyTurnstile('any', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('network_error');
  });

  it('TS8 — omits remoteip when ip is unknown', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: true, 'error-codes': [] }), { status: 200 })
    ) as unknown as typeof fetch;
    global.fetch = fetchMock;
    await verifyTurnstile('good', 'unknown');
    const [, init] = (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.remoteip).toBeUndefined();
  });

  it('TS9 — includes remoteip when ip is a real value', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: true, 'error-codes': [] }), { status: 200 })
    ) as unknown as typeof fetch;
    global.fetch = fetchMock;
    await verifyTurnstile('good', '203.0.113.10');
    const [, init] = (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.remoteip).toBe('203.0.113.10');
  });

  it('TS10 — never includes the token in log output', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), { status: 200 })
    ) as unknown as typeof fetch;
    await verifyTurnstile('SENSITIVE-TOKEN-VALUE', '1.2.3.4');
    for (const call of warnSpy.mock.calls) {
      expect(JSON.stringify(call)).not.toContain('SENSITIVE-TOKEN-VALUE');
    }
  });
});
```

### 11c. New test cases for `rateLimit.test.ts`

Add tests for `getRawClientIp`:

```ts
describe('getRawClientIp', () => {
  it('RL19 — returns x-real-ip unchanged without /64 normalization for IPv6', () => {
    const headers = new Headers({ 'x-real-ip': '2001:db8:1:2:3:4:5:6' });
    expect(getRawClientIp(headers)).toBe('2001:db8:1:2:3:4:5:6');
  });

  it('RL20 — respects CLOUDFLARE_PROXY=true for cf-connecting-ip', () => {
    const prev = process.env.CLOUDFLARE_PROXY;
    process.env.CLOUDFLARE_PROXY = 'true';
    const headers = new Headers({ 'cf-connecting-ip': '203.0.113.10', 'x-real-ip': '10.0.0.1' });
    expect(getRawClientIp(headers)).toBe('203.0.113.10');
    process.env.CLOUDFLARE_PROXY = prev;
  });

  it('RL21 — returns "unknown" when no IP header present', () => {
    expect(getRawClientIp(new Headers())).toBe('unknown');
  });
});
```

Remember to import `getRawClientIp` in that test file.

### 11d. New `handleFormSubmit` end-to-end test (TS-gate)

In a new file `app/contacte/actions/__tests__/handleFormSubmit.turnstile.test.ts`, add:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { baseValidForm } from './_fixtures';

// Must mock before importing the module under test
vi.mock('../verifyTurnstile', () => ({
  verifyTurnstile: vi.fn(),
}));
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }) },
  })),
}));

import { handleFormSubmit } from '../handleSubmit';
import { verifyTurnstile } from '../verifyTurnstile';

describe('handleFormSubmit — Turnstile gate', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('TSG1 — rejects with captcha_failed when verifyTurnstile returns ok:false', async () => {
    (verifyTurnstile as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, reason: 'invalid_token' });
    const result = await handleFormSubmit({ ...baseValidForm, turnstileToken: 'bad' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('captcha_failed');
  });

  it('TSG2 — proceeds past Turnstile when verifyTurnstile returns ok:true', async () => {
    (verifyTurnstile as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    const result = await handleFormSubmit({ ...baseValidForm, turnstileToken: 'good' });
    // May still fail on downstream (MX, rate limit) depending on test env, but
    // MUST NOT be rejected with captcha_failed.
    expect(result.error).not.toBe('captcha_failed');
  });
});
```

If the existing `handleFormSubmit.test.ts` already mocks `headers()` from `next/headers`, copy that mock into the new file. Otherwise add:

```ts
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.10' }),
}));
```

---

## 12. Errors the existing prompt sketch had (for the record)

The sketch at `.github/prompts/security-cloudflare-turnstile.prompt.md` is directionally correct but has these gaps vs. the real codebase; do NOT replicate them:

1. **References `app/contacte/components/ContactForm.tsx`** — this file does not exist. The form JSX lives directly in `app/contacte/page.tsx`.
2. **Uses `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!` in JSX** — bypasses the `siteConfig.ts` fail-fast validation layer. This spec uses `siteConfig.turnstileSiteKey`.
3. **Passes `clientIp` directly to siteverify as `remoteip`** — but `getClientIp` normalizes IPv6 to `/64`, which is not a real IP. This spec introduces `getRawClientIp`.
4. **Does not reset the widget** between submissions — tokens are single-use so a retry after any failure would always be rejected as `timeout-or-duplicate`. This spec resets via `turnstileRef` in `page.tsx`.
5. **Does not strip the token from fallback storage** — low severity (single-use, 5-min expiry) but trivial to fix.
6. **Does not add Turnstile site key to `siteConfig.ts` required env vars array** — boot-time validation is the project's pattern for public envs.
7. **Does not adapt the `SubmitButton` / `isFormValid()` gate** — without this, a user could click submit before the widget has emitted a token.
8. **Uses `onSuccess` inline but does not handle `onExpire`** — expired tokens would fail silently on the next submission.
9. **Does not specify tests** — this project has 201 tests; the new code must come with coverage.
10. **Does not mention that `validateAndSanitize` must NOT run Turnstile verification** — that function is unit-tested in isolation without request context and must stay pure.

---

## 13. Acceptance criteria

After implementation, the following must all be true:

- [ ] `pnpm build` passes.
- [ ] `pnpm test` passes, including the new tests in sections 11b, 11c, 11d.
- [ ] Submitting the form locally with the always-pass test key results in a successful submission.
- [ ] Submitting with `TURNSTILE_SECRET_KEY` unset returns `captcha_failed` (config_error path).
- [ ] Direct invocation of `handleFormSubmit` with `turnstileToken: ''` returns `{ success: false, error: 'captcha_failed' }`.
- [ ] `grep -R "formData.turnstileToken" app/contacte` shows the token is never logged, never persisted to fallback, and never put into email templates.
- [ ] The submit button is disabled until the Turnstile widget emits a token.
- [ ] After any error response, the Turnstile widget is reset on the client and a new token is issued before the next submission.
