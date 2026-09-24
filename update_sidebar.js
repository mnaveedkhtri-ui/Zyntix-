const fs = require("fs");
let content = fs.readFileSync("src/components/DashboardSidebar.tsx", "utf8");

content = content.replace('import { Database, Settings, FileSpreadsheet, Activity, Target } from "lucide-react";', 'import { Database, Settings, FileSpreadsheet, Activity, Target } from "lucide-react";\nimport { UserButton } from "@clerk/nextjs";');

content = content.replace(
  '<div className="flex items-center gap-3 px-4 py-3 bg-slate-800/30 rounded-xl">\n          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />\n          <span className="text-sm font-medium text-slate-300">System Online</span>\n        </div>',
  '<div className="flex items-center justify-between px-4 py-3 bg-slate-800/30 rounded-xl">\n          <div className="flex items-center gap-3">\n            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />\n            <span className="text-sm font-medium text-slate-300">System Online</span>\n          </div>\n          <UserButton afterSignOutUrl="/" />\n        </div>'
);

fs.writeFileSync("src/components/DashboardSidebar.tsx", content, "utf8");
