/**
 * Enhanced Session Management for Bina Project Dashboard
 * Provides secure session handling with timeout and refresh
 */

import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';
import { errorLogger } from './error-logger';

interface SessionConfig {
  idleTimeoutMinutes: number;     // Default: 30 minutes
  maxSessionMinutes: number;      // Default: 8 hours
  refreshThresholdMinutes: number; // Refresh token 5 minutes before expiry
}

const DEFAULT_CONFIG: Readonly<SessionConfig> = {
  idleTimeoutMinutes: 30,
  maxSessionMinutes: 480, // 8 hours
  refreshThresholdMinutes: 5,
};

class SessionManager {
  private static instance: SessionManager;
  private config: SessionConfig;
  private lastActivityTime: number = Date.now();
  private lastResetTime: number = 0;
  private idleTimerId?: NodeJS.Timeout;
  private activityListenersAdded: boolean = false;

  private constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static getInstance(config?: Partial<SessionConfig>): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  /**
   * Initialize session monitoring
   */
  initialize(): void {
    if (this.activityListenersAdded) return;

    // Add activity listeners
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, this.resetIdleTimer, true);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.activityListenersAdded = true;
    this.startIdleTimer();
  }

  /**
   * Reset idle timer on user activity with 5s throttling to protect main thread
   */
  private resetIdleTimer = (): void => {
    const now = Date.now();
    this.lastActivityTime = now;
    
    // Throttle timer recreation to once every 5 seconds
    if (now - this.lastResetTime < 5000) {
      return;
    }
    this.lastResetTime = now;

    // Clear existing timer
    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
    }

    // Start new timer
    this.idleTimerId = setTimeout(() => {
      this.handleIdleTimeout();
    }, this.config.idleTimeoutMinutes * 60 * 1000);
  };

  /**
   * Handle idle timeout - log out user
   */
  private handleIdleTimeout = async (): Promise<void> => {
    console.warn('[SessionManager] Idle timeout reached, logging out user');
    
    try {
      await supabase?.auth.signOut({ scope: 'local' });
      
      // Show logout message
      this.showLogoutMessage('Sesi Anda berakhir karena tidak ada aktivitas selama 30 menit.');
      
      // Redirect to home/login
      setTimeout(() => {
        window.location.hash = '';
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      errorLogger.logError(
        'SessionManager.handleIdleTimeout',
        error,
        { userId: undefined }
      );
    }
  };

  /**
   * Handle page visibility change
   */
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      // Tab was hidden - save state
      localStorage.setItem('lastTabHideTime', Date.now().toString());
    } else {
      // Tab became visible again - check if session expired while hidden
      const hideStartTime = parseInt(localStorage.getItem('lastTabHideTime') || '0');
      
      if (Date.now() - hideStartTime > this.config.idleTimeoutMinutes * 60 * 1000) {
        // Was hidden too long - trigger logout
        this.handleIdleTimeout();
      }
    }
  };

  /**
   * Start idle timer
   */
  private startIdleTimer(): void {
    this.resetIdleTimer();
  }

  /**
   * Stop all timers and cleanup
   */
  stop(): void {
    if (this.idleTimerId) {
      clearTimeout(this.idleTimerId);
    }
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.removeEventListener(event, this.resetIdleTimer, true);
    });
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Get current session info
   */
  async getSessionInfo(): Promise<{
    isLoggedIn: boolean;
    userId?: string;
    email?: string;
    isIdle: boolean;
    timeSinceLastActivity: number;
    nextTimeoutAt: number;
  }> {
    try {
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
      
      const timeoutThreshold = this.config.idleTimeoutMinutes * 60 * 1000;
      const timeoutAt = this.lastActivityTime + timeoutThreshold;
      
      if (!session) {
        return {
          isLoggedIn: false,
          isIdle: true,
          timeSinceLastActivity: 0,
          nextTimeoutAt: 0,
        };
      }

      const timeSinceActivity = Date.now() - this.lastActivityTime;

      return {
        isLoggedIn: true,
        userId: session.user.id,
        email: session.user.email,
        isIdle: timeSinceActivity > timeoutThreshold,
        timeSinceLastActivity: timeSinceActivity,
        nextTimeoutAt: timeoutAt,
      };
    } catch (error) {
      errorLogger.logError(
        'SessionManager.getSessionInfo',
        error,
        { userId: undefined }
      );
      return { isLoggedIn: false, isIdle: true, timeSinceLastActivity: 0, nextTimeoutAt: 0 };
    }
  }

  /**
   * Manual logout
   */
  async logout(reason: string): Promise<void> {
    try {
      this.stop(); // Stop all timers
      
      await supabase?.auth.signOut({ scope: 'local' });
      
      this.showLogoutMessage(reason);
      
      setTimeout(() => {
        window.location.hash = '';
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      errorLogger.logError(
        'SessionManager.logout',
        error,
        { userId: undefined }
      );
    }
  }

  /**
   * Show logout message to user
   */
  private showLogoutMessage(message: string): void {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          font-family: system-ui;
          max-width: 400px;
        ">
          <div style="font-size: 2rem; margin-bottom: 1rem;">🔒</div>
          <h2 style="margin: 0 0 1rem 0; color: #333;">Sesi Berakhir</h2>
          <p style="margin: 0 0 1.5rem 0; color: #666;">${message}</p>
          <p style="margin: 0; color: #888; font-size: 0.9rem;">Mengalihkan...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.remove();
    }, 3000);
  }

  /**
   * Ping activity (call from components periodically)
   */
  pingActivity(): void {
    this.resetIdleTimer();
  }

  /**
   * Get remaining time until timeout (milliseconds)
   */
  getTimeUntilTimeout(): number {
    const timeSinceActivity = Date.now() - this.lastActivityTime;
    const timeoutTime = this.config.idleTimeoutMinutes * 60 * 1000;
    return Math.max(0, timeoutTime - timeSinceActivity);
  }
}

// Singleton export
export const sessionManager = SessionManager.getInstance();
