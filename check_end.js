const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("addLog(\"Campaign Terminated\""));
console.log(lines.slice(idx - 10, idx + 20).join("\n"));
