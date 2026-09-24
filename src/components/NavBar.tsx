import Link from "next/link";
import { Database } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-800/50 relative z-20">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
          <Database className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">Zyntix</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link href="/features" className="hover:text-white transition-colors">Features</Link>
        <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        <SignedIn>
          <Link href="/dashboard" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold">Dashboard</Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer">
            <SignInButton mode="modal">Sign In</SignInButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}
