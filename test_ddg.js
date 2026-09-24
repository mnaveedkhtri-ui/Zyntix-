const https = require("https");
const keyword = "Best Ai Tools For Business";
https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
}, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    const match = data.match(/<a class="result__snippet[^>]*>(.*?)<\/a>/);
    if (match) console.log("Snippet:", match[1].replace(/<b>|<\/b>/g, ""));
    else console.log("No snippet found.");
  });
}).on("error", (e) => console.log("Error:", e.message));
