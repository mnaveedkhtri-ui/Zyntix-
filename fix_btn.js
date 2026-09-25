const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  /<button[\s\S]*?onClick={handleGenerate}[\s\S]*?disabled={isGenerating}[\s\S]*?>[\s\S]*?<\/button>/g,
  `<div className="flex gap-4 w-full mt-4">
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
      {isGenerating ? "Executing Engine..." : "Initiate Stacking Engine"}
    </button>
    {isGenerating && (
      <button
        onClick={() => cancelRef.current = true}
        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold px-8 py-5 rounded-xl flex items-center justify-center transition-all border border-rose-500/30"
        title="Force Cancel"
      >
        Cancel
      </button>
    )}
  </div>`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Fixed Cancel Button Rendering");
