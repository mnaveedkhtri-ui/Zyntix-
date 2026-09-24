const fs = require("fs");
let content = fs.readFileSync("src/components/NavBar.tsx", "utf8");

content = content.replace(
  '<Link href="/contact" className="hover:text-white transition-colors">Contact</Link>',
  '<Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>\n        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>'
);

fs.writeFileSync("src/components/NavBar.tsx", content, "utf8");
