const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

const oldFetch = `const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptUrl: savedKey,
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com"
          }),
        });`;

const newFetch = `const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptUrl: savedKey,
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com",
            previousUrl: i > 1 ? successfulLinks[i - 2] : null
          }),
        });`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
