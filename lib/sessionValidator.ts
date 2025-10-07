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

  // Stable canvas signature (deterministic)
  private getStableCanvasSignature(): string {
    try {
      if (typeof document === 'undefined') return 'no-document';
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      // Use consistent rendering for stable fingerprint
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText('Session validation', 2, 2);
      
      // Use a more stable part of the canvas data
      const imageData = ctx.getImageData(0, 0, 10, 10);
      let hash = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        hash += imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
      }
      return hash.toString(36);
    } catch {
      return 'canvas-error';
    }
  }

  // Stable WebGL signature (deterministic)
  private getStableWebGLSignature(): string {
    try {
      if (typeof document === 'undefined') return 'no-document';
      
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      if (!gl) return 'no-webgl';
      
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      const version = gl.getParameter(gl.VERSION);
      
      // Create stable hash from WebGL info
      const webglInfo = (renderer + vendor + version).replace(/\s+/g, '');
      return this.simpleHash(webglInfo).slice(0, 10);
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
