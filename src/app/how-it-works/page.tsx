import Link from "next/link";
import { ArrowLeft, PlayCircle, Key, Activity } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-5xl font-black tracking-tight mb-6 text-white">How It Works</h1>
        <p className="text-xl text-slate-400 font-medium mb-16">Three steps to automated authority.</p>
        
        <div className="grid gap-8">
          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">1. Select Campaign & Niche</h2>
              <p className="text-slate-400 leading-relaxed">Choose between Web 2.0, Niche Forums, High-DA Profiles, Blog Comments, or a Mixed Strategy. There is zero setup required—our Global Agency Pool of aged accounts handles everything instantly.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">2. Paste URLs & Target Geo</h2>
              <p className="text-slate-400 leading-relaxed">Drop your client's target URLs and select your desired region from 14+ Geo-Targeted TLDs (like .de, .co.uk, .com). Zyntix will localize the backlinks to ensure maximum ranking impact.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">3. Instant Turbo Delivery</h2>
              <p className="text-slate-400 leading-relaxed">Zyntix takes over. Using residential proxies and human-emulation delays, it safely builds your entire link profile and generates a pristine white-label CSV report for you to hand to your clients.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


