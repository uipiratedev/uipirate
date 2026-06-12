// Simple sliding-window in-memory rate limiter

const ipLimits = new Map<string, number[]>();
const emailLimits = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Checks if a login request is rate limited based on IP and Email.
 * Returns true if allowed, false if rate limited.
 */
export function checkRateLimit(ip: string, email: string): boolean {
  const now = Date.now();

  // 1. Check IP rate limit
  let ipAttempts = ipLimits.get(ip) || [];
  ipAttempts = ipAttempts.filter(timestamp => now - timestamp < WINDOW_MS);
  
  if (ipAttempts.length >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }

  // 2. Check Email rate limit
  const emailKey = email.toLowerCase().trim();
  let emailAttempts = emailLimits.get(emailKey) || [];
  emailAttempts = emailAttempts.filter(timestamp => now - timestamp < WINDOW_MS);

  if (emailAttempts.length >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }

  // 3. Register the attempt
  ipAttempts.push(now);
  ipLimits.set(ip, ipAttempts);

  emailAttempts.push(now);
  emailLimits.set(emailKey, emailAttempts);

  return true; // Allowed
}

/**
 * Clears rate limiting timestamps for a given IP and Email on successful login.
 */
export function resetRateLimit(ip: string, email: string): void {
  ipLimits.delete(ip);
  emailLimits.delete(email.toLowerCase().trim());
}
