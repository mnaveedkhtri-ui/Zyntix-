"use client";

import Link from "next/link";
import { Globe, FileText, MessageSquare, UserPlus, HelpCircle, FileSpreadsheet, Download, ExternalLink, CheckCircle2 , Layers} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block bg-[#050B14]">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Syndicator</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> Web 2.0 Articles
          </Link>
          <Link href="/dashboard/comments" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> Blog Comments
          </Link>
          <Link href="/dashboard/profiles" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <UserPlus className="w-5 h-5" /> High-DA Profiles
          </Link>
          <Link href="/dashboard/forums" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <HelpCircle className="w-5 h-5" /> Q&A / Forums
          </Link>
          <Link href="/dashboard/mixed" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
            <Layers className="w-5 h-5" /> Mixed Campaigns
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 rounded-xl font-medium border border-emerald-500/20 shadow-sm mt-8">
            <FileSpreadsheet className="w-5 h-5" /> Detailed Reports
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
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                  <td className="p-5 text-slate-300">#CMP-9923</td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs uppercase tracking-wide font-bold border border-cyan-500/20">Web 2.0</span>
                  </td>
                  <td className="p-5 text-slate-300 flex items-center gap-2">
                    best-ai-tools.com <ExternalLink className="w-3 h-3 text-slate-500" />
                  </td>
                  <td className="p-5 text-emerald-400 font-bold">10 / 10</td>
                  <td className="p-5 text-slate-400">Oct 24, 2026</td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shadow-sm">
                      <Download className="w-4 h-4" /> CSV
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                  <td className="p-5 text-slate-300">#CMP-9922</td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs uppercase tracking-wide font-bold border border-blue-500/20">Profiles</span>
                  </td>
                  <td className="p-5 text-slate-300 flex items-center gap-2">
                    seo-agency.de <ExternalLink className="w-3 h-3 text-slate-500" />
                  </td>
                  <td className="p-5 text-emerald-400 font-bold">50 / 50</td>
                  <td className="p-5 text-slate-400">Oct 23, 2026</td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shadow-sm">
                      <Download className="w-4 h-4" /> CSV
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/20 transition-colors group">
                  <td className="p-5 text-slate-300">#CMP-9921</td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs uppercase tracking-wide font-bold border border-purple-500/20">Comments</span>
                  </td>
                  <td className="p-5 text-slate-300 flex items-center gap-2">
                    tech-startup.io <ExternalLink className="w-3 h-3 text-slate-500" />
                  </td>
                  <td className="p-5 text-emerald-400 font-bold">500 / 500</td>
                  <td className="p-5 text-slate-400">Oct 22, 2026</td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> Completed</span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shadow-sm">
                      <Download className="w-4 h-4" /> CSV
                    </button>
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

