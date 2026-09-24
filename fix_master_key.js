const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  'const savedKey = localStorage.getItem("zyntix_google_key") || "https://script.google.com/macros/s/AKfycbwPq-iE8x7Q3XfT-J1Z1Xv6H7K2A_qWvC7M-8yB_J-D/exec";',
  'const savedKey = localStorage.getItem("apps_script_url") || "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
