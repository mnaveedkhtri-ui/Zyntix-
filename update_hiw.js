const fs = require("fs");
let content = fs.readFileSync("src/app/how-it-works/page.tsx", "utf8");

content = content.replace("How <span className=\"text-emerald-400\">Google Stacking</span> Works", "How <span className=\"text-emerald-400\">Semantic Syndication</span> Works");
content = content.replace("Generate a free JSON Service Account key from Google Cloud Console and paste it into Zyntix Settings.", "Authenticate the Zyntix Cloud Engine with your secure Service Account to establish a decentralized node architecture.");
content = content.replace("Configure Bulk Campaign", "Define Semantic Architecture");
content = content.replace("Enter your client's target URL, main keyword, and the desired quantity of documents (up to 500 at once).", "Input your core entity (target URL) and primary semantic query. Our AEO engine analyzes keyword intent to structure the knowledge graph.");
content = content.replace("Deploy & Extract URLs", "Deploy Decentralized Entities");
content = content.replace("Zyntix engine automatically loops through the API, generating live public documents and saving the Live URLs directly to your dashboard.", "The Zyntix algorithm autonomously deploys live cloud entities (Docs, Slides, Forms), instantly daisy-chaining them to build a highly authoritative trust network targeting your domain.");

fs.writeFileSync("src/app/how-it-works/page.tsx", content, "utf8");
console.log("Updated how-it-works");
