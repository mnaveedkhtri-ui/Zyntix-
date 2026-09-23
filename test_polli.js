const https = require("https");
const prompt = "Write a 10 word sentence.";
https.get(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}?json=true`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("Pollinations Output:", data.substring(0, 500));
  });
}).on("error", (e) => console.log("Error:", e.message));
