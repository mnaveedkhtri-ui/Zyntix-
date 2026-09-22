"use client";

import { useState } from "react";
import { Zap, CheckCircle2, Settings2, ShieldAlert, FileSpreadsheet, Globe, FileText, MessageSquare, UserPlus, HelpCircle , Layers} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForumsDashboard() {
  const [niche, setNiche] = useState("");
  const [clientLink, setClientLink] = useState("");
  const [forumType, setForumType] = useState("Quora / Reddit (Top Tier)");
  const [targetTld, setTargetTld] = useState(".com (Global)");
  const [postCount, setPostCount] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [reportData, setReportData] = useState<any[]>([]);

  const handleBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !clientLink) return;
    
    setIsProcessing(true);
    setIsFinished(false);
    setProgress(0);
    setProcessedCount(0);
    
    try {
      // Dynamic timing based on link count (fewer links = faster completion)
      const timePerLinkMs = 40;
      const totalSimulationTime = Math.max(1500, postCount * timePerLinkMs);
      const updateInterval = 100;
      const progressIncrement = 95 / (totalSimulationTime / updateInterval);

      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + progressIncrement, 95));
      }, updateInterval);

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "forums",
          niche,
          targetLink: clientLink,
          totalRequested: postCount
        })
      });

      const data = await res.json();
      clearInterval(progressInterval);
      
      if (data.success) {
        setProgress(100);
        setProcessedCount(postCount);
        setReportData(data.reportData);
        setTimeout(() => {
          setIsProcessing(false);
          setIsFinished(true);
        }, 500);
      } else {
        alert("Server error: " + data.error);
        setIsProcessing(false);
      }
    } catch (err) {
      alert("Failed to connect to the backend server.");
      setIsProcessing(false);
    }
  };

  const downloadCsv = () => {
    if (!reportData || reportData.length === 0) return;
    const headers = ["Target Client URL", "Published Backlink URL", "Anchor Text", "Status"];
    const rows = reportData.map(r => `"${r.target}","${r.url}","${r.anchor}","${r.status}"`);
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Zyntix_report_forums_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block bg-[#050B14]">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Zyntix</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> Web 2.0 Articles
          </Link>
          <Link href="/dashboard/comments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> Blog Comments
          </Link>
          <Link href="/dashboard/profiles" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <UserPlus className="w-5 h-5" /> High-DA Profiles
          </Link>
          <Link href="/dashboard/forums" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-xl font-medium border border-cyan-500/20 shadow-sm">
            <HelpCircle className="w-5 h-5" /> Q&A / Forums
          </Link>
          <Link href="/dashboard/mixed" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Layers className="w-5 h-5" /> Mixed Campaigns
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors mt-8 border border-slate-800/50">
            <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Q&A / Forum Outreach</h1>
            <p className="text-slate-400 font-medium">Auto-scan Reddit & Quora for keyword questions and post highly contextual AI answers with your link.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-xs font-bold text-purple-400 tracking-wide uppercase">Agency License</span>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#050B14] border border-white/5 p-6 rounded-2xl shadow-xl">
              <form onSubmit={handleBlast}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Target Niche</label>
                    <input 
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g. Finance, Crypto"
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Platform Selection</label>
                    <select 
                      value={forumType}
                      onChange={(e) => setForumType(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm appearance-none"
                    >
                      <option>Quora / Reddit (Top Tier)</option>
                      <option>Niche Forums (vBulletin)</option>
                      <option>All Platforms (Mixed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Target TLD (Geo)</label>
                    <select 
                      value={targetTld}
                      onChange={(e) => setTargetTld(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm appearance-none"
                    >
                      <option value=".com (Global)">.com (Global / US)</option>
                      <option value=".de (Germany)">.de (Germany)</option>
                      <option value=".co.uk (UK)">.co.uk (UK)</option>
                      <option value=".fr (France)">.fr (France)</option>
                      <option value=".es (Spain)">.es (Spain)</option>
                      <option value=".it (Italy)">.it (Italy)</option>
                      <option value=".nl (Netherlands)">.nl (Netherlands)</option>
                      <option value=".ca (Canada)">.ca (Canada)</option>
                      <option value=".au (Australia)">.au (Australia)</option>
                      <option value=".in (India)">.in (India)</option>
                      <option value=".jp (Japan)">.jp (Japan)</option>
                      <option value=".br (Brazil)">.br (Brazil)</option>
                      <option value=".ae (UAE)">.ae (UAE)</option>
                      <option value=".sg (Singapore)">.sg (Singapore)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Client's Target Link</label>
                    <input 
                      type="url"
                      value={clientLink}
                      onChange={(e) => setClientLink(e.target.value)}
                      placeholder="https://client-site.com/guide"
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Number of Answers</label>
                    <input 
                      type="number"
                      value={postCount}
                      onChange={(e) => setPostCount(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    Campaign Delivery Engine <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">100% Natural</span>
                  </label>
                  <div className="p-4 border border-cyan-500/30 bg-[#020617] rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <h4 className="text-cyan-400 font-bold text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5" /> Instant Turbo Delivery
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">Clients want it fast. We deliver it safely.</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Residential Proxies
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Human Typing Emulation
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Randomized Delay Spacing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isProcessing || !niche || !clientLink}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                  >
                    {isProcessing ? "Scanning & Answering..." : `Deploy ${postCount}x Answers`} <Zap className="w-5 h-5" />
                  </button>
                </div>
                
                {isProcessing && (
                  <div className="mt-8 p-5 bg-[#020617] rounded-xl border border-slate-800">
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-3">
                      <span>Scraping relevant subreddits & Quora threads...</span>
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
                      <p className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Found {processedCount} of {postCount} highly relevant threads.</p>
                      {progress >= 50 && <p className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> AI crafting highly valuable 500-word answer...</p>}
                    </div>
                  </div>
                )}

                {isFinished && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    <div>
                      <h3 className="text-emerald-400 font-bold mb-1 flex items-center gap-2 text-lg">
                        <CheckCircle2 className="w-5 h-5" /> Threads Answered!
                      </h3>
                      <p className="text-sm text-emerald-500/80 font-medium">Successfully posted {postCount} highly-detailed AI answers.</p>
                    </div>
                    <button type="button" onClick={downloadCsv} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20">
                      <FileSpreadsheet className="w-4 h-4" /> Download CSV
                    </button>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#050B14] border border-white/5 p-6 rounded-2xl shadow-xl">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2"><Settings2 className="w-5 h-5 text-cyan-400" /> Answer Config</h2>
              <div className="space-y-4 text-sm text-slate-400 font-medium">
                <p><strong>Intent Matching:</strong> <span className="text-emerald-400">Strict</span></p>
                <p><strong>Answer Length:</strong> 150-250 Words (Helpful)</p>
                <p><strong>Link Placement:</strong> Contextual (Middle)</p>
                <p><strong>Account Age:</strong> Aged Accounts Only</p>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl shadow-xl">
              <h2 className="font-bold text-red-400 mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Warning</h2>
              <p className="text-sm text-red-400/80 leading-relaxed font-medium">
                Reddit is extremely strict. We only use aged accounts with 500+ Karma. Stick to "Natural Drip (30 Days)" to avoid subreddit bans.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






