import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifyTurnstile } from '../verifyTurnstile';

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
    expect(global.fetch).toHaveBeenCalledTimes(2);
  }, 10000);

  it('TS7 — fails closed on non-2xx', async () => {
    global.fetch = vi.fn(async () =>
      new Response('oops', { status: 500 })
    ) as unknown as typeof fetch;
    const result = await verifyTurnstile('any', '1.2.3.4');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('network_error');
  }, 10000);

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
