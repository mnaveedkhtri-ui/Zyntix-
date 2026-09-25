const fs = require("fs");
let content = fs.readFileSync("src/app/page.tsx", "utf8");

content = content.replace(
  `Syndicate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Enterprise Cloud Entities</span> <br className="hidden md:block"/>\n          at Scale.`,
  `Syndicate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Cloud Entities</span><br className="hidden md:block"/> at Enterprise Scale.`
);

fs.writeFileSync("src/app/page.tsx", content, "utf8");
console.log("Updated Hero Section text for better layout.");
