import Link from "next/link";
import { Database, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Features() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <NavBar />

      <main className="max-w-7xl mx-auto px-8 py-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-16 text-center">The <span className="text-emerald-400">Semantic AEO</span> Arsenal</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#050B14] p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <Database className="w-12 h-12 text-emerald-400 mb-6 relative z-10" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">High-Velocity Entity Syndication</h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-lg relative z-10">
              Search engines prioritize established authority networks. We leverage enterprise-grade cloud architecture to autonomously syndicate 100% natural, human-readable assets (Docs, Slides, Forms). These decentralized DA-100 entities act as irrefutable trust signals for Generative Search (AEO).
            </p>
            <ul className="space-y-4 text-slate-300 relative z-10 font-medium">
              <li className="flex items-center gap-3 bg-[#020617] p-4 rounded-xl border border-slate-800"><Zap className="w-5 h-5 text-emerald-500" /> Intelligent Content Generation Engine</li>
              <li className="flex items-center gap-3 bg-[#020617] p-4 rounded-xl border border-slate-800"><Zap className="w-5 h-5 text-emerald-500" /> Semantic Daisy-Chain Interlinking</li>
              <li className="flex items-center gap-3 bg-[#020617] p-4 rounded-xl border border-slate-800"><Zap className="w-5 h-5 text-emerald-500" /> Answer Engine Optimization (AEO) Ready</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
