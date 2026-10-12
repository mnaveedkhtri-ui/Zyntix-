"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem("zyntix_user", JSON.stringify(data.user));
        router.push("/studio");
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between items-center py-12 px-4 selection:bg-amber-100">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 text-stone-50 rounded-md flex items-center justify-center font-serif font-bold text-sm">
            Z
          </div>
          <span className="font-serif text-2xl font-normal text-stone-900">Zyntix</span>
        </Link>
        <Link href="/" className="font-sans text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950 font-medium">
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Sign Up Box */}
      <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-stone-900 font-normal">Create your Account</h1>
          <p className="font-sans text-xs text-stone-500 mt-1.5">
            Start building and syndicating authoritative publications.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs">
          <div>
            <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account &rarr;"}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs font-sans text-stone-600 pt-3 border-t border-stone-100">
          <span>Already have an account?</span>
          <Link href="/sign-in" className="text-stone-950 font-semibold hover:underline">
            Sign in &rarr;
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-8 text-center text-xs font-sans text-stone-400">
        &copy; {new Date().getFullYear()} Zyntix Platform. Direct Secure Authentication.
      </div>
    </div>
  );
}
