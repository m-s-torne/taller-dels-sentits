/**
 * Simple in-memory rate limiter for contact form submissions
 * Tracks failed attempts by IP address AND by email address
 * Cleans up old entries periodically
 */

interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
}

const rateLimitMapIp = new Map<string, RateLimitEntry>();
const rateLimitMapEmail = new Map<string, RateLimitEntry>();

/**
 * Configuration for rate limiting
 */
const RATE_LIMIT_CONFIG = {
  // Per-IP failed attempts
  maxAttemptsIp: 3,
  windowMsIp: 5 * 60 * 1000,  // 5 minutes

  // Per-email confirmation submissions (prevents spam to third-party emails)
  maxAttemptsEmail: 3,
  windowMsEmail: 5 * 60 * 1000, // 5 minutes

  cleanupIntervalMs: 10 * 60 * 1000, // Cleanup every 10 minutes
};

// Cleanup interval
let lastCleanupTime = Date.now();

/**
 * Extract client IP from headers
 * Handles proxied requests (Vercel, Cloudflare, etc.)
 *
 * Security note: cf-connecting-ip is only trusted when CLOUDFLARE_PROXY=true is set,
 * because without Cloudflare in front, any client can spoof this header freely.
 * On Vercel, x-real-ip is set by the infrastructure and cannot be spoofed by clients.
 */
export const getClientIp = (headers: Headers): string => {
  // Only trust cf-connecting-ip when explicitly configured with Cloudflare as proxy
  if (process.env.CLOUDFLARE_PROXY === 'true') {
    const cfIp = headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();
  }

  // x-real-ip is set by Vercel/nginx infrastructure and cannot be spoofed by clients
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // x-forwarded-for: Vercel always prepends the real client IP as the first value
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return 'unknown';
};

/**
 * Check if client has exceeded rate limit (IP-based)
 * @returns true if limit exceeded, false if OK
 */
export const checkRateLimitIp = (clientIp: string): boolean => {
  const now = Date.now();

  // Cleanup old entries periodically
  if (now - lastCleanupTime > RATE_LIMIT_CONFIG.cleanupIntervalMs) {
    cleanupRateLimitMaps();
    lastCleanupTime = now;
  }

  const entry = rateLimitMapIp.get(clientIp);

  // No entry = first attempt
  if (!entry) {
    return false;
  }

  // Check if window has expired
  if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsIp) {
    // Window expired, reset
    rateLimitMapIp.delete(clientIp);
    return false;
  }

  // Check if attempt limit exceeded
  if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttemptsIp) {
    return true; // Rate limit exceeded
  }

  return false; // OK
};

/**
 * Check if email has exceeded confirmation rate limit
 * Prevents spam to third-party emails
 * @returns true if limit exceeded, false if OK
 */
export const checkRateLimitEmail = (email: string): boolean => {
  const now = Date.now();
  const entry = rateLimitMapEmail.get(email);

  // No entry = first attempt
  if (!entry) {
    return false;
  }

  // Check if window has expired
  if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsEmail) {
    // Window expired, reset
    rateLimitMapEmail.delete(email);
    return false;
  }

  // Check if attempt limit exceeded
  if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttemptsEmail) {
    return true; // Rate limit exceeded
  }

  return false; // OK
};

/**
 * Increment attempt counter for client (IP-based)
 */
export const recordRateLimitAttemptIp = (clientIp: string): void => {
  const now = Date.now();
  const entry = rateLimitMapIp.get(clientIp);

  if (!entry) {
    rateLimitMapIp.set(clientIp, {
      attempts: 1,
      firstAttemptAt: now,
    });
  } else {
    // Check if window has expired
    if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsIp) {
      // Reset window
      rateLimitMapIp.set(clientIp, {
        attempts: 1,
        firstAttemptAt: now,
      });
    } else {
      // Increment counter
      entry.attempts += 1;
    }
  }
};

/**
 * Increment attempt counter for email (prevents spam)
 */
export const recordRateLimitAttemptEmail = (email: string): void => {
  const now = Date.now();
  const entry = rateLimitMapEmail.get(email);

  if (!entry) {
    rateLimitMapEmail.set(email, {
      attempts: 1,
      firstAttemptAt: now,
    });
  } else {
    // Check if window has expired
    if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsEmail) {
      // Reset window
      rateLimitMapEmail.set(email, {
        attempts: 1,
        firstAttemptAt: now,
      });
    } else {
      // Increment counter
      entry.attempts += 1;
    }
  }
};

/**
 * Reset rate limit for IP (for testing or admin purposes)
 */
export const resetRateLimitForIp = (clientIp: string): void => {
  rateLimitMapIp.delete(clientIp);
};

/**
 * Reset rate limit for email (for testing or admin purposes)
 */
export const resetRateLimitForEmail = (email: string): void => {
  rateLimitMapEmail.delete(email);
};

/**
 * Remove expired entries from both rate limit maps
 */
const cleanupRateLimitMaps = (): void => {
  const now = Date.now();

  // Cleanup IP map
  for (const [ip, entry] of rateLimitMapIp.entries()) {
    if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsIp) {
      rateLimitMapIp.delete(ip);
    }
  }

  // Cleanup email map
  for (const [email, entry] of rateLimitMapEmail.entries()) {
    if (now - entry.firstAttemptAt > RATE_LIMIT_CONFIG.windowMsEmail) {
      rateLimitMapEmail.delete(email);
    }
  }

  console.log(`[Rate Limit] Cleanup: ${rateLimitMapIp.size} active IPs, ${rateLimitMapEmail.size} active emails`);
};

/**
 * Get current rate limit stats (for monitoring)
 */
export const getRateLimitStats = () => {
  return {
    activeIps: rateLimitMapIp.size,
    activeEmails: rateLimitMapEmail.size,
    config: RATE_LIMIT_CONFIG,
  };
};
