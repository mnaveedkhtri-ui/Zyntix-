import Link from "next/link";
import { ArrowLeft, Sparkles, Zap, Image as ImageIcon } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        
        <h1 className="text-5xl font-black tracking-tight mb-6 text-white">Platform Features</h1>
        <p className="text-xl text-slate-400 font-medium mb-16">Everything you need to automate content syndication at scale.</p>
        
        <div className="space-y-8">
          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">Official API Integrations</h2>
              <p className="text-slate-400 leading-relaxed">Connect directly to the core infrastructure of the internet. Zyntix uses official Developer APIs to syndicate your content across GitHub, Dev.to, Hashnode, and Notion. No blackhat scripts, just pure, authenticated publishing.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">Zero Proxy Infrastructure</h2>
              <p className="text-slate-400 leading-relaxed">Never pay for a residential proxy or Captcha solver again. By utilizing Official APIs, Zyntix bypasses Cloudflare and bot-protection natively. Your content goes live globally in seconds with a 100% success rate.</p>
            </div>
          </div>

          <div className="bg-[#050B14] border border-white/5 p-8 rounded-2xl shadow-xl flex gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ImageIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">Premium DA 90+ Authority</h2>
              <p className="text-slate-400 leading-relaxed">Stop wasting time on spammy forums. We exclusively target the highest Domain Authority platforms in the world. Generate contextual Web 2.0 articles and Profile Backlinks on DA 90+ domains that actually move the needle for your clients.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




