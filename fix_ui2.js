const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");
content = content.replace(/encodeURIComponent\(Write a highly professional(.*?)\);/, 'encodeURIComponent(`Write a highly professional$1`);');
content = content.replace(/encodeURIComponent\(Write 5 highly actionable(.*?)\);/, 'encodeURIComponent(`Write 5 highly actionable$1`);');
content = content.replace(/fetch\(https:\/\/text\.pollinations\.ai\/prompt\/\)\.catch/g, 'fetch(`https://text.pollinations.ai/prompt/${p1}`).catch');
content = content.replace(/fetch\(`https:\/\/text\.pollinations\.ai\/prompt\/\$\{p1\}`\)\.catch/g, (match, offset, str) => {
    // Only replace the second one with p2
    return str.indexOf(match) === offset ? match : 'fetch(`https://text.pollinations.ai/prompt/${p2}`).catch';
});
fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
