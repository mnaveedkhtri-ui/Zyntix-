const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// Replace localStorage saving with API call
content = content.replace(
  `const report = {\n        id: Date.now().toString(),\n        keyword: keyword,\n        totalLinks: count,\n        status: "Completed",\n        urls: generatedUrls,\n        date: new Date().toLocaleDateString(),\n      };\n\n      const existingReports = JSON.parse(localStorage.getItem("zyntix_reports") || "[]");\n      localStorage.setItem("zyntix_reports", JSON.stringify([report, ...existingReports]));`,
  `// Save to Cloud Database\n      try {\n        await fetch("/api/reports", {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify({\n            keyword: keyword,\n            totalLinks: count,\n            status: "Completed",\n            urls: generatedUrls\n          })\n        });\n      } catch (err) {\n        console.error("Failed to save to cloud", err);\n      }`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
