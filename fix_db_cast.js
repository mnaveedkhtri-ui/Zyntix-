const fs = require("fs");
let content = fs.readFileSync("src/app/api/reports/route.ts", "utf8");

content = content.replace(
  'await client.query("DELETE FROM reports WHERE id = ANY($1::uuid[]) AND user_id = $2", [idArray, userId]);',
  'await client.query("DELETE FROM reports WHERE id = ANY($1::int[]) AND user_id = $2", [idArray.map(Number), userId]);'
);

fs.writeFileSync("src/app/api/reports/route.ts", content, "utf8");
console.log("Fixed DB delete cast");
