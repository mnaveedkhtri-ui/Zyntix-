"use client";

import { useState, useEffect } from "react";
import { Settings, CheckCircle2, ShieldCheck, Key, Zap, Server } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SettingsDashboard() {
  const [appsScriptUrl, setAppsScriptUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setAppsScriptUrl(localStorage.getItem("apps_script_url") || "");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("apps_script_url", appsScriptUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSecretClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-400" />
              Infrastructure & API
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Your account's cloud infrastructure status.</p>
          </div>

          <div className="space-y-6">
            
            {/* Managed Engine Display (For Clients) */}
            <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div 
                className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800/50 relative z-10 cursor-default select-none"
                onClick={handleSecretClick}
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Zyntix Enterprise Cloud Engine</h2>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Fully Managed Infrastructure</h3>
                    <p className="text-sm opacity-80 mt-1">Your account is connected to Zyntix's enterprise Google infrastructure. No API keys or external configurations are required to generate DA 100 Link Wheels.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secret Admin Input (Revealed after 5 clicks on the title) */}
            {clickCount >= 5 && (
              <form onSubmit={handleSave} className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-[#0f172a] border border-amber-500/30 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                      <Key className="w-5 h-5" /> Admin API Override
                    </h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Web App URL</label>
                    <input 
                      type="url"
                      value={appsScriptUrl} 
                      onChange={(e) => setAppsScriptUrl(e.target.value)} 
                      placeholder="https://script.google.com/macros/s/.../exec" 
                      className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2">
                      {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      {isSaved ? "Saved" : "Override Master Key"}
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
