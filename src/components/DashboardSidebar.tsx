"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-slate-800 bg-[#020617] p-6 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            Z
          </div>
          <span className="font-extrabold text-white text-base">Zyntix Studio</span>
        </div>

        <nav className="space-y-1 text-xs">
          <Link 
            href="/studio" 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${pathname === '/studio' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Studio</span>
          </Link>
          <Link 
            href="/site/demo" 
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition"
          >
            <Layers className="w-4 h-4" />
            <span>Live Publication</span>
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Engine Online</span>
        </span>
        <span>v2.0</span>
      </div>
    </div>
  );
}
