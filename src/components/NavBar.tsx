"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Database } from "lucide-react";

export default function NavBar() {
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
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />
          <Link href="/studio" className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md hover:bg-stone-800 transition font-semibold cursor-pointer">
            Open Studio &rarr;
          </Link>
        </Show>
        <Show when="signed-out">
          <Link href="/sign-in" className="hover:text-stone-950 transition font-semibold">Sign In</Link>
          <Link href="/studio?direct=1" className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md hover:bg-stone-800 transition font-semibold cursor-pointer">
            Open Studio &rarr;
          </Link>
        </Show>
      </div>
    </nav>
  );
}
