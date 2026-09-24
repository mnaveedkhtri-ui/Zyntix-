const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8").split("\n");
const bodyIdx = lines.findIndex(l => l.includes("reports.map((report) => ("));
console.log(lines.slice(bodyIdx, bodyIdx + 20).join("\n"));
