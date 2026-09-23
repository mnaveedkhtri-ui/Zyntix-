import Link from "next/link";
import { Database, Cloud, Zap, ShieldCheck, ArrowRight, Server, Layers } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
        </Link>
        <Link href="/dashboard" className="text-emerald-400 font-bold hover:text-emerald-300">Access Dashboard</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-24">
        <h1 className="text-4xl font-black mb-16 text-center">The <span className="text-emerald-400">Cloud Stacking</span> Arsenal</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#050B14] p-10 rounded-3xl border border-slate-800">
            <Database className="w-12 h-12 text-emerald-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Google Entity Networks</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Google loves Google. We use official Google Service Accounts (GCP) to generate hundreds of interlinked Google Docs, Sheets, and Slides. These properties boast a DA of 99 and are practically immune to algorithm penalties.
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Bulk Document Generation</li>
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Public Permissions Automated</li>
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Zero Rate-Limit Architecture</li>
            </ul>
          </div>

          <div className="bg-[#050B14] p-10 rounded-3xl border border-slate-800">
            <Cloud className="w-12 h-12 text-cyan-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">AWS HTML Stacks</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Host thousands of SEO-optimized HTML pages directly on Amazon S3 buckets. AWS provides unparalleled domain authority and blazing fast load times, instantly validating your local entities.
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-cyan-500" /> Direct S3 API Integration</li>
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-cyan-500" /> Dynamic HTML Generation</li>
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-cyan-500" /> Built-in Schema Injection</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
