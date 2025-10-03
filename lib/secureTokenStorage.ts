import { TokenEncryption } from './tokenEncryption';

// Secure token storage using browser fingerprint encryption
export class SecureTokenStorage {
  private encryption: TokenEncryption;
  private readonly STORAGE_KEY = 'zenow_secure_auth';

  constructor() {
    this.encryption = new TokenEncryption();
  }

  // Store encrypted token (DEPRECATED - use httpOnly cookies instead)
  public storeToken(token: string): boolean {
    try {
      // Encrypt the token using browser fingerprint
      const encryptedToken = this.encryption.encryptToken(token);
      
      // Store in localStorage (encrypted)
      localStorage.setItem(this.STORAGE_KEY, encryptedToken);
      
      // Also store session ID for validation
      const sessionId = this.encryption.getCurrentSessionId();
      localStorage.setItem('zenow_session', sessionId);
      
      return true;
    } catch (error) {
      console.error('Failed to store token:', error);
      return false;
    }
  }

  // Store only session ID for validation (SECURE APPROACH)
  public storeSession(): boolean {
    try {
      // Store session ID for validation
      const sessionId = this.encryption.getCurrentSessionId();
      localStorage.setItem('zenow_session', sessionId);
      
      return true;
    } catch (error) {
      console.error('Failed to store session:', error);
      return false;
    }
  }

  // Retrieve and decrypt token
  public getToken(): string | null {
    try {
      const encryptedToken = localStorage.getItem(this.STORAGE_KEY);
      if (!encryptedToken) {
        return null;
      }

      // Validate session
      if (!this.validateSession()) {
        this.clearToken();
        return null;
      }

      // Decrypt the token
      const decryptedToken = this.encryption.decryptToken(encryptedToken);
      return decryptedToken;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearToken();
      return null;
    }
  }

  // Clear stored token
  public clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('zenow_session');
  }

  // Clear only session
  public clearSession(): void {
    localStorage.removeItem('zenow_session');
  }

  // Validate session
  public validateSession(): boolean {
    try {
      const storedSession = localStorage.getItem('zenow_session');
      if (!storedSession) {
        return false;
      }

      const currentSession = this.encryption.getCurrentSessionId();
      
      // Allow some tolerance for minor changes (like window resize)
      return this.sessionsMatch(storedSession, currentSession);
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }


  // Compare sessions with tolerance
  private sessionsMatch(stored: string, current: string): boolean {
    // For demo purposes, we'll be strict
    // In production, you might want to allow minor changes
    return stored === current;
  }

  // Check if token exists
  public hasToken(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  // Get token info (without decrypting)
  public getTokenInfo(): { exists: boolean; session: string | null } {
    return {
      exists: this.hasToken(),
      session: localStorage.getItem('zenow_session')
    };
  }
}
