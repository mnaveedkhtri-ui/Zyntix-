const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

content = content.replace(
  `if (text.trim().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
      return NextResponse.json({ error: "Google Script auth error. Please contact admin." }, { status: 403 });
    }`,
  `if (text.trim().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
      let errType = "Google Auth/Rate-Limit Error";
      if (text.includes("504") || text.includes("Gateway Timeout")) errType = "Vercel Timeout (504)";
      else if (text.includes("429") || text.includes("Too Many Requests")) errType = "Google IP Rate Limit (429)";
      return NextResponse.json({ error: \`\${errType}. Details: \` + text.substring(0, 100).replace(/<[^>]*>?/gm, '') }, { status: 403 });
    }`
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
console.log("Updated error reporting");
