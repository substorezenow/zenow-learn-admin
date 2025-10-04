"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { SecureTokenStorage } from "../../lib/secureTokenStorage";

export default function SecureLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const router = useRouter();
  const tokenStorage = useMemo(() => new SecureTokenStorage(), []);

  useEffect(() => {
    // Generate and display browser fingerprint
    const fp = tokenStorage['encryption'].getCurrentSessionId();
    setFingerprint(fp);
  }, [tokenStorage]);

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

      const response = await fetch("/api/auth/secure-login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      
      // Store token with browser fingerprint encryption
      const success = await tokenStorage.storeToken(data.token);
      
      if (success) {
        console.log("🔐 Token encrypted and stored with browser fingerprint");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to store encrypted token");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Secure Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Browser fingerprint encryption enabled
          </p>
        </div>

        {/* Browser Fingerprint Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Browser Fingerprint:</span>
          </div>
          <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
            {fingerprint}
          </code>
          <p className="text-xs text-blue-600 mt-2">
            Your token will be encrypted using this unique browser signature
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Encrypting & Logging in...
              </div>
            ) : (
              "Secure Login"
            )}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Use standard login instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
