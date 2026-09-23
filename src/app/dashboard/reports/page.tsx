"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ReportsDashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex overflow-hidden">
      <DashboardSidebar />

      {/* Main Content */}
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
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty State */}
                </tbody>
              </table>
            </div>
            
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No campaigns found</h3>
              <p className="text-slate-500 max-w-sm">Run your first Zyntix Google Stacking campaign to generate a report.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
