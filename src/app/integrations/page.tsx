import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Integrations() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-5xl font-black tracking-tight mb-6 text-white">Global Agency Network</h1>
        <p className="text-xl text-slate-400 font-medium mb-16">Our proprietary Global Agency Pool supports the most powerful platforms available today.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">Web 2.0 Articles</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Available</span>
          </div>
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">Niche Q&A Forums</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Available</span>
          </div>
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">DA 90+ Profiles</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Available</span>
          </div>
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">Contextual Blog Comments</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Available</span>
          </div>
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">14+ Geo-Targeted TLDs</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Available</span>
          </div>
          <div className="p-6 border border-white/5 bg-[#050B14] shadow-xl rounded-2xl flex items-center justify-between">
            <span className="text-xl font-bold text-white">Edu / Gov Links</span>
            <span className="text-xs font-bold px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

