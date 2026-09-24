const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");

content = content.replace(
  `const generateDocWithRetry = async (appsScriptUrl: string, targetUrl: string, keyword: string, preGeneratedIntro: string, preGeneratedBullets: string, maxRetries = 3) => {`,
  `const generateDocWithRetry = async (appsScriptUrl: string, targetUrl: string, keyword: string, preGeneratedIntro: string, preGeneratedBullets: string, previousUrl: string = "", maxRetries = 3) => {`
);

content = content.replace(
  `body: JSON.stringify({ keyword, targetUrl, appsScriptUrl, aiIntro: preGeneratedIntro, aiBullets: preGeneratedBullets }),`,
  `body: JSON.stringify({ keyword, targetUrl, appsScriptUrl, aiIntro: preGeneratedIntro, aiBullets: preGeneratedBullets, previousUrl }),`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
