"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, ExternalLink, Calendar, Search, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">My Reports</h1>
        <p className="text-slate-400">View and manage your generated SEO Entity Stacks.</p>
      </div>

      <div className="bg-[#050B14] border border-slate-800 rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No reports generated yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {report.keyword}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(report.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Search className="w-4 h-4" /> {report.total_links} Assets Generated</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                    {report.status}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-bold text-slate-500 mb-3 tracking-wider">GENERATED ASSETS</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {report.urls && report.urls.map((url: string, index: number) => (
                      <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-800/50 hover:border-emerald-500/30 group">
                        <span className="truncate pr-4">Asset #{index + 1}</span>
                        <ExternalLink className="w-4 h-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
