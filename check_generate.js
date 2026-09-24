const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("const handleGenerate ="));
console.log(lines.slice(idx, idx + 40).join("\n"));
