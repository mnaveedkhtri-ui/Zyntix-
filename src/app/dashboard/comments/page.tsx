"use client";

import { useState } from "react";
import { Link2, Zap, CheckCircle2, Search, Settings2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BulkComments() {
  const [targetUrls, setTargetUrls] = useState("");
  const [clientLink, setClientLink] = useState("");
  const [language, setLanguage] = useState("German (.de)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const handleBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = targetUrls.split('\n').map(u => u.trim()).filter(u => u);
    if (urls.length === 0 || !clientLink) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    
    try {
      // Process each URL
      for (let i = 0; i < urls.length; i++) {
        await new Promise(r => setTimeout(r, 200)); // Fast loop for UI demo
        setProcessedCount(i + 1);
        setProgress(Math.round(((i + 1) / urls.length) * 100));
      }
    } catch (err) {
      alert("Failed to connect to the server.");
    }
    
    setTimeout(() => {
      setIsProcessing(false);
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
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Bulk Comment Engine</h1>
            <p className="text-[#888888] text-sm">Automate semantic blog comments across 500+ high-authority sites instantly.</p>
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
                    <label className="block text-sm font-medium text-[#888888] mb-2">Client's Backlink URL</label>
                    <input 
                      type="url"
                      value={clientLink}
                      onChange={(e) => setClientLink(e.target.value)}
                      placeholder="https://client-site.com"
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888888] mb-2">Language / Geo</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#333333] rounded-md py-2 px-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                    >
                      <option>German (.de)</option>
                      <option>English (.com)</option>
                      <option>French (.fr)</option>
                      <option>Spanish (.es)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#888888]">Target Blog URLs (Paste up to 500)</label>
                    <span className="text-xs text-[#666666]">{targetUrls.split('\n').filter(u => u.trim()).length} / 500 URLs</span>
                  </div>
                  <textarea 
                    value={targetUrls}
                    onChange={(e) => setTargetUrls(e.target.value)}
                    placeholder="https://high-da-blog.de/article-1&#10;https://another-site.de/post-2"
                    className="w-full h-48 bg-[#0A0A0A] border border-[#333333] rounded-md py-3 px-4 text-white focus:outline-none focus:border-white transition-colors resize-none font-mono text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isProcessing || !targetUrls.trim() || !clientLink}
                    className="px-6 py-2.5 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {isProcessing ? "Executing..." : "Start 500x Blast"} <Zap className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Progress Bar UI */}
                {isProcessing && (
                  <div className="mt-8 p-4 bg-[#0A0A0A] rounded-lg border border-[#333333]">
                    <div className="flex justify-between text-xs font-semibold text-white mb-3">
                      <span>Bypassing spam filters & generating context...</span>
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
                      <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-white" /> Scraped {processedCount} of {targetUrls.split('\n').filter(u => u.trim()).length} target blogs.</p>
                      {progress >= 50 && <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-white" /> AI writing natural German responses...</p>}
                      {progress >= 100 && <p className="flex items-center gap-2 text-green-500 font-semibold"><CheckCircle2 className="w-4 h-4" /> Blast complete! Report generated.</p>}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-[#222222] p-5 rounded-xl">
              <h2 className="font-semibold text-sm text-white mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4" /> AI Configuration</h2>
              <div className="space-y-3 text-xs text-[#888888]">
                <p><strong>Footprint:</strong> WordPress, Custom Forms</p>
                <p><strong>Proxy Rotation:</strong> Enabled (Residential)</p>
                <p><strong>Bypass:</strong> Akismet AI Evasion</p>
                <p><strong>Context Match:</strong> Strict</p>
              </div>
            </div>

            <div className="bg-[#1A1111] border border-red-900/30 p-5 rounded-xl">
              <h2 className="font-semibold text-sm text-red-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Agency Notice</h2>
              <p className="text-xs text-red-400/80 leading-relaxed">
                Running 500 links simultaneously requires high proxy bandwidth. Our system automatically throttles submissions to 10-15 per minute to avoid setting off Akismet/Cloudflare spam traps on high DA .de domains.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
