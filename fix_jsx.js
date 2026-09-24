const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

content = content.replace(`          )}
          
          </div>

          <div className="bg-[#050B14]`, `          )}

          <div className="bg-[#050B14]`);

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Fixed JSX tree");
