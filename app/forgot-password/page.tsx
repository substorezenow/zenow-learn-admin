"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setStep("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    alert("Password updated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-2">
      <div className="bg-white/90 rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-indigo-700 text-center mb-2">Forgot Password</h1>
        {step === "email" ? (
          <form className="flex flex-col gap-4" onSubmit={handleEmail}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors mt-2"
            >
              Send Reset Link
            </button>
            <Link href="/login" className="text-indigo-600 hover:underline text-sm text-center">Back to login</Link>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="password"
                placeholder="New password"
                className="border border-gray-300 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                className="border border-gray-300 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors mt-2"
            >
              Update Password
            </button>
            <Link href="/login" className="text-indigo-600 hover:underline text-sm text-center">Back to login</Link>
          </form>
        )}
      </div>
    </div>
  );
}
