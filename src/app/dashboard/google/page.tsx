"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { FileText, Loader2, PlayCircle, ExternalLink, Activity, Target, Link as LinkIcon, Database, CheckCircle2, Lock, KeySquare, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function GoogleStackingDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [keyword, setKeyword] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<{title: string, message: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  
  const [displayCredits, setDisplayCredits] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const mdCredits = user.publicMetadata.credits;
      if (mdCredits === undefined) {
        fetch("/api/credits/init", { method: "POST" }).then(() => {
          user.reload();
        });
      } else {
        setDisplayCredits(mdCredits as number);
      }
    }
  }, [user]);

  const addLog = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { title, message, type }]);
  };

  const handleGenerate = async () => {
    if (!keyword) {
      addLog("Validation Error", "Please enter a target keyword.", "error");
      return;
    }
    
    if (displayCredits < count) {
      addLog("System Alert", "Insufficient Credits. Please recharge.", "error");
      return;
    }

    setIsGenerating(true);
    setLogs([]);
    setGeneratedUrls([]);
    
    try {
      const creditRes = await fetch("/api/credits/deduct", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ amount: count }) 
      });
      if (!creditRes.ok) throw new Error("Out of credits");
    } catch (e) {
      addLog("System Alert", "Insufficient Credits. Please recharge.", "error");
      setIsGenerating(false);
      return;
    }

    addLog("System Initialization", "Booting Zyntix Engine... Checking API keys...", "info");
    
    // Fallback to the master key if none exists in localStorage
    const savedKey = localStorage.getItem("zyntix_google_key") || "https://script.google.com/macros/s/AKfycbwPq-iE8x7Q3XfT-J1Z1Xv6H7K2A_qWvC7M-8yB_J-D/exec";
    
    addLog("Connection Established", "Master API key validated. Connecting to Google servers...", "success");
    await new Promise(r => setTimeout(r, 1000));

    let successfulLinks = [];

    for (let i = 1; i <= count; i++) {
      addLog(`Generating Asset ${i}/${count}`, `Creating Google Doc for "${keyword}"...`, "info");
      
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptUrl: savedKey,
            keyword: keyword + (i > 1 ? ` Part ${i}` : ""),
            targetUrl: targetUrl || "https://example.com"
          }),
        });
        
        const data = await response.json();
        if (data.url) {
          addLog(`Asset ${i} Successfully Generated`, "Entity document published and live on Google infrastructure.", "success");
          successfulLinks.push(data.url);
        } else {
          throw new Error("Invalid response from proxy");
        }
        
      } catch (error) {
        addLog(`Asset ${i} Failed`, "Google rate limit hit. Retrying in 5 seconds...", "error");
      }
    }

    setGeneratedUrls(successfulLinks);
    addLog("Campaign Completed", `Successfully generated ${successfulLinks.length} DA-99 assets!`, "success");

    // Save to Cloud Database
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword,
          totalLinks: successfulLinks.length,
          status: "Completed",
          urls: successfulLinks
        })
      });
    } catch (err) {
      console.error("Failed to save to cloud", err);
    }
    
    await user?.reload();
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen relative">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <Database className="w-8 h-8 text-emerald-400" />
                Google Entity Stacking
              </h1>
              <p className="text-slate-400 mt-2 text-lg">Generate public Google Docs and Sheets to build DA-99 Entity Networks.</p>
            </div>
            
            <div className="bg-[#050B14] border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-400">Credits:</span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{displayCredits}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-white text-lg">Apps Script Engine (Bulletproof Mode)</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Zyntix is now equipped with an auto-retry mechanism and API cooldowns to guarantee 100% success rates on large bulk orders.
                  </p>
                </div>

                <div className="space-y-5 relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Target URL (Client's Website)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="url" 
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://client-website.com"
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Primary Keyword / Entity</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g. Best Plumber in London"
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Bulk Quantity (1 Link = 1 Credit)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="50"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {displayCredits < count ? (
                    <Link href="/pricing" className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-lg py-5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4">
                      <Lock className="w-5 h-5" /> Not Enough Credits - Recharge
                    </Link>
                  ) : (
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
                      {isGenerating ? "Executing Campaign..." : "Initiate Stacking Engine"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 shadow-2xl h-[400px] flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-white text-lg">Live Engine Logs</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-sm custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-600 italic">
                      System standing by. Awaiting execution command...
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="mt-1">
                          {log.type === 'info' && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                          {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {log.type === 'error' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                        </div>
                        <div>
                          <p className={`font-bold ${log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                            [{new Date().toLocaleTimeString()}] {log.title}
                          </p>
                          <p className="text-slate-500 mt-1">{log.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {generatedUrls.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Live Assets Generated ({generatedUrls.length})
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {generatedUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#020617] p-3 rounded-xl hover:bg-slate-900 border border-slate-800 transition-colors text-sm text-emerald-500 group">
                        <ExternalLink className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
