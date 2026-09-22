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
              <h2 className="text-2xl font-bold mb-3 text-white">1. Connect Official APIs</h2>
              <p className="text-slate-400 leading-relaxed">Head over to the Settings page and paste your free Developer API keys from platforms like GitHub, Dev.to, and Hashnode. No proxies or Captcha subscriptions needed.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">2. Setup Your Campaign</h2>
              <p className="text-slate-400 leading-relaxed">Paste your client's target URL and select your niche. Choose whether you want to publish a full Web 2.0 SEO article or a DA 95+ Profile link.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">3. Publish Instantly</h2>
              <p className="text-slate-400 leading-relaxed">Zyntix securely communicates with the official platform APIs to instantly publish your content. You get an immediate CSV report with live, 100% safe dofollow links to hand to your client.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



