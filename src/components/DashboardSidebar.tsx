"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Settings, FileSpreadsheet, Activity, Target } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-[#050B14] border-r border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-slate-900" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">Zyntix</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/dashboard/google" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/google' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
          <Database className="w-5 h-5" />
          Google Stacking
        </Link>
        <Link href="/dashboard/github" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/github' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
          <Database className="w-5 h-5" />
          GitHub Stacking
        </Link>
        
        <div className="mt-8 mb-4">
          <div className="text-xs font-bold text-slate-500 mb-4 tracking-wider">ANALYTICS & CONFIG</div>
          <Link href="/dashboard/audit" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${pathname === '/dashboard/audit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Target className="w-5 h-5" />
            AEO SERP Audit
          </Link>
          <Link href="/dashboard/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${pathname === '/dashboard/reports' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <FileSpreadsheet className="w-5 h-5" />
            Detailed Reports
          </Link>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/settings' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Settings className="w-5 h-5" />
            API Settings
          </Link>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
