const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// Remove the hard lock
const lockRegex = /if \(!isPremium\) \{[\s\S]*?\}\s*return \(\s*<div className="max-w-5xl/m;
content = content.replace(lockRegex, 'return (\n    <div className="max-w-5xl');

// Add credits check
content = content.replace(
  'const isPremium = user?.publicMetadata?.role === "premium" || user?.publicMetadata?.role === "admin";',
  'const credits = (user?.publicMetadata?.credits as number) || 0;'
);

// Inject credits UI
content = content.replace(
  '<p className="text-slate-400 mt-2 text-lg">Build DA-99 context-rich entities automatically. Paste your keyword and let the Engine work.</p>',
  `<div className="flex items-center justify-between"><p className="text-slate-400 mt-2 text-lg">Build DA-99 context-rich entities automatically.</p>
  <div className="bg-[#050B14] border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
    <span className="text-sm font-bold text-slate-300">Credits Available:</span>
    <span className="text-lg font-black text-emerald-400">{credits}</span>
  </div></div>`
);

// Inject Deduct API Call inside handleGenerate
content = content.replace(
  'setIsGenerating(true);\n    setLogs([]);\n    setGeneratedUrls([]);',
  `setIsGenerating(true);\n    setLogs([]);\n    setGeneratedUrls([]);\n\n    try {\n      const creditRes = await fetch("/api/credits/deduct", { method: "POST" });\n      if (!creditRes.ok) throw new Error("Out of credits");\n    } catch (e) {\n      addLog("System Alert", "Insufficient Credits. Please recharge.", "error");\n      setIsGenerating(false);\n      return;\n    }`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
