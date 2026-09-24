const fs = require("fs");
let content = fs.readFileSync("src/app/api/google/route.ts", "utf-8");

content = content.replace(
  `const { keyword, targetUrl, appsScriptUrl, aiIntro, aiBullets } = await req.json();`,
  `const { keyword, targetUrl, appsScriptUrl, aiIntro, aiBullets, previousUrl } = await req.json();`
);

content = content.replace(
  `body: JSON.stringify({ keyword: cleanKeyword, targetUrl, aiIntro: finalIntro, aiBullets: finalBullets }),`,
  `body: JSON.stringify({ keyword: cleanKeyword, targetUrl, aiIntro: finalIntro, aiBullets: finalBullets, previousUrl }),`
);

fs.writeFileSync("src/app/api/google/route.ts", content);
