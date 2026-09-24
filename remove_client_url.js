const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// Remove scriptUrl from the fetch call - server now fetches it from DB
content = content.replace(
  `body: JSON.stringify({
            scriptUrl: savedKey,
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com",
            previousUrl: i > 1 ? successfulLinks[i - 2] : null
          }),`,
  `body: JSON.stringify({
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com",
            previousUrl: i > 1 ? successfulLinks[i - 2] : null
          }),`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Done - removed scriptUrl from client payload");
