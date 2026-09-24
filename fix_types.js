const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  'let successfulLinks = [];',
  'let successfulLinks: string[] = [];'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
