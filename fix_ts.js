const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");
content = content.replace("map(d => d.url)", "map((d: any) => d.url)");
fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
