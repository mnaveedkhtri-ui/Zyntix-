const fs = require("fs");
const lines = fs.readFileSync("src/app/api/audit/route.ts", "utf-8").split("\n");
lines.slice(40, 56).forEach((l, i) => console.log(`${i+41}: ${l}`));
