"use client";

import { useState } from "react"; import { useRouter } from "next/navigation";
import { Target, Search, BrainCircuit, MessageSquareText, CodeXml, ChevronRight, Zap, ExternalLink, ShieldAlert } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AuditDashboard() {
  const [keyword, setKeyword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<any>(null);
  const router = useRouter();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setIsScanning(true);
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Target className="w-8 h-8 text-emerald-400" />
                AEO & SERP Intelligence
              </h1>
              <p className="text-slate-400 mt-2 text-lg">Extract REAL LIVE Search Intent & LSI Keywords directly from Google.</p>
            </div>
            {report && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> Scan Complete
              </div>
            )}
          </div>

          <form onSubmit={handleScan} className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter target keyword (e.g., Emergency Roof Repair in London)"
                className="w-full bg-[#050B14] border border-slate-700 focus:border-emerald-500 rounded-2xl py-4 pl-12 pr-4 text-white text-lg transition-all focus:outline-none shadow-xl"
              />
            </div>
            <button 
              disabled={isScanning || !keyword}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Extracting Real Data...
                </>
              ) : "Deep Scan"}
            </button>
          </form>

          {isScanning && (
            <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-2xl">
              <BrainCircuit className="w-16 h-16 text-emerald-500 animate-pulse mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Extracting REAL Search Data...</h3>
              <p className="text-slate-400">Scraping Live Competitors, Google Auto-complete API, and LSI Intent.</p>
              <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* REAL COMPETITORS */}
              <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-sm text-slate-400 mb-3 font-bold uppercase tracking-wider">Live Top 3 Competitors (Real Data)</div>
                <div className="flex flex-col gap-2">
                  {report.top3?.map((compUrl: string, idx: number) => (
                    <a key={idx} href={compUrl} target="_blank" className="text-blue-400 hover:underline text-lg flex items-center gap-2 bg-[#020617] p-3 rounded-xl border border-slate-800 w-fit">
                      <span className="text-slate-500 font-bold">#{idx+1}</span> {compUrl} <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* ZYNTIX SECRET LOOPHOLE STRATEGY - KHATARNAK KAAM */}
              <div className="bg-gradient-to-r from-red-950 to-[#050B14] border border-red-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/20 transition-all"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Zyntix Secret Loophole Strategy</h3>
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Zyntix AI has analyzed <strong className="text-red-400">{report.secretTarget}</strong> and the top competitors. We discovered a <span className="bg-red-500/20 text-red-400 px-2 rounded">critical ranking vulnerability</span>.
                  </p>
                  <div className="bg-[#020617]/50 border border-red-500/20 p-5 rounded-2xl">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> How to Hijack Their Rankings in 48-72 Hours (SGE Injection):
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li>The competitors have weak Semantic HTML. You must inject exactly <strong>{report.recommendationWordCount} words</strong> on your target page.</li>
                      <li>Use the <strong>Google Entity Stacking (DA-99)</strong> tool on the sidebar to generate 50-100 backlinks.</li>
                      <li>In the Stacking tool, use the exact <strong>NLP Keywords & FAQs</strong> listed below as the content of the generated files.</li>
                      <li>This creates a massive Google-trusted entity loop that forces Google's AI algorithm to instantly index your entity and bypass competitors within 48-72 hours.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <BrainCircuit className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Real NLP & LSI Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {report.nlpKeywords.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <MessageSquareText className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Real Google FAQs</h3>
                  </div>
                  <ul className="space-y-3">
                    {report.faqs.map((faq: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-slate-300 font-medium">{faq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

