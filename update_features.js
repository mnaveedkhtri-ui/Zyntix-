const fs = require("fs");
let content = fs.readFileSync("src/app/features/page.tsx", "utf8");

content = content.replace("The <span className=\"text-emerald-400\">Google Stacking</span> Arsenal", "The <span className=\"text-emerald-400\">Semantic AEO</span> Arsenal");
content = content.replace("Google Entity Networks", "High-Velocity Entity Syndication");
content = content.replace("Google loves Google. We use official Google Service Accounts (GCP) to generate hundreds of interlinked Google Docs, Sheets, and Slides. These properties boast a DA of 99 and are practically immune to algorithm penalties.", "Search engines prioritize established authority networks. We leverage enterprise-grade cloud architecture to autonomously syndicate 100% natural, human-readable assets (Docs, Slides, Forms). These decentralized DA-100 entities act as irrefutable trust signals for Generative Search (AEO).");
content = content.replace("Bulk Document Generation Engine", "Intelligent Content Generation Engine");
content = content.replace("Auto-Public Permissions (Indexable)", "Semantic Daisy-Chain Interlinking");
content = content.replace("Zero Rate-Limit Architecture", "Answer Engine Optimization (AEO) Ready");

fs.writeFileSync("src/app/features/page.tsx", content, "utf8");
console.log("Updated features");
