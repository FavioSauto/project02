/**
 * Rate limiter utility using sliding window algorithm
 * Tracks requests per IP address with configurable limits
 */

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   */
  maxRequests: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

interface RequestLog {
  /**
   * Timestamps of requests within the current window
   */
  timestamps: number[];
  /**
   * Last cleanup timestamp to prevent memory leaks
   */
  lastCleanup: number;
}

/**
 * In-memory store for rate limiting
 * Maps IP addresses to their request logs
 */
const requestStore = new Map<string, RequestLog>();

/**
 * Cleanup interval to prevent memory leaks (runs every 10 minutes)
 */
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastGlobalCleanup = Date.now();

/**
 * Checks if a request should be rate limited
 * Uses sliding window algorithm for accurate rate limiting
 *
 * @param identifier - Unique identifier (typically IP address)
 * @param config - Rate limit configuration
 * @returns Object containing whether request is allowed and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Perform global cleanup periodically
  if (now - lastGlobalCleanup > CLEANUP_INTERVAL_MS) {
    performGlobalCleanup(now, config.windowMs);
    lastGlobalCleanup = now;
  }

  // Get or create request log for this identifier
  let log = requestStore.get(identifier);

  if (!log) {
    log = {
      timestamps: [],
      lastCleanup: now,
    };
    requestStore.set(identifier, log);
  }

  // Remove timestamps outside the current window
  log.timestamps = log.timestamps.filter((timestamp) => timestamp > windowStart);
  log.lastCleanup = now;

  // Check if limit is exceeded
  const requestCount = log.timestamps.length;
  const allowed = requestCount < config.maxRequests;

  if (allowed) {
    // Add current request timestamp
    log.timestamps.push(now);
  }

  // Calculate remaining requests and reset time
  const remaining = Math.max(0, config.maxRequests - log.timestamps.length);
  const oldestTimestamp = log.timestamps[0] || now;
  const resetAt = oldestTimestamp + config.windowMs;

  return {
    allowed,
    remaining,
    resetAt,
  };
}

/**
 * Performs global cleanup to prevent memory leaks
 * Removes stale entries from the request store
 *
 * @param now - Current timestamp
 * @param windowMs - Time window in milliseconds
 */
function performGlobalCleanup(now: number, windowMs: number): void {
  const staleThreshold = now - windowMs * 2; // Keep entries for 2x window duration

  for (const [identifier, log] of requestStore.entries()) {
    // Remove entry if no recent activity
    if (log.lastCleanup < staleThreshold) {
      requestStore.delete(identifier);
    }
  }
}

/**
 * Clears all rate limit data for a specific identifier
 * Useful for testing or manual resets
 *
 * @param identifier - Unique identifier to clear
 */
export function clearRateLimit(identifier: string): void {
  requestStore.delete(identifier);
}

/**
 * Clears all rate limit data
 * Useful for testing or system maintenance
 */
export function clearAllRateLimits(): void {
  requestStore.clear();
  lastGlobalCleanup = Date.now();
}

/**
 * Checks user-based rate limit (used after authentication)
 * Uses user ID as identifier for granular per-user limits
 *
 * @param userId - User ID
 * @param config - Rate limit configuration
 * @returns Object containing whether request is allowed and remaining requests
 */
export function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  // Use user ID prefixed with 'user:' to separate from IP-based limits
  return checkRateLimit(`user:${userId}`, config);
}

/**
 * IP-based rate limit for SSE connections (DDoS protection)
 * Loose limit: 50 connections per 10 minutes per IP
 * This is intentionally lenient to allow multiple users behind same IP (corporate networks, VPNs)
 */
export const SSE_IP_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 50,
  windowMs: 10 * 60 * 1000, // 10 minutes
};

/**
 * User-based rate limit for Pro tier SSE connections
 * Strict limit: 10 connections per 10 minutes per user
 */
export const PRO_USER_SSE_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 10 * 60 * 1000, // 10 minutes
};

/**
 * Pre-configured rate limit for general API endpoints
 * 100 requests per minute per IP
 */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};
