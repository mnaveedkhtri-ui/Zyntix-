const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

content = content.replace(
  'if (data.docUrl && data.docUrl.startsWith("http")) {\n      return NextResponse.json({ success: true, url: data.docUrl });',
  'const finalUrl = data.docUrl || data.url;\n    if (finalUrl && finalUrl.startsWith("http")) {\n      return NextResponse.json({ success: true, url: finalUrl });'
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
