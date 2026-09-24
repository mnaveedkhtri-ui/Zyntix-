const fs = require("fs");

let loginContent = fs.readFileSync("src/app/auth/login/page.tsx", "utf8");
loginContent = loginContent.replace("const handleLogin = (e) => {", "const handleLogin = (e: any) => {");
fs.writeFileSync("src/app/auth/login/page.tsx", loginContent, "utf8");

let registerContent = fs.readFileSync("src/app/auth/register/page.tsx", "utf8");
registerContent = registerContent.replace("const handleRegister = (e) => {", "const handleRegister = (e: any) => {");
fs.writeFileSync("src/app/auth/register/page.tsx", registerContent, "utf8");
