const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

// We need to update the proxy to accept and forward asset types, and handle the new urls object
content = content.replace(
  'const { keyword, targetUrl, previousUrl } = body;',
  'const { keyword, targetUrl, previousUrl, generateDocs, generateSlides, generateForms } = body;'
);

content = content.replace(
  'body: JSON.stringify({ keyword, targetUrl, previousUrl })',
  'body: JSON.stringify({ keyword, targetUrl, previousUrl, generateDocs, generateSlides, generateForms })'
);

content = content.replace(
  'const finalUrl = data.docUrl || data.url;\n    if (finalUrl && finalUrl.startsWith("http")) {\n      return NextResponse.json({ success: true, url: finalUrl });\n    } else {',
  'if (data.urls) {\n      return NextResponse.json({ success: true, urls: data.urls });\n    } else if (data.url || data.docUrl) {\n      return NextResponse.json({ success: true, urls: { doc: data.url || data.docUrl } });\n    } else {'
);

fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
console.log("Updated API route");
