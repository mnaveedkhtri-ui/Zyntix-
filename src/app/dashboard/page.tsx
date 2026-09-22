"use client";

import { useState } from "react";
import { Link2, LayoutDashboard, Settings, Activity, CheckCircle2, Globe, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock platforms
  const platforms = [
    { name: "Medium", dr: 94, connected: true },
    { name: "LinkedIn", dr: 98, connected: true },
    { name: "Hashnode", dr: 89, connected: false },
    { name: "Dev.to", dr: 91, connected: false },
  ];

  const handleBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing steps
    const steps = [25, 50, 75, 100];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      setProgress(steps[i]);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Syndicator</span>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Campaigns
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" /> Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" /> Integrations
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">New Campaign</h1>
          <p className="text-slate-400">Launch a new semantic syndication blast to your connected networks.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Action Area */}
          <div className="md:col-span-2 space-y-6">
            {/* The Input Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <form onSubmit={handleBlast}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Article URL</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://your-site.com/blog/article"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                  >
                    {isProcessing ? "Processing..." : "Blast Now"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Progress Bar UI */}
                {isProcessing && (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                      <span>Syndication in progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Fetching source content...</p>
                      {progress >= 50 && <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> AI Semantic Rewrite via Pollinations...</p>}
                      {progress >= 75 && <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Fetching HD Unsplash Cover Image...</p>}
                      {progress >= 100 && <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Blast Complete! 4 Backlinks generated.</p>}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Recent Campaigns Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="font-bold">Recent Links Generated</h2>
              </div>
              <div className="divide-y divide-slate-800">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Semantic Optimization Guide</p>
                        <p className="text-xs text-slate-500">Posted to Medium • 2 hours ago</p>
                      </div>
                    </div>
                    <a href="#" className="text-blue-400 text-sm font-medium hover:underline">View Live</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Integrations */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="font-bold mb-4">Active Networks</h2>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-200">{platform.name}</p>
                      <p className="text-xs text-slate-500">DA {platform.dr}</p>
                    </div>
                    {platform.connected ? (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Connected
                      </span>
                    ) : (
                      <button className="px-3 py-1 rounded text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
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
