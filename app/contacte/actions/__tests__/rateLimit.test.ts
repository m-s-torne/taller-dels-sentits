import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getClientIp,
  checkRateLimitIp,
  checkRateLimitEmail,
  recordRateLimitAttemptIp,
  recordRateLimitAttemptEmail,
  resetRateLimitForIp,
  resetRateLimitForEmail,
} from '@/app/contacte/lib/rateLimit';

describe('rateLimit', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    // Reset rate limit before each test
    resetRateLimitForIp(testIp);
  });

  describe('getClientIp', () => {
    it('RL1 — extracts IP from cf-connecting-ip header', () => {
      const headers = new Headers({
        'cf-connecting-ip': '203.0.113.1',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('RL2 — uses x-forwarded-for if cf-connecting-ip not present', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.2, 203.0.113.99',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.2');
    });

    it('RL3 — trims whitespace from x-forwarded-for', () => {
      const headers = new Headers({
        'x-forwarded-for': ' 203.0.113.3 , 203.0.113.99',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.3');
    });

    it('RL4 — returns unknown if no headers', () => {
      const headers = new Headers({});

      const ip = getClientIp(headers);

      expect(ip).toBe('unknown');
    });
  });

  describe('checkRateLimitIp', () => {
    it('RL5 — returns false for first attempt', () => {
      const result = checkRateLimitIp(testIp);

      expect(result).toBe(false);
    });

    it('RL6 — allows up to 3 failed attempts', () => {
      recordRateLimitAttemptIp(testIp); // 1
      expect(checkRateLimitIp(testIp)).toBe(false);

      recordRateLimitAttemptIp(testIp); // 2
      expect(checkRateLimitIp(testIp)).toBe(false);

      recordRateLimitAttemptIp(testIp); // 3
      expect(checkRateLimitIp(testIp)).toBe(true); // NOW blocked
    });

    it('RL7 — blocks after 3 attempts', () => {
      recordRateLimitAttemptIp(testIp);
      recordRateLimitAttemptIp(testIp);
      recordRateLimitAttemptIp(testIp);

      const result = checkRateLimitIp(testIp);

      expect(result).toBe(true);
    });

    it('RL8 — independent limits per IP', () => {
      const ip1 = '10.0.0.1';
      const ip2 = '10.0.0.2';

      recordRateLimitAttemptIp(ip1);
      recordRateLimitAttemptIp(ip1);
      recordRateLimitAttemptIp(ip1);

      // ip1 should be blocked
      expect(checkRateLimitIp(ip1)).toBe(true);

      // ip2 should not be blocked
      expect(checkRateLimitIp(ip2)).toBe(false);

      // Cleanup
      resetRateLimitForIp(ip1);
      resetRateLimitForIp(ip2);
    });
  });

  describe('recordRateLimitAttemptIp', () => {
    it('RL9 — increments attempt counter', () => {
      recordRateLimitAttemptIp(testIp);
      expect(checkRateLimitIp(testIp)).toBe(false);

      recordRateLimitAttemptIp(testIp);
      expect(checkRateLimitIp(testIp)).toBe(false);

      recordRateLimitAttemptIp(testIp);
      expect(checkRateLimitIp(testIp)).toBe(true);
    });

    it('RL10 — creates entry if not exists', () => {
      expect(checkRateLimitIp(testIp)).toBe(false);

      recordRateLimitAttemptIp(testIp);

      expect(checkRateLimitIp(testIp)).toBe(false);
    });
  });

  describe('resetRateLimitForIp', () => {
    it('RL11 — clears rate limit for specific IP', () => {
      recordRateLimitAttemptIp(testIp);
      recordRateLimitAttemptIp(testIp);
      recordRateLimitAttemptIp(testIp);

      expect(checkRateLimitIp(testIp)).toBe(true);

      resetRateLimitForIp(testIp);

      expect(checkRateLimitIp(testIp)).toBe(false);
    });
  });

  describe('Email rate limiting', () => {
    const testEmail = 'test@example.com';

    beforeEach(() => {
      resetRateLimitForEmail(testEmail);
    });

    it('RL12 — checks email rate limit independently', () => {
      const result = checkRateLimitEmail(testEmail);

      expect(result).toBe(false);
    });

    it('RL13 — blocks email after 3 attempts', () => {
      recordRateLimitAttemptEmail(testEmail);
      recordRateLimitAttemptEmail(testEmail);
      recordRateLimitAttemptEmail(testEmail);

      expect(checkRateLimitEmail(testEmail)).toBe(true);
    });

    it('RL14 — prevents spam to same email', () => {
      const email1 = 'victim@example.com';
      const email2 = 'another@example.com';

      // Spam three submissions to email1
      recordRateLimitAttemptEmail(email1);
      recordRateLimitAttemptEmail(email1);
      recordRateLimitAttemptEmail(email1);

      // email1 should be blocked
      expect(checkRateLimitEmail(email1)).toBe(true);

      // email2 should not be blocked
      expect(checkRateLimitEmail(email2)).toBe(false);

      // Cleanup
      resetRateLimitForEmail(email1);
      resetRateLimitForEmail(email2);
    });

    it('RL15 — independent from IP limits', () => {
      const ip = '1.1.1.1';
      const email = 'independent@example.com';

      // Max out IP limit
      recordRateLimitAttemptIp(ip);
      recordRateLimitAttemptIp(ip);
      recordRateLimitAttemptIp(ip);

      // IP should be blocked
      expect(checkRateLimitIp(ip)).toBe(true);

      // But email should still be OK
      expect(checkRateLimitEmail(email)).toBe(false);

      // Cleanup
      resetRateLimitForIp(ip);
    });
  });
});
