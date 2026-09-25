const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  `            targetUrl: targetUrl || "https://example.com",
            previousUrls: i > 1 ? allUrlsObject[allUrlsObject.length - 1] : null,
            generateDocs,
            generateSlides,
            generateForms
          }),`,
  `            targetUrl: targetUrl || "https://example.com",
            language: language || "en",
            previousUrls: i > 1 ? allUrlsObject[allUrlsObject.length - 1] : null,
            generateDocs,
            generateSlides,
            generateForms
          }),`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Fixed missing language param in fetch body.");
