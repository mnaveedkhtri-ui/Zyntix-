const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");

// I need to find generateDocWithRetry call and pass previousUrl.
// Wait, `generateDocWithRetry` is defined at the top of the file.
// Let's modify its signature.
content = content.replace(
  `const generateDocWithRetry = async (url: string, targetUrl: string, keyword: string, aiIntro: string, aiBullets: string, retries = 3): Promise<any> => {`,
  `const generateDocWithRetry = async (url: string, targetUrl: string, keyword: string, aiIntro: string, aiBullets: string, previousUrl: string = "", retries = 3): Promise<any> => {`
);

content = content.replace(
  `body: JSON.stringify({ keyword, targetUrl, appsScriptUrl: url, aiIntro, aiBullets }),`,
  `body: JSON.stringify({ keyword, targetUrl, appsScriptUrl: url, aiIntro, aiBullets, previousUrl }),`
);

// Now in handlePublish loop:
content = content.replace(
  `const result = await generateDocWithRetry(appsScriptUrl, targetUrl, \`\${keyword} (Variation \${i})\`, globalAiIntro, globalAiBullets, 3);`,
  `const previousUrl = generatedUrls.length > 0 ? generatedUrls[generatedUrls.length - 1] : "";
      const result = await generateDocWithRetry(appsScriptUrl, targetUrl, \`\${keyword} (Variation \${i})\`, globalAiIntro, globalAiBullets, previousUrl, 3);`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
