"use client";

import { useState } from "react";
import { Link2, Zap, CheckCircle2, Search, Settings2, ShieldAlert, Download, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BulkComments() {
  const [niche, setNiche] = useState("");
  const [clientLink, setClientLink] = useState("");
  const [targetTld, setTargetTld] = useState(".de (Germany)");
  const [linkCount, setLinkCount] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const handleBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !clientLink) return;
    
    setIsProcessing(true);
    setIsFinished(false);
    setProgress(0);
    setProcessedCount(0);
    
    try {
      // Simulate Scraping and Processing
      for (let i = 0; i < linkCount; i++) {
        // Fast loop for UI demo, but conceptually it scrapes then posts
        await new Promise(r => setTimeout(r, 20)); 
        setProcessedCount(i + 1);
        setProgress(Math.round(((i + 1) / linkCount) * 100));
      }
    } catch (err) {
      alert("Failed to connect to the server.");
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#222222] p-6 hidden md:block bg-[#0A0A0A]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Nexus</span>
        </div>
        
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[#888888] hover:text-white hover:bg-[#111111] rounded-md font-medium transition-colors">
             Articles
          </Link>
          <Link href="/dashboard/comments" className="flex items-center gap-3 px-3 py-2 bg-[#111111] text-white rounded-md font-medium border border-[#333333]">
             Blog Comments
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#888888] hover:text-white hover:bg-[#111111] rounded-md font-medium transition-colors">
             Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Auto-Scraper & Commenter</h1>
            <p className="text-[#888888] text-sm">Automatically find target blogs by country and drop AI semantic comments.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-500 text-xs font-semibold">
            AGENCY TIER
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Action Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl">
              <form onSubmit={handleBlast}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Niche / Keyword</label>
                    <input 
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g. Technology, Health"
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Target TLD (Geo)</label>
                    <select 
                      value={targetTld}
                      onChange={(e) => setTargetTld(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                    >
                      <option value=".de (Germany)">.de (Germany)</option>
                      <option value=".co.uk (UK)">.co.uk (UK)</option>
                      <option value=".fr (France)">.fr (France)</option>
                      <option value=".com (Global)">.com (Global)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Client's Target Link</label>
                    <input 
                      type="url"
                      value={clientLink}
                      onChange={(e) => setClientLink(e.target.value)}
                      placeholder="https://client-site.de"
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Number of Backlinks needed</label>
                    <input 
                      type="number"
                      value={linkCount}
                      onChange={(e) => setLinkCount(Number(e.target.value))}
                      min="10"
                      max="1000"
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isProcessing || !niche || !clientLink}
                    className="px-6 py-2.5 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {isProcessing ? "Scraping & Blasting..." : `Start ${linkCount}x Blast`} <Zap className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Progress Bar UI */}
                {isProcessing && (
                  <div className="mt-8 p-4 bg-[#0A0A0A] rounded-lg border border-[#333333]">
                    <div className="flex justify-between text-xs font-semibold text-white mb-3">
                      <span>Dorking Google & bypassing spam filters...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-white"
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-[#888888] font-medium">
                      <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-white" /> Scraped {processedCount} of {linkCount} target {targetTld.split(' ')[0]} blogs.</p>
                      {progress >= 50 && <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-white" /> AI writing natural semantic responses...</p>}
                    </div>
                  </div>
                )}

                {/* Finished State / Report Download */}
                {isFinished && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-green-500 font-bold mb-1 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Blast Complete!
                      </h3>
                      <p className="text-sm text-[#888888]">Successfully posted {linkCount} comments. Ready for client delivery.</p>
                    </div>
                    <button type="button" className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-green-500/20">
                      <FileSpreadsheet className="w-4 h-4" /> Download Report (.csv)
                    </button>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-[#222222] p-5 rounded-xl">
              <h2 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4" /> Scraper Config</h2>
              <div className="space-y-3 text-xs text-[#888888]">
                <p><strong>Dorks:</strong> <code>site:{targetTld.split(' ')[0]} inurl:blog</code></p>
                <p><strong>Proxy Rotation:</strong> Enabled (Residential)</p>
                <p><strong>Bypass:</strong> Akismet AI Evasion</p>
                <p><strong>Report:</strong> Detailed (URL, DR, Anchor)</p>
              </div>
            </div>

            <div className="bg-[#1A1111] border border-red-900/30 p-5 rounded-xl">
              <h2 className="font-semibold text-sm text-red-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Agency Notice</h2>
              <p className="text-xs text-red-400/80 leading-relaxed">
                Reports are generated automatically in CSV format (Excel). You can send this directly to your clients via Fiverr/Upwork as proof of work.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
