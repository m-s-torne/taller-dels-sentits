import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getClientIp,
  getRawClientIp,
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
    // Ensure CLOUDFLARE_PROXY is unset between tests
    delete process.env.CLOUDFLARE_PROXY;
  });

  afterEach(() => {
    delete process.env.CLOUDFLARE_PROXY;
  });

  describe('getClientIp', () => {
    it('RL1 — extracts IP from cf-connecting-ip when CLOUDFLARE_PROXY=true', () => {
      process.env.CLOUDFLARE_PROXY = 'true';
      const headers = new Headers({
        'cf-connecting-ip': '203.0.113.1',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.1');
    });

    it('RL1b — ignores cf-connecting-ip when CLOUDFLARE_PROXY is not set (prevents spoofing)', () => {
      // Without CLOUDFLARE_PROXY, cf-connecting-ip must not be trusted
      const headers = new Headers({
        'cf-connecting-ip': '1.2.3.4',
        'x-real-ip': '203.0.113.5',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.5');
    });

    it('RL1c — falls back to x-forwarded-for if x-real-ip not present and no Cloudflare', () => {
      const headers = new Headers({
        'cf-connecting-ip': '1.2.3.4',
        'x-forwarded-for': '203.0.113.6, 10.0.0.1',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.6');
    });

    it('RL2 — uses x-real-ip when present (Vercel infrastructure header)', () => {
      const headers = new Headers({
        'x-real-ip': '203.0.113.2',
      });

      const ip = getClientIp(headers);

      expect(ip).toBe('203.0.113.2');
    });

    it('RL3 — uses x-forwarded-for when x-real-ip not present', () => {
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

    it('RL6 — allows up to 10 attempts', () => {
      for (let i = 1; i <= 9; i++) {
        recordRateLimitAttemptIp(testIp);
        expect(checkRateLimitIp(testIp)).toBe(false);
      }

      recordRateLimitAttemptIp(testIp); // 10
      expect(checkRateLimitIp(testIp)).toBe(true); // NOW blocked
    });

    it('RL7 — blocks after 10 attempts', () => {
      for (let i = 0; i < 10; i++) {
        recordRateLimitAttemptIp(testIp);
      }

      const result = checkRateLimitIp(testIp);

      expect(result).toBe(true);
    });

    it('RL8 — independent limits per IP', () => {
      const ip1 = '10.0.0.1';
      const ip2 = '10.0.0.2';

      for (let i = 0; i < 10; i++) {
        recordRateLimitAttemptIp(ip1);
      }

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
      for (let i = 1; i <= 9; i++) {
        recordRateLimitAttemptIp(testIp);
        expect(checkRateLimitIp(testIp)).toBe(false);
      }

      recordRateLimitAttemptIp(testIp); // 10
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
      for (let i = 0; i < 10; i++) {
        recordRateLimitAttemptIp(testIp);
      }

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
      for (let i = 0; i < 10; i++) {
        recordRateLimitAttemptIp(ip);
      }

      // IP should be blocked
      expect(checkRateLimitIp(ip)).toBe(true);

      // But email should still be OK
      expect(checkRateLimitEmail(email)).toBe(false);

      // Cleanup
      resetRateLimitForIp(ip);
    });

    it('RL16 — treats user+tag@example.com and user@example.com as the same rate-limit key', () => {
      resetRateLimitForEmail('user@example.com');
      recordRateLimitAttemptEmail('user+tag1@example.com');
      recordRateLimitAttemptEmail('user+tag2@example.com');
      recordRateLimitAttemptEmail('user+tag3@example.com');
      expect(checkRateLimitEmail('user@example.com')).toBe(true);
      resetRateLimitForEmail('user@example.com');
    });
  });

  describe('IPv6 normalization', () => {
    it('RL17 — normalizes IPv6 to /64 prefix', () => {
      const headers = new Headers({
        'x-real-ip': '2001:db8:abcd:1234:5678:dead:beef:cafe',
      });
      const ip = getClientIp(headers);
      expect(ip).toBe('2001:db8:abcd:1234::');
    });

    it('RL17b — normalizes IPv6 to lowercase /64 prefix', () => {
      const headers = new Headers({
        'x-real-ip': '2001:DB8:ABCD:1234:5678:DEAD:BEEF:CAFE',
      });
      const ip = getClientIp(headers);
      expect(ip).toBe('2001:db8:abcd:1234::');
    });

    it('RL18 — IPv4 addresses are not altered by normalization', () => {
      const headers = new Headers({ 'x-real-ip': '192.168.1.100' });
      const ip = getClientIp(headers);
      expect(ip).toBe('192.168.1.100');
    });
  });
});

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
