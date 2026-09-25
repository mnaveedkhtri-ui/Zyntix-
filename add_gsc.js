const fs = require("fs");
const file = "src/app/layout.tsx";
let content = fs.readFileSync(file, "utf8");

if (content.includes("verification: {")) {
  console.log("Already has verification");
} else {
  content = content.replace(
    /export const metadata: Metadata = {([\s\S]*?)};/,
    `export const metadata: Metadata = {$1  verification: {
    google: "XKqDOIporTLwhEyizWES5BzLGewgVKX3ymxqUbKwjvE",
  },
};`
  );
  fs.writeFileSync(file, content, "utf8");
  console.log("Added GSC Meta tag");
}
