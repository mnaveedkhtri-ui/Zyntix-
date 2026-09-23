"use client";

import Link from "next/link";
import { Globe, FileText, MessageSquare, UserPlus, HelpCircle, FileSpreadsheet, Download, ExternalLink, CheckCircle2 , Layers, Settings, Cloud, Database} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block bg-[#050B14]">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Zyntix</span>
        </div>
        
                        <nav className="space-y-2">
          
          
          
          <Link href="/dashboard/google" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
            <Database className="w-5 h-5" /> Google Stacking
          </Link>

          <div className="pt-6 pb-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-4">Analytics & Config</p>
          </div>
          <Link href="/dashboard/reports" className="flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl font-bold transition-all border border-slate-700 shadow-sm">
            <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all font-medium">
            <Settings className="w-5 h-5" /> API Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Campaign Reports</h1>
          <p className="text-slate-400 font-medium">View, analyze, and download detailed CSV reports for your clients.</p>
        </header>

        <div className="bg-[#050B14] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#020617] border-b border-slate-800 text-slate-400 text-sm">
                  <th className="p-5 font-semibold">Campaign ID</th>
                  <th className="p-5 font-semibold">Type</th>
                  <th className="p-5 font-semibold">Target Client</th>
                  <th className="p-5 font-semibold">Links Built</th>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                <tr>
                  <td colSpan={7} className="p-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                        <FileSpreadsheet className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-lg font-bold text-slate-400 mb-1">No campaigns found</p>
                      <p className="text-sm">Run your first Zyntix campaign from the sidebar to generate a report.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}








