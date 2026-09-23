const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");

// Remove the AI pre-fetching logic
content = content.replace(/let baseIntro = '';[\s\S]*?console\.error\('Failed to pre-generate AI blueprint', e\);\s*\}/, 'let baseIntro = ""; let baseBullets = "";');

// Fix the d => d.url error
content = content.replace(/map\(d => d\.url\)/g, 'map((d: any) => d.url)');

fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
