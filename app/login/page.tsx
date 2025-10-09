"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering for Cloudflare Workers

// Dynamic import to prevent SSR issues
let SecureTokenStorage: typeof import("../../lib/secureTokenStorage").SecureTokenStorage | null = null;
if (typeof window !== 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SecureTokenStorage = require("../../lib/secureTokenStorage").SecureTokenStorage;
  } catch (error) {
    console.error('Failed to load SecureTokenStorage:', error);
  }
}


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    success?: boolean;
    message?: string;
    debug?: {
      timestamp: string;
      environment: string;
      backendUrl: string;
      requestUrl: string;
      requestHeaders: Record<string, string>;
      cookies: Array<{ name: string; value: string }>;
      userAgent: string;
      cfRay?: string;
      cfConnectingIp?: string;
      cfCountry?: string;
      cfRegion?: string;
      cfCity?: string;
    };
    backendHealth?: unknown;
    backendError?: string;
    error?: string;
  } | null>(null);
  const router = useRouter();

  const runDebugTest = async () => {
    console.log('🔍 [DEBUG] Starting debug test...');
    try {
      // Test minimal endpoint first
      console.log('🧪 [DEBUG] Testing minimal endpoint...');
      const minimalRes = await fetch('/api/minimal');
      const minimalData = await minimalRes.json();
      console.log('🧪 [DEBUG] Minimal endpoint response:', minimalData);
      console.log(minimalData.consoleLog || '🧪 [DEBUG] No console log from minimal API');
      
      // Test debug endpoint
      console.log('🔍 [DEBUG] Testing debug endpoint...');
      const debugRes = await fetch('/api/debug');
      const debugData = await debugRes.json();
      console.log('🔍 [DEBUG] Debug endpoint response:', debugData);
      console.log(debugData.consoleLog || '🔍 [DEBUG] No console log from API');
      setDebugInfo(debugData);
      
      // Test backend connectivity
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      console.log('🔍 [DEBUG] Testing backend connectivity to:', backendUrl);
      
      try {
        const backendTest = await fetch(`${backendUrl}/api/health`);
        const backendData = await backendTest.json();
        console.log('🔍 [DEBUG] Backend health check:', backendData);
        setDebugInfo(prev => ({ ...prev, backendHealth: backendData }));
      } catch (backendError) {
        console.error('🔍 [DEBUG] Backend connectivity error:', backendError);
        setDebugInfo(prev => ({ ...prev, backendError: (backendError as Error).message }));
      }
      
    } catch (error) {
      console.error('🔍 [DEBUG] Debug test error:', error);
      setDebugInfo({ error: (error as Error).message });
    }
  };

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Generate session ID silently - only in browser
    if (typeof window !== 'undefined' && SecureTokenStorage) {
      try {
        const tokenStorage = new SecureTokenStorage();
        setFingerprint(tokenStorage['encryption'].getCurrentSessionId());
      } catch (error) {
        console.error('Error generating fingerprint:', error);
        setFingerprint('fallback');
      }
    } else {
      setFingerprint('fallback');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 [LOGIN-PAGE] Starting login process');
    console.log('🔐 [LOGIN-PAGE] Username:', username ? '***' : 'missing');
    console.log('🔐 [LOGIN-PAGE] Password:', password ? '***' : 'missing');
    console.log('🔐 [LOGIN-PAGE] Fingerprint:', fingerprint ? '***' : 'missing');
    
    if (!username || !password) {
      console.log('❌ [LOGIN-PAGE] Missing username or password');
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("fingerprint", fingerprint || "fallback");
      
      console.log("🔐 [LOGIN-PAGE] Attempting login with:", { 
        username, 
        fingerprint: fingerprint ? '***' : 'missing',
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: key === 'password' ? '***' : value
        }))
      });
      
      console.log('🔐 [LOGIN-PAGE] Calling /api/auth/secure-login');
      
      // Use secure login endpoint
      const res = await fetch("/api/auth/secure-login", {
        method: "POST",
        body: formData,
      });

      console.log("🔐 [LOGIN-PAGE] Login response status:", res.status);
      console.log("🔐 [LOGIN-PAGE] Login response headers:", Object.fromEntries(res.headers.entries()));
      console.log("🔐 [LOGIN-PAGE] Response URL:", res.url);
      console.log("🔐 [LOGIN-PAGE] Response ok:", res.ok);
      console.log("🔐 [LOGIN-PAGE] Response statusText:", res.statusText);

      // Log response body for debugging
      const responseText = await res.clone().text();
      console.log("🔐 [LOGIN-PAGE] Raw response body:", responseText);

      if (!res.ok) {
        let errorMessage = "Login failed";
        try {
          const data = await res.json();
          errorMessage = data.error || "Login failed";
          console.log("❌ [LOGIN-PAGE] Login error response:", data);
        } catch (jsonError) {
          console.log("❌ [LOGIN-PAGE] Failed to parse error response as JSON:", jsonError);
          errorMessage = `Login failed (${res.status})`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log("✅ [LOGIN-PAGE] Login success response:", data);
      console.log(data.consoleLog || '✅ [LOGIN-PAGE] No console log from API');
      if (data.debugInfo) {
        console.log("🔍 [LOGIN-PAGE] Debug info from API:", data.debugInfo);
      }
      
      // Check if we have a cookie set
      const cookies = document.cookie;
      console.log("🔐 [LOGIN-PAGE] Current cookies:", cookies);
      console.log("🔐 [LOGIN-PAGE] Cookie includes token:", cookies.includes('token'));
      console.log("🔐 [LOGIN-PAGE] All cookies parsed:", document.cookie.split(';').map(c => c.trim()));
      
      // Check if token cookie was set in response headers
      const setCookieHeader = res.headers.get('set-cookie');
      console.log("🔐 [LOGIN-PAGE] Set-Cookie header:", setCookieHeader);
      
      console.log('✅ [LOGIN-PAGE] Login successful, redirecting to dashboard');
      // Silent fingerprint validation - no console logs
      router.replace("/dashboard");
    } catch (error) {
      console.error('❌ [LOGIN-PAGE] Login error:', error);
      console.error('❌ [LOGIN-PAGE] Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-2">
        <div className="bg-white/90 rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-2">
      <div className="bg-white/90 rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="bg-indigo-100 rounded-full p-3 mb-1">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-indigo-700">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-300 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors mt-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={runDebugTest}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded transition-colors text-sm"
          >
            🔍 Run Debug Test
          </button>
          {debugInfo && (
            <div className="bg-gray-100 p-3 rounded text-xs">
              <div className="font-semibold mb-2">Debug Info:</div>
              <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:underline text-sm text-center"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
