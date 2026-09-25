const fs = require("fs");
const content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");
const lines = content.split("\n");
const idx = lines.findIndex(l => l.includes("const handleCopyLinks"));
console.log(lines.slice(idx, idx + 15).join("\n"));
