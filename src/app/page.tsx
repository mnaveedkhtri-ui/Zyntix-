import Link from "next/link";
import { ArrowRight, Database, Cloud, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition-colors">Access Dashboard</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          V2.0: The Cloud Stacking Era
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DA 99 Cloud Networks</span> <br className="hidden md:block"/>
          in Minutes.
        </h1>
        
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Zyntix automates massive Entity Stacking campaigns directly on Google Cloud and AWS infrastructure. Dofollow, public, and indexable DA 99 links at scale. No proxies required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105">
            Launch Engine <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/how-it-works" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all">
            View Methodology
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Google Entity Stacks</h3>
            <p className="text-slate-400 leading-relaxed">Auto-generate interconnected Google Docs and Sheets natively using Google's API. Permanent DA 99 properties.</p>
          </div>
          
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cloud className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AWS Cloud Authority</h3>
            <p className="text-slate-400 leading-relaxed">Deploy bulk HTML networks on Amazon S3 buckets. Leverage the raw domain authority of AWS for local rankings.</p>
          </div>

          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Zero Proxies</h3>
            <p className="text-slate-400 leading-relaxed">Because you authenticate directly with official cloud APIs via your own Service Accounts, you never need proxies or captcha breakers.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
