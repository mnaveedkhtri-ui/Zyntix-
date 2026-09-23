"use client";

import { useState, useEffect } from "react";
import { Settings, CheckCircle2, ShieldAlert, Key, Cloud, Database, FileSpreadsheet, Globe } from "lucide-react";
import Link from "next/link";

export default function SettingsDashboard() {
  const [awsKey, setAwsKey] = useState("");
  const [awsSecret, setAwsSecret] = useState("");
  const [gcpKey, setGcpKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setAwsKey(localStorage.getItem("aws_key") || "");
    setAwsSecret(localStorage.getItem("aws_secret") || "");
    setGcpKey(localStorage.getItem("gcp_key") || "");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("aws_key", awsKey);
    localStorage.setItem("aws_secret", awsSecret);
    localStorage.setItem("gcp_key", gcpKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="flex items-center gap-3 mb-10 px-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard/google" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
              <Database className="w-5 h-5" /> Google Stacking
            </Link>
            <Link href="/dashboard/cloud" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
              <Cloud className="w-5 h-5" /> Cloud Authority
            </Link>

            <div className="pt-6 pb-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4">Analytics & Config</p>
            </div>
            <Link href="/dashboard/reports" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
              <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl border border-emerald-500/20 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Settings className="w-5 h-5" /> API Settings
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-400" />
              API Settings & Keys
            </h1>
            <p className="text-slate-400 mt-2">Connect Zyntix securely to your Cloud Providers for bulk stacking.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Google Cloud Section */}
            <div className="bg-[#050B14] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/50">
                <Database className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Google Entity Stacking (GCP)</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Google Cloud Service Account (JSON)</label>
                  <textarea 
                    value={gcpKey} 
                    onChange={(e) => setGcpKey(e.target.value)} 
                    placeholder="{ `json`: `key` }" 
                    rows={4}
                    className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* AWS Section */}
            <div className="bg-[#050B14] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/50">
                <Cloud className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Amazon Web Services (AWS)</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">AWS Access Key ID</label>
                  <input type="text" value={awsKey} onChange={(e) => setAwsKey(e.target.value)} placeholder="AKIAIOSFODNN7EXAMPLE" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">AWS Secret Access Key</label>
                  <input type="password" value={awsSecret} onChange={(e) => setAwsSecret(e.target.value)} placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between bg-[#050B14] border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Keys are stored securely in your browser's local storage.
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2">
                {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                {isSaved ? "Saved Securely" : "Save API Keys"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
