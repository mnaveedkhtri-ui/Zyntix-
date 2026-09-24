const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

const replacement = `      } catch (error: any) {
        addLog(\`Node \${i} Failed\`, error.message || "Unknown error occurred.", "error");
      }
      
      if (i < count) {
        addLog("API Cooldown & Bypass", "Cooling down for 4 seconds to evade Google rate limits and ensure 100% success...", "info");
        await new Promise(r => setTimeout(r, 4000));
      }
    }`;

content = content.replace(
  /} catch \(error: any\) {[\s\S]*?addLog\(\`Node \${i} Failed\`.*?error"\);[\s\S]*?}[\s\S]*?}/,
  replacement
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Added cooldown delay");
