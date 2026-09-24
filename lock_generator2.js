const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// Remove the old lock screen
const lockScreenRegex = /if \(!isPremium\) \{[\s\S]*?\}\s*return \(\s*<div className="max-w-5xl/m;
content = content.replace(lockScreenRegex, 'return (\n    <div className="max-w-5xl');

// Add credits check
content = content.replace(
  'const isPremium = user?.publicMetadata?.role === "premium" || user?.publicMetadata?.role === "admin";',
  'const credits = (user?.publicMetadata?.credits as number) || 0;'
);

// Add the UI for credits in the header
content = content.replace(
  '<p className="text-slate-400 mt-2 text-lg">Build DA-99 context-rich entities automatically. Paste your keyword and let the Engine work.</p>',
  `<div className="flex items-center justify-between"><p className="text-slate-400 mt-2 text-lg">Build DA-99 context-rich entities automatically.</p>
  <div className="bg-[#050B14] border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
    <span className="text-sm font-bold text-slate-300">Credits Available:</span>
    <span className="text-lg font-black text-emerald-400">{credits}</span>
  </div></div>`
);

// Update the Generate button to show locked state if credits === 0
content = content.replace(
  '<button\n                onClick={handleGenerate}',
  '{credits === 0 ? (\n              <Link href="/pricing" className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-lg py-5 rounded-xl transition-all flex items-center justify-center gap-2">\n                <Lock className="w-5 h-5" /> Out of Credits - Recharge Now\n              </Link>\n            ) : <button\n                onClick={handleGenerate}'
);

content = content.replace(
  'className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"',
  'className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"\n              />\n            )}'
);
// Fix the self-closing tag issue I just introduced:
content = content.replace(/\/>\n            \)}\n                disabled={isGenerating}/, ' disabled={isGenerating}');

// Instead of regex hacking the button, let's just do it cleanly:
