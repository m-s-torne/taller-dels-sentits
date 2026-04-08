---
name: Turnstile Security Analysis
description: Threat model, placement rationale, failure modes, and residual risks for Turnstile integration on the contact form.
type: project
---

# Turnstile Security Analysis — Contact Form

## 1. Threat model

### What Turnstile mitigates

- **Automated form submission** by headless browsers, simple HTTP scripts, and low-effort botnets. This is the primary gap: the current in-memory dual rate limiter (per-IP 10/5min, per-email 3/5min) can be bypassed by an attacker rotating IPs + emails, because each rotation starts with a fresh bucket and the Maps reset on every Vercel cold start.
- **Resource abuse against downstream services**: the server action performs a synchronous DNS MX lookup, calls Resend (paid, quota-limited), and writes to fallback storage. Each of these has a cost per submission that Turnstile can shift onto the attacker.
- **Credential/contact list enumeration via the "email" side-channel**: without a challenge, a bot can probe whether a given email domain has valid MX by watching for the MX-reject vs. accept response.

### What Turnstile does NOT mitigate

- **A determined attacker using real browsers + solver services** (human CAPTCHA farms, or Turnstile-specific solvers). These exist and are affordable; Turnstile raises the cost, it does not eliminate it.
- **Application-layer flaws** (XSS, injection, authorization). Orthogonal to Turnstile.
- **Abuse from a single compromised legitimate session** (stolen token reuse is blocked by single-use, but a real user could still spam once per widget refresh).
- **DoS at the HTTP layer**: Turnstile is verified inside the Server Action, meaning the request still consumes a Vercel function invocation before being rejected. Turnstile stops downstream cost amplification, not the initial invocation cost.
- **The known Gmail dot-alias rate-limit bypass** (`j.o.h.n@gmail.com` vs. `john@gmail.com`) — documented limitation of `rateLimit.ts`, unchanged by this integration.

## 2. Placement rationale inside `handleFormSubmit`

The existing pipeline is:

```
0. Extract client IP
0a. checkRateLimitIp        <-- current first gate
1. validateAndSanitize (honeypot -> format -> enum -> MX lookup)
   recordRateLimitAttemptIp (on failure) / (unconditionally after success)
2. checkRateLimitEmail
   recordRateLimitAttemptEmail
3. buildEmailMessage
4. Resend send + retry
5. Fallback on failure
```

**Recommended placement of Turnstile verification: between step 0 (IP extraction) and step 0a (`checkRateLimitIp`).**

Reasoning:

1. **Before the IP rate limiter**: if Turnstile verification happens first, a bot that fails the challenge never consumes an IP bucket slot. Real users whose IP is shared (NAT, corporate proxy, mobile carrier CGNAT) are protected from DoS by bots on the same egress IP, because bots can't accumulate failed attempts against that shared IP.

2. **Before the honeypot check (inside `validateAndSanitize`)**: the honeypot's value is to silently drop naive bots without revealing the trap. That signal is most valuable against the cheapest bots, and cheap bots will fail Turnstile anyway. More importantly, `validateAndSanitize` performs a DNS MX lookup, which is a network call we don't want unauthenticated clients to trigger. Turnstile must come first to gate that cost.

3. **Before the per-email rate limiter**: same reason — `checkRateLimitEmail` is only reachable after `validateAndSanitize`, so this is automatic once Turnstile gates that path.

4. **Token verification must NOT be inside `validateAndSanitize`**. That function is exported and unit-tested without headers/IP context. Keep Turnstile in `handleFormSubmit` where `clientIp` is already in scope.

The prior prompt sketch at `.github/prompts/security-cloudflare-turnstile.prompt.md` places Turnstile "before rate limit check" which is correct. It is not explicit about placing it *before* IP extraction's record call nor about its interaction with honeypot — this spec is.

## 3. Token replay surface

Turnstile tokens are single-use: the siteverify endpoint returns `timeout-or-duplicate` on the second call. However:

- **Concurrent double-submit**: if the client fires two submissions with the same token (double-click, retry), both requests arrive at siteverify. Only one wins; the other returns `timeout-or-duplicate` and we treat it as a failure. Client-side submit disabling during `status === 'sending'` already prevents this. No server-side dedupe needed.
- **Token leakage via logs**: the token appears in `formData`. We must not log `formData` verbatim anywhere. Current code logs redacted IP/email only — safe. New code must not add `console.log(formData)`.
- **Token leakage via fallback file**: `saveFallbackSubmission` persists the form to disk on failure. The token is useless after 5 minutes and single-use, but as a defense-in-depth measure the spec strips `turnstileToken` before calling `saveFallbackSubmission`.
- **Replay after successful submit**: the token is consumed by siteverify on the first successful call. Any retry from the same client must use a fresh token. The client-side widget must reset after submission.

## 4. Fail-open vs. fail-closed on siteverify network failure

**Decision: fail closed.** Return `captcha_failed` if:
- `fetch` throws (network error, DNS failure).
- HTTP status is not 2xx.
- Response JSON is malformed.
- `success !== true`.

Rationale:
- The contact form is low-volume; a brief Cloudflare outage causing a few rejected legitimate submissions is an acceptable cost. The user message directs them to retry or use direct email.
- Fail-open during a Cloudflare outage would be detectable by attackers (they can observe Cloudflare status) and would remove the only hard gate against IP+email rotation.
- The `internal-error` response code is the one case where Cloudflare documentation suggests retry. We do a single retry (bounded, 500ms) on `internal-error` only, then fail closed.

## 5. `remoteip` parameter safety

The spec passes `clientIp` from `getClientIp(requestHeaders)`. That function's priority chain is:

1. `cf-connecting-ip` — only if `CLOUDFLARE_PROXY=true`.
2. `x-real-ip` — set by Vercel, not client-spoofable.
3. `x-forwarded-for` first value — Vercel prepends the real client IP.
4. `'unknown'` fallback.

`getClientIp` also normalizes IPv6 to a `/64` prefix (`a:b:c:d::`) for rate-limit keying. **This normalized form must NOT be sent to siteverify.** Cloudflare expects a real IP. The spec uses a separate `getRawClientIp` helper (does not normalize) for Turnstile.

If `clientIp === 'unknown'`, we pass `undefined` for `remoteip` rather than the literal string `'unknown'`. Cloudflare treats `remoteip` as advisory; omitting it is valid.

## 6. Client token lifecycle

Failure cases that invalidate a token and require a fresh one:
- **Server-side validation failure** (any validation error returned): token was either not yet consumed (if rejected before siteverify) or consumed (if rejected after). Safest: always reset the widget after any non-success response.
- **Rate-limit rejection**: same — reset the widget.
- **Honeypot rejection**: currently returns `error: 'invalid_honeypot'` which the client treats as silent success. The widget is reset by the form reset anyway.
- **Natural 5-minute expiry**: handled by `onExpire` callback, which calls `ref.current?.reset()`.

Implementation: keep a `turnstileRef` in the form component; call `turnstileRef.current?.reset()` in the catch-all post-submit cleanup whenever `result.success !== true`.

## 7. SSR/prerender gating

`app/contacte/page.tsx` is already a `"use client"` component, so the widget script loads fine. However:

- On first paint, the widget has not yet produced a token → `formData.turnstileToken === ''`.
- The submit button is currently gated by `isFormValid()`. We must extend that gate to also require `turnstileToken` to be non-empty.
- If the user disables JS entirely, the widget never loads, the button stays disabled, no submission is possible — acceptable.
- If a Server Action is invoked directly (e.g. via `curl` against the action endpoint), `turnstileToken` will be absent → fails siteverify → rejected. The `invalid_honeypot` silent-success pattern does NOT apply to Turnstile failures; we return an honest `captcha_failed` error because hiding it gives no anti-bot benefit (the bot already lacks a token).

## 8. Package choice

`@marsidev/react-turnstile` is the recommended wrapper:
- Actively maintained, used in the Next.js App Router ecosystem.
- Provides `ref.reset()` which is required for our retry/expire flow.
- No known CVEs.
- Supports the `"invisible"` size for managed mode.

There is no "official Cloudflare react-turnstile" package; the alternative is dropping the raw `https://challenges.cloudflare.com/turnstile/v0/api.js` script manually, which is more code for no security benefit.

## 9. Env var validation gaps in `siteConfig.ts`

Current `siteConfig.ts` only validates `NEXT_PUBLIC_*` vars at module load. It does NOT validate `RESEND_API_KEY` (server-only) — that is checked lazily inside `handleFormSubmit`. For consistency, `TURNSTILE_SECRET_KEY` should likewise be checked lazily inside the verification helper (so missing secret is a clear error code path, not an import crash) AND `NEXT_PUBLIC_TURNSTILE_SITE_KEY` must be added to the `requiredPublicEnvVars` array so the site fails fast on boot if misconfigured.

## 10. Residual risks after implementation

| Risk | Severity | Notes |
|------|----------|-------|
| CAPTCHA-solver-as-a-service abuse | Medium | Monetary cost to attacker ~$0.001/solve; still profitable for large-scale spam. Mitigated by per-email rate limit (3/5min). |
| Turnstile outage blocks all submissions | Low | Fail-closed decision; acceptable for low-volume form. Provide fallback direct-email CTA in error UI. |
| Token leakage via fallback file | Low | Spec strips token before `saveFallbackSubmission`. |
| Bot still consumes one Vercel function invocation per attempt | Low | Turnstile is checked inside the Server Action; cannot gate at edge without Vercel middleware. Consider Middleware-based gating in future if invocation volume becomes a cost issue. |
| `cf-connecting-ip` trust when `CLOUDFLARE_PROXY=true` | Low | Unchanged; if a bot spoofs that header without Cloudflare actually in front, Turnstile siteverify's own `remoteip` will just be wrong. Not a new risk. |
| Double-submit race | Very low | Client `status === 'sending'` gate + Turnstile single-use on server. |
