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
              <h2 className="text-2xl font-bold mb-3 text-white">1. Connect Your Accounts</h2>
              <p className="text-slate-400 leading-relaxed">Head to the dashboard and authorize our application to post on your behalf to Medium, Blogger, Dev.to, and Hashnode. We use official APIs so your passwords stay secure.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">2. Paste Your URLs</h2>
              <p className="text-slate-400 leading-relaxed">Drop your target URLs into the bulk upload tool. You can submit a single blog post or a list of 500 pages you want to build links for.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">3. Let the System Run</h2>
              <p className="text-slate-400 leading-relaxed">We take over. The AI reads your posts, rewrites them into fresh articles, fetches cover images, and publishes them across your connected networks with contextual backlinks pointing back to you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

