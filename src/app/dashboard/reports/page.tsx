"use client";

import { useEffect, useState } from "react";
import { FileText, Download, ExternalLink, Copy, CheckCircle2, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ReportsDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleDownloadTXT = (campaign: any) => {
    let txtContent = "ZYNTIX - CAMPAIGN REPORT\n";
    txtContent += "==================================\n";
    txtContent += `Campaign Keyword: ${campaign.keyword}\n`;
    txtContent += `Date: ${new Date(campaign.created_at).toLocaleDateString()}\n`;
    txtContent += `Total Links: ${campaign.total_links} (DA-99)\n`;
    txtContent += "==================================\n\n";
    txtContent += "LIVE URLs:\n";
    
    if (campaign.urls) {
      campaign.urls.forEach((url: string, index: number) => {
        txtContent += `${index + 1}. ${url}\n`;
      });
    }
    
    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${campaign.keyword}_Zyntix_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLinks = (campaign: any) => {
    if (!campaign.urls) return;
    const links = campaign.urls.join("\n");
    navigator.clipboard.writeText(links);
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-400" />
              Campaign Reports
            </h1>
            <p className="text-slate-400 mt-2 text-lg">View, copy, and download Cloud TXT reports for your clients.</p>
          </div>

          <div className="bg-[#050B14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/50 bg-[#020617]/50">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Keyword</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Links Built</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="p-16 text-center flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                          <p className="text-slate-500">Loading Cloud Reports...</p>
                        </div>
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="p-16 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-600" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">No campaigns found in Cloud</h3>
                          <p className="text-slate-500 max-w-sm">Generate a new report to save it permanently to Supabase.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-800/30 hover:bg-[#020617] transition-colors">
                        <td className="p-4 font-bold text-sm text-emerald-400">{report.keyword}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                            {report.total_links} DA-99
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-400">{new Date(report.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-sm text-slate-300">
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> {report.status}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                            >
                              View URLs
                            </button>
                            <button 
                              onClick={() => handleCopyLinks(report)}
                              className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                            >
                              {copiedId === report.id ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              Copy
                            </button>
                            <button 
                              onClick={() => handleDownloadTXT(report)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" /> TXT
                            </button>
                          
                            <button 
                              onClick={() => handleDelete(report.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-2 py-1.5 rounded-lg transition-colors font-medium flex items-center justify-center"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Expanded URLs View */}
            {expandedId && (
              <div className="p-6 bg-[#020617] border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-emerald-400">Campaign URLs</h4>
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
