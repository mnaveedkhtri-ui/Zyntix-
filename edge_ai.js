const fs = require("fs");
let content = fs.readFileSync("src/app/api/ai/route.ts", "utf-8");
content = "export const runtime = 'edge';\n" + content;
fs.writeFileSync("src/app/api/ai/route.ts", content);
