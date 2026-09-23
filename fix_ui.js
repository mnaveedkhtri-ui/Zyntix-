const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");
content = content.replace("setProgressMsg(Starting robust generation of  docs...);", "setProgressMsg(`Starting robust generation of ${bulkCount} docs...`);");
fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
