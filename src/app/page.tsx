import Link from "next/link";
import { ArrowRight, Database, Search, Link as LinkIcon, ShieldCheck } from "lucide-react";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Zyntix",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "19.00",
              "priceCurrency": "USD"
            },
            "description": "Zyntix is a premium Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) platform for local businesses."
          })
        }}
      />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next-Gen AEO & GEO Optimized Infrastructure
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          Syndicate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Cloud Entities</span><br className="hidden md:block"/> at Enterprise Scale.
        </h1>
        
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Zyntix is the premier semantic network engine. We help digital enterprises build decentralized knowledge graphs, establishing robust trust signals for Generative AI and traditional search engines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-in" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            Deploy Entities Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/how-it-works" className="w-full sm:w-auto bg-[#050B14] border border-slate-800 hover:border-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-slate-800/50">
            Explore the Architecture
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left max-w-6xl mx-auto">
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Search className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Generative Engine Optimization (GEO)</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">Align your digital assets with the specific semantic architectures required by LLMs (ChatGPT, Perplexity). We naturally construct contextual relevance to ensure you become the authoritative answer.</p>
          </div>
          
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <LinkIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Decentralized Trust Networks</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">Move beyond traditional linking. Zyntix autonomously structures intelligent daisy-chains across ultra-high authority cloud platforms (Docs, Slides, Forms) to safely pass immense domain equity.</p>
          </div>

          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Adaptive Semantic Knowledge</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">Our deployment engine inherently understands the contextual nuances of your industry. It generates highly factual, human-grade analytical reports that seamlessly satisfy advanced Answer Engine requirements.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
