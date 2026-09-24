const fs = require("fs");
let content = fs.readFileSync("src/app/api/generate/route.ts", "utf8");

const oldLogic = `// It's a text/plain response usually containing JSON from apps script
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      // If the apps script just returned plain text URL
      data = { docUrl: text.trim() };
    }

    if (data.docUrl) {
      return NextResponse.json({ success: true, url: data.docUrl });
    }`;

const newLogic = `const text = await response.text();
    
    if (text.trim().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
      return NextResponse.json({ error: "Google Script returned an HTML page (Login required). Please set 'Who has access' to 'Anyone' in Apps Script." }, { status: 403 });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = { docUrl: text.trim() };
    }

    if (data.docUrl && data.docUrl.startsWith("http")) {
      return NextResponse.json({ success: true, url: data.docUrl });
    } else {
      return NextResponse.json({ error: "No valid URL returned from script." }, { status: 500 });
    }`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync("src/app/api/generate/route.ts", content, "utf8");
