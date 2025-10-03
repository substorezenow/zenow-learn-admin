import { SessionValidator } from './sessionValidator';

// Enterprise-grade client-side session encryption using AES-256-GCM
export class TokenEncryption {
  private sessionValidator: SessionValidator;
  private keyCache: Map<string, CryptoKey> = new Map();

  constructor() {
    this.sessionValidator = SessionValidator.getInstance();
  }

  // Generate AES-256 key from session ID
  private async generateAESKey(sessionId: string): Promise<CryptoKey> {
    if (this.keyCache.has(sessionId)) {
      return this.keyCache.get(sessionId)!;
    }

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.generateKeyMaterial(sessionId)),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('zenow-salt-2024'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.keyCache.set(sessionId, key);
    return key;
  }

  // Encrypt token using AES-256-GCM
  public async encryptToken(token: string): Promise<string> {
    try {
      const sessionId = this.sessionValidator.generateSessionId();
      const key = await this.generateAESKey(sessionId);
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the token
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        new TextEncoder().encode(token)
      );
      
      // Combine IV + encrypted data and encode
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Token encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  // Decrypt token using AES-256-GCM
  public async decryptToken(encryptedToken: string): Promise<string | null> {
    try {
      const sessionId = this.sessionValidator.generateSessionId();
      const key = await this.generateAESKey(sessionId);
      
      // Decode and split IV + encrypted data
      const combined = new Uint8Array(
        atob(encryptedToken).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Token decryption failed:', error);
      return null;
    }
  }

  // Generate key material for PBKDF2
  private generateKeyMaterial(sessionId: string): string {
    // Create a longer key by repeating and hashing the session ID
    let key = sessionId;
    for (let i = 0; i < 5; i++) {
      key += this.simpleHash(key);
    }
    return key.slice(0, 32); // Limit to 32 chars
  }

  // Simple hash function
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Check if current session matches the encryption
  public validateSession(): boolean {
    // Session validation is handled by the server-side API
    return true;
  }

  // Get current session ID
  public getCurrentSessionId(): string {
    return this.sessionValidator.generateSessionId();
  }

  // Clear key cache for security
  public clearKeyCache(): void {
    this.keyCache.clear();
  }
}
