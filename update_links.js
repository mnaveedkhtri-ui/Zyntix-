const fs = require("fs");
let content = fs.readFileSync("src/app/page.tsx", "utf8");

content = content.replace(/\/auth\/login/g, "/sign-in");
content = content.replace(/\/auth\/register/g, "/sign-up");

fs.writeFileSync("src/app/page.tsx", content, "utf8");
