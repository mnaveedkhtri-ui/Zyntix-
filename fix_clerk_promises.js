const fs = require("fs");

// Fix /api/admin/topup/route.ts
let topupContent = fs.readFileSync("src/app/api/admin/topup/route.ts", "utf8");
topupContent = topupContent.replace(/clerkClient\(\)\.users/g, "(await clerkClient()).users");
fs.writeFileSync("src/app/api/admin/topup/route.ts", topupContent, "utf8");

// Fix /api/credits/deduct/route.ts
let deductContent = fs.readFileSync("src/app/api/credits/deduct/route.ts", "utf8");
deductContent = deductContent.replace(/clerkClient\(\)\.users/g, "(await clerkClient()).users");
fs.writeFileSync("src/app/api/credits/deduct/route.ts", deductContent, "utf8");
