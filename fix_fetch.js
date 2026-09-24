const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");

content = content.replace(
  `body: JSON.stringify({ targetUrl, keyword, appsScriptUrl, preGeneratedIntro, preGeneratedBullets })`,
  `body: JSON.stringify({ targetUrl, keyword, appsScriptUrl, aiIntro: preGeneratedIntro, aiBullets: preGeneratedBullets, previousUrl })`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
