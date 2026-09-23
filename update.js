const fs = require("fs");
let content = fs.readFileSync("src/app/api/google/route.ts", "utf-8");
content = content.replace(
  "return NextResponse.json(data);",
  "if (data.success && data.url) { return NextResponse.json({ success: true, data: [{ url: data.url }] }); } return NextResponse.json(data);"
);
fs.writeFileSync("src/app/api/google/route.ts", content);
