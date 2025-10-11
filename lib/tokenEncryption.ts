import { SessionValidator } from './sessionValidator';

export class TokenEncryption {
  private sessionValidator: SessionValidator;
  private keyCache: Map<string, CryptoKey> = new Map();

  constructor() {
    this.sessionValidator = SessionValidator.getInstance();
  }

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

  public async encryptToken(token: string): Promise<string> {
    try {
      const sessionId = this.sessionValidator.generateSessionId();
      const key = await this.generateAESKey(sessionId);
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        new TextEncoder().encode(token)
      );
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Token encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  public async decryptToken(encryptedToken: string): Promise<string | null> {
    try {
      const sessionId = this.sessionValidator.generateSessionId();
      const key = await this.generateAESKey(sessionId);
      
      const combined = new Uint8Array(
        atob(encryptedToken).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
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

  private generateKeyMaterial(sessionId: string): string {
    let key = sessionId;
    for (let i = 0; i < 5; i++) {
      key += this.simpleHash(key);
    }
    return key.slice(0, 32);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  public getCurrentSessionId(): string {
    return this.sessionValidator.generateSessionId();
  }

  public clearKeyCache(): void {
    this.keyCache.clear();
  }
}
