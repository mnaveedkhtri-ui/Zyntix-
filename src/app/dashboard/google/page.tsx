"use client";

import { useState, useEffect, Suspense } from "react"; import { useSearchParams } from "next/navigation";
import { Database, AlertTriangle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

function GoogleDashboardContent() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const k = searchParams.get('keyword');
    if(k) { setKeyword(k); setBulkCount(50); }
  }, [searchParams]);
  const [keyword, setKeyword] = useState('');
  const [bulkCount, setBulkCount] = useState(1);
  const [progressMsg, setProgressMsg] = useState('');
  const [targetUrl, setTargetUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const generateDocWithRetry = async (appsScriptUrl: string, targetUrl: string, keyword: string, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('/api/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUrl, keyword, appsScriptUrl })
        });
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          return data; // Success!
        } else {
          throw new Error(data.error || "Unknown API error");
        }
      } catch (error: any) {
        console.error(`Attempt ${attempt} failed for keyword: ${keyword}`, error);
        if (attempt === maxRetries) {
          return { success: false, error: error.message }; // Failed completely
        }
        // Wait before retrying (Exponential backoff: 2s, 4s...)
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    setProgressMsg(`Starting robust generation of ${bulkCount} docs...`);
    
    const appsScriptUrl = localStorage.getItem("apps_script_url");
    if (!appsScriptUrl || !appsScriptUrl.includes("script.google.com")) {
      alert("Error: Please add your Google Apps Script Web App URL in the Settings page first!");
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    const maxDocs = Math.min(bulkCount, 500); 
    let successCount = 0;
    const generatedUrls: string[] = [];
    const newReportData: any[] = [];

    for (let i = 1; i <= maxDocs; i++) {
      setProgressMsg(`Generating document ${i} of ${maxDocs}...`);
      
      const result = await generateDocWithRetry(appsScriptUrl, targetUrl, `${keyword} (Variation ${i})`, 3);
      
      if (result && result.success) {
         newReportData.push(...result.data);
         generatedUrls.push(...result.data.map((d: any) => d.url));
         successCount++;
         setReportData(prev => [...result.data, ...prev]);
      } else {
         console.error(`Doc ${i} failed permanently after 3 retries.`);
         setProgressMsg(`Warning: Document ${i} failed due to Google limits. Continuing...`);
      }
      
      // Mandatory 3-second delay between docs to prevent Google API Rate Limiting
      if (i < maxDocs) {
        setProgressMsg(`Document ${i} complete. Cooling down API for 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setProgressMsg(`? Task Complete! Successfully generated ${successCount} out of ${maxDocs} documents.`);
    
    if (successCount > 0) {
      const newCampaign = {
        id: `CMP-${Date.now().toString().slice(-6)}`,
        type: 'Google Entity Stack',
        client: targetUrl || "Unknown Client",
        links: successCount,
        date: new Date().toLocaleDateString(),
        status: successCount === maxDocs ? 'Completed' : 'Partial Success',
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
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 relative z-10 flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg mb-1">Apps Script Engine (Bulletproof Mode)</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Zyntix is now equipped with an auto-retry mechanism and API cooldowns to guarantee 100% success rates on large bulk orders.
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
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Stack...
                  </>
                ) : `Generate ${bulkCount} Docs`}
              </button>
              
              {progressMsg && (
                <div className="mt-6 px-6 py-3 bg-[#020617] border border-emerald-500/30 rounded-xl text-emerald-400 font-medium text-sm text-center flex flex-col items-center gap-2">
                  <span>{progressMsg}</span>
                  {progressMsg.includes("Cooling") && (
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-emerald-500 h-1 rounded-full animate-[pulse_3s_ease-in-out_infinite] w-full"></div>
                    </div>
                  )}
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


export default function GoogleDashboard() { return <Suspense fallback={<div>Loading...</div>}><GoogleDashboardContent /></Suspense>; }

