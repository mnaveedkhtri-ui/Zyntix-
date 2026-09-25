const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// 1. Add useRef if not there
if (!content.includes('useRef')) {
  content = content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect, useRef } from "react";');
}

// 2. Add cancelRef and fix addLog
content = content.replace(
  `const addLog = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { title, message, type }]);
  };`,
  `const cancelRef = useRef(false);
  const addLog = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { title, message, type, time }]);
  };`
);

// 3. Update the render logic for time
content = content.replace(
  `[{new Date().toLocaleTimeString()}] {log.title}`,
  `[{log.time}] {log.title}`
);

// 4. Update handleGenerate to initialize cancelRef and check it in the loop
content = content.replace(
  `setIsGenerating(true);
    setLogs([]);
    setGeneratedUrls([]);`,
  `setIsGenerating(true);
    setLogs([]);
    setGeneratedUrls([]);
    cancelRef.current = false;`
);

// Replace the loop logic to check cancelRef and increase cooldown to 10s
content = content.replace(
  /for \(let i = 1; i <= count; i\+\+\) {[\s\S]*?addLog\("Campaign Completed", \`Successfully generated \$\{successfulLinks.length\} DA-99\+ assets!\`, "success"\);/,
  `for (let i = 1; i <= count; i++) {
      if (cancelRef.current) {
        addLog("Engine Terminated", "Campaign manually cancelled by the user.", "error");
        break;
      }
      
      addLog(\`Generating Node \${i}/\${count}\`, \`Creating selected entities for "\${keyword}"...\`, "info");
      
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com",
            language: language || "en",
            previousUrls: i > 1 ? allUrlsObject[allUrlsObject.length - 1] : null,
            generateDocs,
            generateSlides,
            generateForms
          }),
        });
        
        const data = await response.json();
        if (data.urls) {
          let createdCount = 0;
          if (data.urls.doc) { successfulLinks.push(data.urls.doc); setGeneratedUrls(p => [...p, data.urls.doc]); createdCount++; }
          if (data.urls.slides) { successfulLinks.push(data.urls.slides); setGeneratedUrls(p => [...p, data.urls.slides]); createdCount++; }
          if (data.urls.form) { successfulLinks.push(data.urls.form); setGeneratedUrls(p => [...p, data.urls.form]); createdCount++; }
          
          allUrlsObject.push(data.urls);
          addLog(\`Node \${i} Successfully Generated\`, \`\${createdCount} Cloud Assets published and interlinked.\`, "success");
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Invalid response from Google Servers");
        }
        
      } catch (error: any) {
        addLog(\`Node \${i} Failed\`, error.message || "Unknown error occurred.", "error");
      }
      
      if (i < count && !cancelRef.current) {
        addLog("API Cooldown & Bypass", "Cooling down for 10 seconds to bypass Google rate limits and ensure 100% success...", "info");
        await new Promise(r => setTimeout(r, 10000));
      }
    }

    if (!cancelRef.current) {
      addLog("Campaign Completed", \`Successfully generated \${successfulLinks.length} DA-99+ assets!\`, "success");
    } else {
      addLog("Campaign Terminated", \`Process halted. Saved \${successfulLinks.length} assets.\`, "info");
    }`
);

// 5. Add Cancel Button next to Initiate Button
content = content.replace(
  `<button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <PlayCircle className="w-6 h-6" />
                  {isGenerating ? "Executing Core Engine..." : "Initiate Stacking Engine"}
                </button>`,
  `<div className="flex gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  >
                    <PlayCircle className="w-6 h-6" />
                    {isGenerating ? "Executing Engine..." : "Initiate Engine"}
                  </button>
                  {isGenerating && (
                    <button
                      onClick={() => cancelRef.current = true}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-black px-8 py-5 rounded-2xl flex items-center justify-center transition-all border border-rose-500/30"
                      title="Force Cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Fixed timestamps, added Cancel button, increased cooldown to 10s.");
