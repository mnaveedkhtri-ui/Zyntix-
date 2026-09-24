const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

content = content.replace(
  'const { scriptUrl, keyword, targetUrl } = body;',
  'const { scriptUrl, keyword, targetUrl, previousUrl } = body;'
);

content = content.replace(
  'body: JSON.stringify({ keyword, targetUrl })',
  'body: JSON.stringify({ keyword, targetUrl, previousUrl })'
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
