const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

const oldFetch = `const response = await fetch(savedKey, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com"
          }),
        });
        
        await new Promise(r => setTimeout(r, 1500));
        addLog(\`Asset \${i} Successfully Generated\`, "Entity document published and live on Google infrastructure.", "success");
        successfulLinks.push(\`https://docs.google.com/document/d/asset-\${Date.now()}-\${i}/edit\`);`;

const newFetch = `const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scriptUrl: savedKey,
            keyword: keyword + (i > 1 ? \` Part \${i}\` : ""),
            targetUrl: targetUrl || "https://example.com"
          }),
        });
        
        const data = await response.json();
        if (data.url) {
          addLog(\`Asset \${i} Successfully Generated\`, "Entity document published and live on Google infrastructure.", "success");
          successfulLinks.push(data.url);
        } else {
          throw new Error("Invalid response from proxy");
        }`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
