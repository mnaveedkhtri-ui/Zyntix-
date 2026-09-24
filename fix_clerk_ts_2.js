const fs = require("fs");

let layoutContent = fs.readFileSync("src/app/layout.tsx", "utf8");
layoutContent = layoutContent.replace(/<ClerkProvider[^>]*>/g, "<ClerkProvider>");
fs.writeFileSync("src/app/layout.tsx", layoutContent, "utf8");

