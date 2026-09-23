"use client";

import { useState, useEffect } from "react";
import { Settings, CheckCircle2, ShieldAlert, Key, Database, FolderOpen } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SettingsDashboard() {
  const [gcpKey, setGcpKey] = useState("");
  const [folderId, setFolderId] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setGcpKey(localStorage.getItem("gcp_key") || "");
    setFolderId(localStorage.getItem("gcp_folder_id") || "");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gcp_key", gcpKey);
    localStorage.setItem("gcp_folder_id", folderId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-400" />
              API Settings & Keys
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Connect Zyntix securely to your Cloud Providers for bulk stacking.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800/50 relative z-10">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Google Entity Stacking (GCP)</h2>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Google Cloud Service Account (JSON)</label>
                  <textarea 
                    value={gcpKey} 
                    onChange={(e) => setGcpKey(e.target.value)} 
                    placeholder="{ `json`: `key` }" 
                    rows={6}
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm leading-relaxed"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-emerald-500" />
                    Google Drive Folder ID (To bypass Quota Limits)
                  </label>
                  <input 
                    type="text" 
                    value={folderId} 
                    onChange={(e) => setFolderId(e.target.value)} 
                    placeholder="e.g. 1A2b3C4d5E6f7G8h9I0j" 
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Create a folder in your personal Gmail Drive, share it with your Service Account email as an Editor, and paste the Folder ID here.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#050B14] border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Keys are stored securely in your browser's local storage.
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2">
                {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                {isSaved ? "Saved Securely" : "Save Settings"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
