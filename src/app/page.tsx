import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Globe, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Editorial Header */}
      <header className="border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl tracking-tight font-normal text-stone-900">
            Zyntix
          </Link>

          <nav className="flex items-center gap-6 font-sans text-xs uppercase tracking-widest font-medium text-stone-600">
            <Link href="/site/demo" className="hover:text-stone-950 transition">
              Live Demo Journal
            </Link>
            <Link 
              href="/studio"
              className="px-4 py-2 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800 transition font-sans text-xs"
            >
              Open Studio &rarr;
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-amber-900 font-semibold bg-amber-100/60 px-3 py-1 rounded inline-block mb-6">
          The Autonomous Web Platform &bull; $0 Forever Architecture
        </p>

        <h1 className="text-4xl sm:text-6xl font-normal leading-[1.2] text-stone-900 tracking-tight mb-8">
          Websites that feel unmistakably crafted by human hands.
        </h1>

        <p className="font-sans text-base sm:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          Autonomous multi-tenant publications that rank on autopilot. Built with quiet typography, deep long-tail SERP gap research, and zero AI noise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-sans text-xs">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 text-stone-50 rounded-md font-medium hover:bg-stone-800 transition flex items-center justify-center gap-2"
          >
            <span>Launch Zyntix Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/site/demo"
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-stone-300 text-stone-800 rounded-md font-medium hover:bg-stone-50 transition"
          >
            Inspect Demo Publication
          </Link>
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left font-sans border-t border-stone-200/80 pt-16">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold block mb-2">
              01. Multi-Tenant Subdomains
            </span>
            <h3 className="font-serif text-xl font-normal text-stone-900 mb-2">Instant Global Staging</h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Every client receives a custom subdomain under 1 second with automatic Edge SSL and custom domain mapping.
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold block mb-2">
              02. AEO & SERP Gaps
            </span>
            <h3 className="font-serif text-xl font-normal text-stone-900 mb-2">#0 Position Snippets</h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Autonomous background cron targets real Google autocomplete gaps and outputs executive direct answers.
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold block mb-2">
              03. Failover Shield
            </span>
            <h3 className="font-serif text-xl font-normal text-stone-900 mb-2">100% Autopilot Uptime</h3>
            <p className="text-stone-600 text-xs leading-relaxed font-light">
              Multi-key Gemini pool with automatic 429 failover to Groq Llama 3.3 70B guarantees continuous operation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-10 font-sans text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Zyntix Platform. Built with deliberate craftsmanship.</p>
          <div className="flex items-center gap-6">
            <Link href="/studio" className="hover:text-stone-900">Studio</Link>
            <Link href="/site/demo" className="hover:text-stone-900">Demo Journal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
