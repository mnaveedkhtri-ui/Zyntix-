"use client";

import { useState } from "react";
import { Link2, LayoutDashboard, Settings, Activity, CheckCircle2, Globe, FileText, ArrowRight, UploadCloud, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [targetUrls, setTargetUrls] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  // Mock platforms
  const platforms = [
    { name: "Medium", dr: 94, connected: true },
    { name: "LinkedIn", dr: 98, connected: true },
    { name: "Hashnode", dr: 89, connected: false },
    { name: "Dev.to", dr: 91, connected: false },
  ];

  const handleBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = targetUrls.split('\n').map(u => u.trim()).filter(u => u);
    if (urls.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    
    try {
      // Process each URL
      for (let i = 0; i < urls.length; i++) {
        // Simulate network delay per URL
        await new Promise(r => setTimeout(r, 800));
        
        // Real API call logic (mocked here for rapid iteration)
        /*
        const res = await fetch('/api/syndicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urls[i] })
        });
        */
        
        setProcessedCount(i + 1);
        setProgress(Math.round(((i + 1) / urls.length) * 100));
      }
    } catch (err) {
      alert("Failed to connect to the server.");
    }
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block bg-[#050B14]">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Syndicator</span>
        </div>
        
        <nav className="space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-xl font-medium border border-cyan-500/20 shadow-sm">
            <LayoutDashboard className="w-5 h-5" /> Campaigns
          </a>
          <a href="/dashboard/comments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" /> Blog Comments
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" /> Integrations
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">New Bulk Campaign</h1>
            <p className="text-slate-400 font-medium">Launch an agency-level syndication blast across your networks.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 tracking-wide uppercase">Agency License</span>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Action Area */}
          <div className="md:col-span-2 space-y-6">
            {/* The Input Card */}
            <div className="bg-[#050B14] border border-white/5 p-6 rounded-2xl shadow-xl">
              <form onSubmit={handleBlast}>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-200">Target URLs (Bulk Mode)</label>
                  <span className="text-xs font-medium text-slate-500">One URL per line</span>
                </div>
                
                <div className="relative group mb-4">
                  <Link2 className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <textarea 
                    value={targetUrls}
                    onChange={(e) => setTargetUrls(e.target.value)}
                    placeholder="https://client1.com/blog/article-1&#10;https://client2.com/post-xyz&#10;https://client3.com/news..."
                    className="w-full h-40 bg-[#020617] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none shadow-inner font-mono text-sm"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    <span className="text-cyan-400 font-bold">{targetUrls.split('\n').filter(u => u.trim()).length}</span> URLs detected
                  </p>
                  <button 
                    type="submit"
                    disabled={isProcessing || !targetUrls.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                  >
                    {isProcessing ? "Blasting..." : "Launch Bulk Blast"} <UploadCloud className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Progress Bar UI */}
                {isProcessing && (
                  <div className="mt-8 p-5 bg-[#020617] rounded-xl border border-slate-800">
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-3">
                      <span>Agency Bulk Engine Running...</span>
                      <span className="text-cyan-400">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                      </motion.div>
                    </div>
                    <div className="mt-5 space-y-2.5 text-sm text-slate-400 font-medium">
                      <p className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Processing URL {processedCount} of {targetUrls.split('\n').filter(u => u.trim()).length}</p>
                      {progress >= 50 && <p className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Entity NLP Engine rewriting content variations...</p>}
                      {progress >= 100 && <p className="flex items-center gap-3 text-emerald-400 font-bold"><CheckCircle2 className="w-5 h-5" /> Bulk Blast Complete! All backlinks secured.</p>}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Recent Campaigns Table */}
            <div className="bg-[#050B14] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-bold">Recent Bulk Runs</h2>
                <span className="text-xs text-slate-500 font-medium cursor-pointer hover:text-white transition-colors">View All</span>
              </div>
              <div className="divide-y divide-white/5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-200">Client SEO Batch #{1024 - i}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">24 URLs • Distributed to Medium, Dev.to</p>
                      </div>
                    </div>
                    <a href="#" className="text-cyan-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Report &rarr;</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Integrations */}
          <div className="space-y-6">
            <div className="bg-[#050B14] border border-white/5 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold">Connected Assets</h2>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                  <span className="text-lg leading-none mb-1 text-slate-400">+</span>
                </div>
              </div>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                    <div>
                      <p className="font-bold text-sm text-slate-200">{platform.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">DA {platform.dr}</p>
                    </div>
                    {platform.connected ? (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACTIVE
                      </span>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700">
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
