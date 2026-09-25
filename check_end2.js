const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8").split("\n");
const idx = lines.findIndex(l => l.includes("await user?.reload()"));
console.log(lines.slice(idx - 5, idx + 10).join("\n"));
