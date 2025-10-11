"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff,  Lock, Mail, Shield, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// Dynamic import to prevent SSR issues
let SecureTokenStorage: typeof import("../../lib/secureTokenStorage").SecureTokenStorage | null = null;
if (typeof window !== 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SecureTokenStorage = require("../../lib/secureTokenStorage").SecureTokenStorage;
  } catch {
    // Silent error handling for production
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
    setIsClient(true);
    
    if (typeof window !== 'undefined' && SecureTokenStorage) {
      // Generate fresh fingerprint (never stored)
      const tokenStorage = new SecureTokenStorage();
      const fingerprint = tokenStorage.generateFingerprint();
      setFingerprint(fingerprint);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("fingerprint", fingerprint || "fallback");
      
      const res = await fetch("/api/auth/secure-login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = "Login failed. Please try again.";
        try {
          const data = await res.json();
          errorMessage = data.error || "Login failed";
        } catch {
          errorMessage = `Login failed (${res.status})`;
        }
        setError(errorMessage);
        return;
      }
      
      const data = await res.json();
      
      if (data.success) {
        router.replace("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="ml-4 text-3xl font-bold">Zenow Academy</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Welcome to the Future of Learning
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Transform your educational journey with our comprehensive platform designed for modern learners and educators.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-blue-100">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
              <span>Advanced Security & Privacy</span>
            </div>
            <div className="flex items-center text-blue-100">
              <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
              <span>Comprehensive Course Management</span>
            </div>
            <div className="flex items-center text-blue-100">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-3"></div>
              <span>Real-time Analytics & Insights</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-blue-300/20 rounded-full blur-md"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Zenow Academy</h1>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-red-500 mr-2">⚠️</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Shield className="w-4 h-4 mr-1" />
                Protected by enterprise-grade security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}