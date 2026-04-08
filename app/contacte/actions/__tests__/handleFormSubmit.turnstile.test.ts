import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { baseValidForm } from './_fixtures';

vi.mock('../verifyTurnstile', () => ({
  verifyTurnstile: vi.fn(),
}));
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }) },
  })),
}));
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.10' }),
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
    expect(result.error).not.toBe('captcha_failed');
  });
});
