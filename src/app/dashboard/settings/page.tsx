"use client";

import Link from "next/link";
import { Globe, FileText, UserPlus, FileSpreadsheet, Settings, Key, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [githubKey, setGithubKey] = useState("");
  const [devtoKey, setDevtoKey] = useState("");
  const [hashnodeKey, setHashnodeKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Basic local storage simulation for now
    localStorage.setItem("github_key", githubKey);
    localStorage.setItem("devto_key", devtoKey);
    localStorage.setItem("hashnode_key", hashnodeKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block bg-[#050B14]">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Zyn<span className="text-cyan-400">tix</span></span>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
            <FileText className="w-5 h-5" /> Web 2.0 Articles
          </Link>
          <Link href="/dashboard/profiles" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
            <UserPlus className="w-5 h-5" /> High-DA Profiles
          </Link>

          <div className="pt-6 pb-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4">Analytics & Config</p>
          </div>
          <Link href="/dashboard/reports" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
            <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 bg-cyan-500/10 text-cyan-400 px-4 py-3 rounded-xl border border-cyan-500/20 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Settings className="w-5 h-5" /> API Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-slate-800 p-6 flex justify-between items-center bg-[#050B14]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold">API Connections</h1>
            <p className="text-sm text-slate-400 mt-1">Configure your Official API keys for 100% real automated syndication.</p>
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto space-y-8">
          
          <div className="bg-[#050B14] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Key className="w-32 h-32" />
             </div>
             
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Key className="w-5 h-5 text-cyan-400" /> Platform Integration Keys
             </h2>

             <div className="space-y-6">
                {/* GitHub */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">GitHub Personal Access Token (DA 95)</label>
                  <input 
                    type="password" 
                    value={githubKey}
                    onChange={(e) => setGithubKey(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx" 
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">Required for High-DA Profile backlinks and Repository creation.</p>
                </div>

                {/* Dev.to */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Dev.to API Key (DA 90)</label>
                  <input 
                    type="password" 
                    value={devtoKey}
                    onChange={(e) => setDevtoKey(e.target.value)}
                    placeholder="Enter your DEV Community API Key" 
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">Required for Web 2.0 Article publishing.</p>
                </div>

                {/* Hashnode */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Hashnode Personal Access Token (DA 90)</label>
                  <input 
                    type="password" 
                    value={hashnodeKey}
                    onChange={(e) => setHashnodeKey(e.target.value)}
                    placeholder="Enter your Hashnode Developer Token" 
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">Required for Hashnode Blog publishing.</p>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {saved ? "Keys Saved Securely" : "Save Configurations"}
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
