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
  const router = useRouter();

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
    if (!username || !password) {
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
      
      console.log("Attempting login with:", { username, fingerprint });
      
      // Use secure login endpoint
      const res = await fetch("/api/auth/secure-login", {
        method: "POST",
        body: formData,
      });

      console.log("Login response status:", res.status);
      console.log("Login response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        let errorMessage = "Login failed";
        try {
          const data = await res.json();
          errorMessage = data.error || "Login failed";
          console.log("Login error response:", data);
        } catch (jsonError) {
          console.log("Failed to parse error response as JSON:", jsonError);
          errorMessage = `Login failed (${res.status})`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log("Login success response:", data);
      
      // Check if we have a cookie set
      const cookies = document.cookie;
      console.log("Current cookies:", cookies);
      
      // Silent fingerprint validation - no console logs
      router.replace("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
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
