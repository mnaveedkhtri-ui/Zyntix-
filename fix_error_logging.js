const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

const oldLogic = `        const data = await response.json();
        if (data.url) {
          addLog(\`Asset \${i} Successfully Generated\`, "Entity document published and live on Google infrastructure.", "success");
          successfulLinks.push(data.url);
        } else {
          throw new Error("Invalid response from proxy");
        }
        
      } catch (error) {
        addLog(\`Asset \${i} Failed\`, "Google rate limit hit. Retrying in 5 seconds...", "error");
      }`;

const newLogic = `        const data = await response.json();
        if (data.url) {
          addLog(\`Asset \${i} Successfully Generated\`, "Entity document published and live on Google infrastructure.", "success");
          successfulLinks.push(data.url);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Invalid response from Google Servers");
        }
        
      } catch (error: any) {
        addLog(\`Asset \${i} Failed\`, error.message || "Unknown error occurred.", "error");
      }`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
