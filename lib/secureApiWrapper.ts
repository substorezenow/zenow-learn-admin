// Secure API wrapper that validates browser fingerprint
import { TokenEncryption } from './tokenEncryption';

export class SecureApiWrapper {
  private encryption: TokenEncryption;

  constructor() {
    this.encryption = new TokenEncryption();
  }

  async secureRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Get current session ID
    const currentSessionId = this.encryption.getCurrentSessionId();
    
    // Verify session with server (stealth validation)
    try {
      const validationResponse = await fetch('/api/auth/session-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionData: currentSessionId }),
        credentials: 'include',
      });

      if (!validationResponse.ok) {
        throw new Error('Session verification failed');
      }

      const validationData = await validationResponse.json();
      if (!validationData.valid) {
        throw new Error('Session expired');
      }
    } catch (error) {
      // Silent redirect to login - no console logs
      window.location.href = '/login';
      throw error;
    }

    // Make the actual request with credentials
    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include', // Include httpOnly cookies
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Create singleton instance
export const secureApiWrapper = new SecureApiWrapper();
