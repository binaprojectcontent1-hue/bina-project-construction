/**
 * Rate Limiter Service for Bina Project Dashboard
 * Prevents abuse of deploy hooks and API endpoints
 */

interface RateLimitRecord {
  timestamp: number;
  attempts: number;
  lastAttempt: number;
}

// In-memory rate limit store (for production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxAttempts: number;   // Maximum attempts per window
  blockDuration: number; // Block duration if exceeded (ms)
}

const DEFAULT_CONFIG: Readonly<RateLimitConfig> = {
  windowMs: 60 * 60 * 1000,     // 1 hour
  maxAttempts: 10,              // Max 10 requests per hour
  blockDuration: 15 * 60 * 1000, // 15 min block
};

export class RateLimiter {
  private config: RateLimitConfig;
  
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Check if request should be allowed
   */
  async isAllowed(identifier: string): Promise<{ 
    allowed: boolean; 
    remainingAttempts: number; 
    resetTime?: number;
    blockedUntil?: number;
  }> {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    // Check if currently blocked
    if (record && now < record.lastAttempt + this.config.blockDuration) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: record.lastAttempt + this.config.blockDuration,
        blockedUntil: record.lastAttempt + this.config.blockDuration,
      };
    }

    // Clean up expired records
    if (!record || now - record.timestamp > this.config.windowMs) {
      rateLimitStore.set(identifier, {
        timestamp: now,
        attempts: 0,
        lastAttempt: now,
      });
      return { allowed: true, remainingAttempts: this.config.maxAttempts };
    }

    // Current window exists - check attempts
    const currentRecord = rateLimitStore.get(identifier)!;
    
    if (currentRecord.attempts >= this.config.maxAttempts) {
      rateLimitStore.set(identifier, {
        timestamp: now,
        attempts: currentRecord.attempts,
        lastAttempt: now,
      });
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: currentRecord.timestamp + this.config.blockDuration,
        blockedUntil: currentRecord.timestamp + this.config.blockDuration,
      };
    }

    // Increment attempts
    currentRecord.attempts += 1;
    currentRecord.lastAttempt = now;
    rateLimitStore.set(identifier, currentRecord);

    return {
      allowed: true,
      remainingAttempts: this.config.maxAttempts - currentRecord.attempts,
      resetTime: currentRecord.timestamp + this.config.windowMs,
    };
  }

  /**
   * Reset rate limit for specific identifier
   */
  reset(identifier: string): void {
    rateLimitStore.delete(identifier);
  }

  /**
   * Get current rate limit status
   */
  getStatus(identifier: string): { 
    attempts: number;
    remainingAttempts: number;
    windowEndsAt: number;
    isBlocked: boolean;
    blockEndsAt?: number;
  } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record) {
      return {
        attempts: 0,
        remainingAttempts: this.config.maxAttempts,
        windowEndsAt: now + this.config.windowMs,
        isBlocked: false,
      };
    }

    const isBlocked = now < record.lastAttempt + this.config.blockDuration;
    
    return {
      attempts: record.attempts,
      remainingAttempts: Math.max(0, this.config.maxAttempts - record.attempts),
      windowEndsAt: record.timestamp + this.config.windowMs,
      isBlocked,
      blockEndsAt: isBlocked ? record.lastAttempt + this.config.blockDuration : undefined,
    };
  }
}

// Singleton instance
export const deployRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,    // 1 hour
  maxAttempts: 10,             // 10 deploys per hour
  blockDuration: 15 * 60 * 1000, // 15 min lockout
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,         // 1 minute
  maxAttempts: 30,             // 30 requests per minute
  blockDuration: 5 * 60 * 1000, // 5 min lockout
});
