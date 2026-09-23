const https = require("https");
const prompt = "What is 2+2?";
https.get(`https://api.kastg.xyz/api/ai/chatgpt?prompt=${encodeURIComponent(prompt)}`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("Kastg:", data);
  });
}).on("error", (e) => console.log("Error:", e.message));
