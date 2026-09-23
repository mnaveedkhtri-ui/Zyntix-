import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, FileSpreadsheet, Settings, Globe } from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Google Stacking", href: "/dashboard/google", icon: Database },
  ];

  const configItems = [
    { name: "Detailed Reports", href: "/dashboard/reports", icon: FileSpreadsheet },
    { name: "API Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 shrink-0 bg-[#020617] min-h-screen border-r border-slate-800 p-6 flex flex-col">
      <Link href="/" className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" /> {item.name}
            </Link>
          );
        })}

        <div className="pt-8 pb-3">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-4">Analytics & Config</p>
        </div>

        {configItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" /> {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom status indicator */}
      <div className="pt-8 mt-auto border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#050B14] rounded-xl border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-400">System Online</span>
        </div>
      </div>
    </div>
  );
}
