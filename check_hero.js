const fs = require("fs");
const lines = fs.readFileSync("src/app/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("Syndicate"));
console.log(lines.slice(Math.max(0, idx - 10), idx + 20).join("\n"));
