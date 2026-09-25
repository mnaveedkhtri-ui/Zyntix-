const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  `      if (i < count && !cancelRef.current) {
        addLog("API Cooldown & Bypass", "Cooling down for 10 seconds to bypass Google rate limits and ensure 100% success...", "info");
        await new Promise(r => setTimeout(r, 10000));
      }`,
  `      if (i < count && !cancelRef.current) {
        addLog("API Cooldown & Bypass", "Cooling down for 10 seconds to bypass Google rate limits and ensure 100% success...", "info");
        for (let s = 0; s < 10; s++) {
          if (cancelRef.current) break;
          await new Promise(r => setTimeout(r, 1000));
        }
      }`
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Made delay interruptible");
