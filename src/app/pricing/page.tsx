import Link from "next/link";
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-[100%] blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black tracking-tight mb-6 text-white">Simple, Agency-First Pricing</h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">No hidden fees, no API costs. Pay only for the capacity your SEO agency actually needs to scale.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-[#050B14] border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col relative group hover:border-cyan-500/30 transition-colors">
            <h3 className="text-xl font-bold text-slate-300 mb-2">Freelancer</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-white">$49</span>
              <span className="text-slate-500 font-medium">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 h-10">Perfect for solo consultants handling a few client campaigns.</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">500 Web 2.0 Articles /mo</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">2,000 Blog Comments</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">CSV Exporting</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">Standard Delivery (48h)</span></div>
            </div>
            
            <Link href="/dashboard" className="w-full block text-center px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
              Start Building
            </Link>
          </div>

          {/* Agency Plan (Popular) */}
          <div className="bg-[#050B14] border border-cyan-500/40 p-8 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Growth Agency</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black text-white">$199</span>
              <span className="text-slate-500 font-medium">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 h-10">Everything an SEO agency needs to dominate SERPs for clients.</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-200">5,000 Web 2.0 Articles /mo</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-200">Unlimited Blog Comments</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-200">Reddit & Quora Outreach</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-200">High-DA Profiles (GitHub, Adobe)</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-emerald-400">Turbo Delivery Engine (24h)</span></div>
            </div>
            
            <Link href="/dashboard" className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white font-bold rounded-xl transition-all">
              <Zap className="w-5 h-5" /> Get Agency License
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#050B14] border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col relative group hover:border-blue-500/30 transition-colors">
            <h3 className="text-xl font-bold text-slate-300 mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-white">$499</span>
              <span className="text-slate-500 font-medium">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 h-10">Dedicated infrastructure for massive backlink networks.</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">Unlimited Everything</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">Custom Web 2.0 Integrations</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">Whitelabel PDF Reporting</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" /><span className="text-sm font-medium text-slate-300">Dedicated Account Manager</span></div>
            </div>
            
            <Link href="/dashboard" className="w-full block text-center px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
