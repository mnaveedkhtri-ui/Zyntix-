const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  'const appsScriptUrl = localStorage.getItem("apps_script_url");\n    if (!appsScriptUrl) {\n      alert("Please configure your Google Apps Script URL in Settings first.");\n      setIsGenerating(false);\n      return;\n    }',
  'const savedUrl = localStorage.getItem("apps_script_url");\n    const appsScriptUrl = (savedUrl && savedUrl.trim() !== "") ? savedUrl : "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
