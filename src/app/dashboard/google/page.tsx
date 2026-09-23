"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

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
    const folderId = localStorage.getItem("gcp_folder_id");
    if (!gcpKey) {
      alert("Error: Please add your Google Cloud JSON Key in the Settings page first!");
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    const maxDocs = Math.min(bulkCount, 500); 
    let successCount = 0;
    const generatedUrls: string[] = [];

    for (let i = 1; i <= maxDocs; i++) {
      setProgressMsg(`Generating document ${i} of ${maxDocs}... Please keep this tab open.`);
      try {
        const response = await fetch('/api/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUrl,
            keyword: `${keyword} (Variation ${i})`,
            gcpKey,
            folderId
          })
        });

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
           setReportData(prev => [...data.data, ...prev]);
           generatedUrls.push(...data.data.map((d: any) => d.url));
           successCount++;
        } else {
           console.error(`Failed on doc ${i}:`, data.error);
        }
      } catch (err) {
        console.error(`Error on doc ${i}:`, err);
      }
      
      if (i < maxDocs) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setProgressMsg(`? Successfully generated ${successCount} out of ${maxDocs} documents!`);
    
    // Save campaign to localStorage for Reports page
    if (successCount > 0) {
      const newCampaign = {
        id: `CMP-${Date.now().toString().slice(-6)}`,
        type: 'Google Entity Stack',
        client: targetUrl || "Unknown Client",
        links: successCount,
        date: new Date().toLocaleDateString(),
        status: 'Completed',
        urls: generatedUrls
      };
      const existingReports = JSON.parse(localStorage.getItem("zyntix_reports") || "[]");
      localStorage.setItem("zyntix_reports", JSON.stringify([newCampaign, ...existingReports]));
    }

    setIsProcessing(false);
  } 

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-emerald-400" />
              Google Entity Stacking
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Generate public Google Docs and Sheets to build DA-99 Entity Networks.</p>
          </div>

          <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg mb-1">Authenticated Google API</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Zyntix uses your official Service Account to create Google Docs directly on Google's infrastructure. These links are public, permanent, and indexable.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Target URL (Client's Website)</label>
                <input 
                  type="url" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                  placeholder="https://client-website.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Primary Keyword / Entity</label>
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                  placeholder="e.g. Best Plumber in London" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Bulk Quantity (Number of Docs)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="500" 
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value))}
                  className="w-full bg-[#020617] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col items-center">
              <button 
                onClick={handlePublish}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isProcessing ? "Executing Stack..." : `Generate ${bulkCount} Docs`}
              </button>
              
              {progressMsg && (
                <div className="mt-6 px-6 py-3 bg-[#020617] border border-emerald-500/30 rounded-xl text-emerald-400 font-medium text-sm animate-pulse">
                  {progressMsg}
                </div>
              )}
            </div>

            {reportData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Live URLs</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto p-4 bg-[#020617] rounded-xl border border-slate-800">
                  {reportData.map((doc, idx) => (
                    <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="block text-emerald-400 hover:underline text-sm truncate">
                      {idx+1}. {doc.url}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

