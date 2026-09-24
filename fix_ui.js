const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

const oldText = '<p className="text-slate-400 mt-2 text-lg">Generate public Google Docs and Sheets to build DA-99 Entity Networks.</p>';
const newUI = `<div className="flex items-center justify-between"><p className="text-slate-400 mt-2 text-lg">Generate public Google Docs and Sheets to build DA-99 Entity Networks.</p>
  <div className="bg-[#050B14] border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
    <span className="text-sm font-bold text-slate-300">Credits Available:</span>
    <span className="text-lg font-black text-emerald-400">{displayCredits}</span>
  </div></div>`;

if (content.includes(oldText)) {
  content = content.replace(oldText, newUI);
  fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
  console.log("UI injected successfully!");
} else {
  console.log("Could not find the target text.");
}
