/**
 * Error Logging & Monitoring Service
 * Provides secure error logging without exposing sensitive information
 */

interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  context: string;
  message: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private enabled: boolean = true;
  private monitorUrl?: string;

  private constructor() {
    // Check if Sentry or similar is configured
    this.monitorUrl = import.meta.env.VITE_MONITORING_URL;
    this.enabled = !!this.monitorUrl || import.meta.env.DEV;
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Set monitoring URL (for production)
   */
  setMonitoringUrl(url: string): void {
    this.monitorUrl = url;
    this.enabled = true;
  }

  /**
   * Enable/disable error reporting
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Log an error with proper sanitization
   */
  logError(context: string, error: unknown, additionalInfo?: {
    userId?: string;
    sessionId?: string;
    userAction?: string;
    endpoint?: string;
  }): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      context,
      message: this.sanitizeErrorMessage(error),
      userId: additionalInfo?.userId,
      sessionId: additionalInfo?.sessionId,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...additionalInfo,
      },
    };

    // Client-side console (sanitized)
    console.error(`[${entry.timestamp}] [${context}] ${entry.message}`);

    // Send to monitoring service if configured
    if (this.enabled && this.monitorUrl) {
      this.sendToMonitoringService(entry);
    }
  }

  /**
   * Log a warning
   */
  logWarn(context: string, message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      context,
      message,
      metadata,
    };

    console.warn(`[${entry.context}] ${entry.message}`);

    if (this.enabled && this.monitorUrl) {
      this.sendToMonitoringService(entry);
    }
  }

  /**
   * Log debug info (only in development)
   */
  logDebug(context: string, message: string): void {
    if (import.meta.env.DEV) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        context,
        message,
      };
      console.debug(`[${entry.context}] ${entry.message}`);
    }
  }

  /**
   * Sanitize error message to prevent information leakage
   */
  private sanitizeErrorMessage(error: unknown): string {
    // Don't expose actual error objects in production
    if (typeof error === 'string') {
      return error.substring(0, 500); // Limit length
    }

    if (error instanceof Error) {
      // Return only the message, not stack trace in production
      const message = error.message.substring(0, 500);
      
      if (!import.meta.env.DEV) {
        return `[${error.name}] Error occurred`;
      }
      
      return message;
    }

    // For other types, just convert to string
    try {
      return String(error).substring(0, 500);
    } catch {
      return 'Unknown error';
    }
  }

  /**
   * Send error to external monitoring service
   */
  private async sendToMonitoringService(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.monitorUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environment: import.meta.env.PROD ? 'production' : 'development',
          ...(entry as any),
        }),
        // Don't wait for response to avoid blocking
        keepalive: true,
      });
    } catch {
      // Silently fail - don't expose monitoring failures
      console.error('Failed to send error to monitoring service');
    }
  }
}

// Singleton export
export const errorLogger = ErrorHandler.getInstance();
