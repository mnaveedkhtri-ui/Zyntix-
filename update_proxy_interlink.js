const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

content = content.replace(
  'const { keyword, targetUrl, previousUrl, generateDocs, generateSlides, generateForms } = body;',
  'const { keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms } = body;'
);

content = content.replace(
  'body: JSON.stringify({ keyword, targetUrl, previousUrl, generateDocs, generateSlides, generateForms })',
  'body: JSON.stringify({ keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms })'
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
console.log("Updated proxy to forward previousUrls");
