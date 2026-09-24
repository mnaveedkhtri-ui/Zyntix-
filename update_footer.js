const fs = require("fs");
let content = fs.readFileSync("src/components/Footer.tsx", "utf8");

content = content.replace(
  '<Link href="/how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors block">How it Works</Link>',
  '<Link href="/how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors block">How it Works</Link>\n              <Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors block">Pricing</Link>'
);

fs.writeFileSync("src/components/Footer.tsx", content, "utf8");

let pricingContent = fs.readFileSync("src/app/pricing/page.tsx", "utf8");

pricingContent = pricingContent.replace(/1234567890/g, '923323219981');
pricingContent = pricingContent.replace(/admin@zyntix.com/g, 'naveedkhtri7@gmail.com');

fs.writeFileSync("src/app/pricing/page.tsx", pricingContent, "utf8");
