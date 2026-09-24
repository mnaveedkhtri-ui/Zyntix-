const fs = require("fs");
const lines = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8").split("\n");
console.log(lines.slice(Math.max(lines.length - 30, 0)).map((l, i) => `${lines.length - 30 + i + 1}: ${l}`).join("\n"));
