// Session validation utility
export class SessionValidator {
  private static instance: SessionValidator;
  private sessionId: string | null = null;

  private constructor() {}

  public static getInstance(): SessionValidator {
    if (!SessionValidator.instance) {
      SessionValidator.instance = new SessionValidator();
    }
    return SessionValidator.instance;
  }

  // Generate unique session identifier (deterministic)
  public generateSessionId(): string {
    if (this.sessionId) {
      return this.sessionId;
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      this.sessionId = 'server-side-fallback';
      return this.sessionId;
    }

    // Use stable browser characteristics for consistent fingerprinting
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || 'unknown',
      navigator.platform,
      navigator.cookieEnabled.toString(),
      // Use stable canvas signature
      this.getStableCanvasSignature(),
      // Use stable WebGL signature  
      this.getStableWebGLSignature(),
    ];

    // Create hash from components
    const combined = components.join('|');
    this.sessionId = this.simpleHash(combined);
    
    return this.sessionId;
  }

  // Advanced canvas signature (as per documentation)
  private getStableCanvasSignature(): string {
    try {
      if (typeof document === 'undefined') return 'no-document';
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Session validation', 2, 2);
      
      return canvas.toDataURL().slice(-50);
    } catch {
      return 'canvas-error';
    }
  }

  // Advanced WebGL signature (as per documentation)
  private getStableWebGLSignature(): string {
    try {
      if (typeof document === 'undefined') return 'no-document';
      
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      if (!gl) return 'no-webgl';
      
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      
      return (renderer + vendor).slice(0, 20);
    } catch {
      return 'webgl-error';
    }
  }

  // Simple hash function
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
