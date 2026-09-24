const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8").split("\n");
const headIdx = lines.findIndex(l => l.includes("<thead"));
console.log(lines.slice(headIdx, headIdx + 20).join("\n"));
