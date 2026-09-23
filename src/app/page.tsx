import Link from "next/link";
import { ArrowRight, Database, Cloud, Zap, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <NavBar />

      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          V2.0: The Google Stacking Era
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DA 99 Google Networks</span> <br className="hidden md:block"/>
          in Minutes.
        </h1>
        
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Zyntix automates massive Entity Stacking campaigns directly on Google infrastructure. Dofollow, public, and indexable DA 99 links at scale. No proxies required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            Launch Engine <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/how-it-works" className="w-full sm:w-auto bg-[#050B14] border border-slate-800 hover:border-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-slate-800/50">
            View Methodology
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-32 text-left max-w-5xl mx-auto">
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Database className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Google Entity Stacks</h3>
            <p className="text-slate-400 leading-relaxed relative z-10">Auto-generate interconnected Google Docs and Sheets natively using Google's API. Permanent DA 99 properties.</p>
          </div>
          
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Zero Proxies</h3>
            <p className="text-slate-400 leading-relaxed relative z-10">Because you authenticate directly with official cloud APIs via your own Service Accounts, you never need proxies or captcha breakers.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
