const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");
// Let's just forcefully insert it at the top if it's not there.
if (!content.includes("Trash2")) {
  content = content.replace(/import {([^}]+)} from "lucide-react";/, (match, p1) => {
     return `import {${p1}, Trash2} from "lucide-react";`;
  });
  fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
  console.log("Fixed import");
} else {
  // It might be in the JSX but not in the import.
  const importMatch = content.match(/import {([^}]+)} from "lucide-react";/);
  if (importMatch && !importMatch[1].includes("Trash2")) {
    content = content.replace(/import {([^}]+)} from "lucide-react";/, (match, p1) => {
       return `import {${p1}, Trash2} from "lucide-react";`;
    });
    fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
    console.log("Fixed import (was missing in statement)");
  } else {
    console.log("Trash2 already imported?");
  }
}
