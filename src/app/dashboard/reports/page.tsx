"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, FileText, Download, ExternalLink } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ReportsDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("zyntix_reports") || "[]");
    setReports(savedReports);
  }, []);

  const handleDownloadCSV = (campaign: any) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Live URL\n";
    campaign.urls.forEach((url: string) => {
      csvContent += `${url}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${campaign.id}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
              Campaign Reports
            </h1>
            <p className="text-slate-400 mt-2 text-lg">View, analyze, and download detailed CSV reports for your clients.</p>
          </div>

          <div className="bg-[#050B14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/50 bg-[#020617]/50">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign ID</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Target Client</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Links Built</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-slate-800/30 hover:bg-[#020617] transition-colors">
                      <td className="p-4 font-mono text-sm text-emerald-400">{report.id}</td>
                      <td className="p-4 text-sm text-slate-300">{report.type}</td>
                      <td className="p-4 text-sm text-slate-300 truncate max-w-[200px]">{report.client}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                          {report.links} DA-99
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{report.date}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            View URLs
                          </button>
                          <button 
                            onClick={() => handleDownloadCSV(report)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> CSV
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="p-16 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-600" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">No campaigns found</h3>
                          <p className="text-slate-500 max-w-sm">Run your first Zyntix Google Stacking campaign to generate a report.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Expanded URLs View */}
            {expandedId && (
              <div className="p-6 bg-[#020617] border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-emerald-400">Campaign URLs ({expandedId})</h4>
                  <button onClick={() => setExpandedId(null)} className="text-slate-500 hover:text-white text-sm">Close</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {reports.find(r => r.id === expandedId)?.urls?.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-[#050B14] border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-colors text-sm text-slate-300 truncate group">
                      <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{url}</span>
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
