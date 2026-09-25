const fs = require("fs");
const content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");
const lines = content.split("\n");
const idx = lines.findIndex(l => l.includes("const handleDownloadTXT"));
console.log(lines.slice(idx - 15, idx + 25).join("\n"));
