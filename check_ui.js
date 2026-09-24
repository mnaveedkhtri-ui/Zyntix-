const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("Primary Keyword / Entity"));
console.log(lines.slice(Math.max(0, idx - 2), idx + 20).join("\n"));
