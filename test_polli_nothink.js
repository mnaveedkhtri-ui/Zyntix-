const https = require("https");
const prompt = "IMPORTANT: DO NOT USE REASONING. DO NOT THINK. DIRECTLY OUTPUT THE TEXT. Write a 100-word SEO intro for Best plumbers in london.";
https.get(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("Output Length:", data.length);
    console.log(data.substring(0, 500));
  });
}).on("error", (e) => console.log("Error:", e.message));
