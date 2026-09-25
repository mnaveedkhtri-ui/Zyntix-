const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

content = content.replace(
  "const [logs, setLogs] = useState<{title: string, message: string, type: 'info' | 'success' | 'error'}[]>([]);",
  "const [logs, setLogs] = useState<{title: string, message: string, type: 'info' | 'success' | 'error', time?: string}[]>([]);"
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
console.log("Fixed TS error");
