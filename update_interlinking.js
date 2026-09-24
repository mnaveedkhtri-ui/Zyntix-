const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// We need to pass the full previous URLs object instead of just the last single link string
// Find where we pass previousUrl and replace it with previousUrls object
content = content.replace(
  'previousUrl: i > 1 ? successfulLinks[successfulLinks.length - 1] : null,',
  'previousUrls: i > 1 ? allUrlsObject[allUrlsObject.length - 1] : null,'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Updated frontend to pass full previousUrls object for perfect interlinking");
