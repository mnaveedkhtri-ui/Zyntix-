const https = require("https");
const prompt = "IMPORTANT: DO NOT USE REASONING. DO NOT THINK OUT LOUD. DIRECTLY OUTPUT THE TEXT. Write a highly professional, 100-word SEO introduction paragraph for Best Clinics In Japan. Make it specific to this exact niche. Do not use quotes or markdown.";
const start = Date.now();
https.get(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log(`Time: ${Date.now() - start}ms`);
    console.log("Output Length:", data.length);
  });
}).on("error", (e) => console.log("Error:", e.message));
