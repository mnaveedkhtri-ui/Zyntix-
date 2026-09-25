const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("for (let i = 1; i <= count; i++) {"));
console.log(lines.slice(Math.max(0, idx - 10), idx + 50).join("\n"));
