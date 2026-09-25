const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  `      try {
        // Fetch Master Script URL first
        if (!window.masterScriptUrl) {
          const urlRes = await fetch("/api/google/get-url");
          const urlData = await urlRes.json();
          if (urlData.url) window.masterScriptUrl = urlData.url;
          else throw new Error("Could not fetch Master Script URL");
        }

        const response = await fetch(window.masterScriptUrl, {`,
  `      try {
        const response = await fetch("/api/generate", {`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Reverted frontend to use Next.js API");
