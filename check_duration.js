const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");
console.log(content.includes("maxDuration"));
