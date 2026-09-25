const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

content = content.replace(
  `return NextResponse.json({ error: "Google Script auth error. Please contact admin." }, { status: 403 });`,
  `return NextResponse.json({ error: "Google Blocked Request: " + text.substring(0, 150).replace(/<[^>]*>?/gm, '') }, { status: 403 });`
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
console.log("Updated route.ts to reveal the actual Google error");
