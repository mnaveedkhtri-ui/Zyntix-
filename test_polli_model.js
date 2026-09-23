const https = require("https");
const prompt = "Write a highly professional, 150-word SEO introduction paragraph explaining the services and importance of Best plumbers in london. Make it sound like an expert industry report. Do not use quotes or markdown.";
https.get(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=mistral`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("Mistral Output:", data.substring(0, 500));
  });
}).on("error", (e) => console.log("Error:", e.message));
