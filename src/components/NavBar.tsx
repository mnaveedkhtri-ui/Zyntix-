"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const [localUser, setLocalUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("zyntix_user");
        if (stored) setLocalUser(JSON.parse(stored));
        else {
          fetch("/api/auth/me").then(r => r.json()).then(d => {
            if (d.success && d.user) {
              setLocalUser(d.user);
              localStorage.setItem("zyntix_user", JSON.stringify(d.user));
            }
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }, []);

  const activeEmail = user?.primaryEmailAddress?.emailAddress || localUser?.email;
  const isAuthed = Boolean(isSignedIn || localUser);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("zyntix_user");
    }
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch (e) {}
    window.location.href = "/sign-in";
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-stone-200/80 relative z-20 font-serif">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-stone-900 text-stone-50 rounded-md flex items-center justify-center font-bold text-sm shadow-sm">
          Z
        </div>
        <span className="text-2xl font-normal tracking-tight text-stone-900">Zyntix</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-xs font-sans uppercase tracking-widest text-stone-600 font-medium">
        <Link href="/site/demo" className="hover:text-stone-950 transition">Showcase Publication</Link>
        <Link href="/pricing" className="hover:text-stone-950 transition">Pricing</Link>
        {isAuthed ? (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-600 lowercase">{activeEmail}</span>
            <Link href="/studio" className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md hover:bg-stone-800 transition font-semibold cursor-pointer">
              Open Studio &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="text-stone-500 hover:text-stone-950 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-stone-950 transition font-semibold">Sign In</Link>
            <Link href="/sign-in" className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md hover:bg-stone-800 transition font-semibold cursor-pointer">
              Open Studio &rarr;
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
