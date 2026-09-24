const fs = require("fs");

// Fix layout.tsx
let layoutContent = fs.readFileSync("src/app/layout.tsx", "utf8");
layoutContent = layoutContent.replace(/colorText: '#f8fafc', /, "");
fs.writeFileSync("src/app/layout.tsx", layoutContent, "utf8");

// Fix DashboardSidebar.tsx
let sidebarContent = fs.readFileSync("src/components/DashboardSidebar.tsx", "utf8");
sidebarContent = sidebarContent.replace(/<UserButton afterSignOutUrl="\/" \/>/g, "<UserButton />");
fs.writeFileSync("src/components/DashboardSidebar.tsx", sidebarContent, "utf8");

// Fix NavBar.tsx
let navBarContent = fs.readFileSync("src/components/NavBar.tsx", "utf8");
navBarContent = navBarContent.replace(/<UserButton afterSignOutUrl="\/" \/>/g, "<UserButton />");
fs.writeFileSync("src/components/NavBar.tsx", navBarContent, "utf8");
