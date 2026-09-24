const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// We need to inject the auth check at the top of the component.
// But this is a Client component! Wait, we can't easily check auth().publicMetadata in a "use client" component without using useUser() from @clerk/nextjs.

content = content.replace('import { useAuth } from "@clerk/nextjs";', 'import { useAuth, useUser } from "@clerk/nextjs";');
content = content.replace('import { Lock, FileText, Settings, Rocket, Link2, KeySquare, ChevronRight, CheckCircle2, Server, Globe } from "lucide-react";', 'import { Lock, FileText, Settings, Rocket, Link2, KeySquare, ChevronRight, CheckCircle2, Server, Globe, Crown } from "lucide-react";\nimport Link from "next/link";');

content = content.replace('const { getToken } = useAuth();', 'const { getToken } = useAuth();\n  const { user } = useUser();\n\n  const isPremium = user?.publicMetadata?.role === "premium" || user?.publicMetadata?.role === "admin";');

const lockScreen = `
  if (!isPremium) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]">
          <Crown className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Premium Feature Locked</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          The Automated Google Entity Stacking engine is reserved for Agency Pro members. Upgrade your account to unlock unlimited DA-99 link generation.
        </p>
        <Link href="/pricing" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25">
          <Crown className="w-5 h-5" />
          Upgrade to Agency Pro
        </Link>
      </div>
    );
  }
`;

content = content.replace('return (\n    <div className="max-w-5xl mx-auto space-y-8">', lockScreen + '\n  return (\n    <div className="max-w-5xl mx-auto space-y-8">');

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
