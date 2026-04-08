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
