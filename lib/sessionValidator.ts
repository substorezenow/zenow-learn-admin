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

  // Generate unique session identifier
  public generateSessionId(): string {
    if (this.sessionId) {
      return this.sessionId;
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      this.sessionId = 'server-side-fallback';
      return this.sessionId;
    }

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || 'unknown',
      this.getCanvasSignature(),
      this.getWebGLSignature(),
    ];

    // Create hash from components
    const combined = components.join('|');
    this.sessionId = this.simpleHash(combined);
    
    return this.sessionId;
  }

  // Canvas signature
  private getCanvasSignature(): string {
    try {
      if (typeof document === 'undefined') return 'no-document';
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Session validation', 2, 2);
      
      return canvas.toDataURL().slice(-50); // Last 50 chars
    } catch {
      return 'canvas-error';
    }
  }

  // WebGL signature
  private getWebGLSignature(): string {
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
