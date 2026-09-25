const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("fetch(\"/api/generate\""));
console.log(lines.slice(idx, idx + 15).join("\n"));
