import { SessionValidator } from './sessionValidator';

// Secure token storage using browser fingerprint validation
export class SecureTokenStorage {
  private sessionValidator: SessionValidator;

  constructor() {
    this.sessionValidator = SessionValidator.getInstance();
  }

  // Generate fresh fingerprint for each request (NEVER STORE)
  public generateFingerprint(): string {
    return this.sessionValidator.generateSessionId();
  }

  // Clear any stored data (security cleanup)
  public clearSession(): void {
    if (typeof window !== 'undefined') {
      // Clear any old localStorage data for security
      localStorage.removeItem('zenow_secure_auth');
      localStorage.removeItem('zenow_session');
      localStorage.removeItem('zenow_fingerprint');
    }
  }

  // Get fingerprint info (generates fresh each time)
  public getTokenInfo(): { fingerprint: string } {
    return {
      fingerprint: this.generateFingerprint()
    };
  }
}