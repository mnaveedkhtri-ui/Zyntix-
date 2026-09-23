"use client";

import { useState } from "react";
import { Database, Activity, ExternalLink, Globe, FileText, UserPlus, Cloud, FileSpreadsheet, Settings } from "lucide-react";
import Link from "next/link";

export default function GoogleDashboard() {
  const [keyword, setKeyword] = useState('');
  const [bulkCount, setBulkCount] = useState(1);
  const [progressMsg, setProgressMsg] = useState('');
  const [targetUrl, setTargetUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

    const handlePublish = async () => {
    setIsProcessing(true);
    setProgressMsg(`Starting bulk generation of ${bulkCount} docs...`);
    
    const gcpKey = localStorage.getItem("gcp_key");
    if (!gcpKey) {
      alert("Error: Please add your Google Cloud JSON Key in the Settings page first!");
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    const maxDocs = Math.min(bulkCount, 500); // Limit to 500 to be safe
    let successCount = 0;

    for (let i = 1; i <= maxDocs; i++) {
      setProgressMsg(`Generating document ${i} of ${maxDocs}... Please keep this tab open.`);
      try {
        const response = await fetch('/api/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUrl,
            keyword: `${keyword} (Variation ${i})`,
            gcpKey
          })
        });

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
           setReportData(prev => [...data.data, ...prev]);
           successCount++;
        } else {
           console.error(`Failed on doc ${i}:`, data.error);
        }
      } catch (err) {
        console.error(`Error on doc ${i}:`, err);
      }
      
      // Delay to avoid hitting Google Drive API rate limits (e.g., 2 seconds)
      if (i < maxDocs) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setProgressMsg(`? Successfully generated ${successCount} out of ${maxDocs} documents!`);
    setIsProcessing(false);
  } 

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        <div className="w-64 shrink-0">
          <div className="flex items-center gap-3 mb-10 px-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
          </div>

          <nav className="space-y-2">
            
            
            
            <Link href="/dashboard/google" className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl border border-emerald-500/20 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Database className="w-5 h-5" /> Google Stacking
            </Link>

            <div className="pt-6 pb-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4">Analytics & Config</p>
            </div>
            <Link href="/dashboard/reports" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
              <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
              <Settings className="w-5 h-5" /> API Settings
            </Link>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-emerald-400" />
              Google Entity Stacking
            </h1>
            <p className="text-slate-400 mt-2">Generate public Google Docs and Sheets to build DA-99 Entity Networks.</p>
          </div>

          <div className="bg-[#050B14] border border-slate-800 rounded-2xl p-6 shadow-xl">
             <div className="space-y-6">
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4 items-start">
                  <Activity className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-emerald-400 font-bold mb-1">Authenticated Google API</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Zyntix uses your official Service Account to create Google Docs directly on Google's infrastructure. These links are public, permanent, and indexable.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Target URL (Client's Website)</label>
                  <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://client-website.com" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                </div>
                                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Primary Keyword / Entity</label>
                  <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Best Plumber in London" className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Bulk Quantity (Number of Docs)</label>
                  <input type="number" min="1" max="500" value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value))} className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                  <p className="text-xs text-emerald-500/70 mt-2">Zyntix will automatically generate variations and delay requests to keep your API safe.</p>
                </div>
             </div>

                          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
               <div className="text-sm font-bold text-emerald-400">
                  {progressMsg}
               </div>
               <button 
                  onClick={handlePublish}
                  disabled={isProcessing || !targetUrl || !keyword}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? "Processing Bulk..." : "Generate Bulk Docs"}
                </button>
             </div>
          </div>

          {reportData.length > 0 && (
            <div className="mt-8 bg-[#050B14] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Generated Links</h3>
              <div className="space-y-3">
                {reportData.map((link, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#020617] p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded mr-3">{link.platform}</span>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white truncate max-w-md inline-block align-middle">{link.url}</a>
                    </div>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300"><ExternalLink className="w-5 h-5" /></a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}







