const fs = require("fs");
const file = "src/app/page.tsx";
let content = fs.readFileSync(file, "utf8");

const schema = `
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Zyntix",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "19.00",
              "priceCurrency": "USD"
            },
            "description": "Zyntix is a premium Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) platform for local businesses."
          })
        }}
      />
`;

if (!content.includes("application/ld+json")) {
  content = content.replace(
    /return \([\s\S]*?<main[^>]*>/,
    match => match + schema
  );
  fs.writeFileSync(file, content, "utf8");
  console.log("Added Schema Markup");
}
