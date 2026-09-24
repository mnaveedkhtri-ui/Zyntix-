const https = require("https");
const prompt = "Write a 10 word sentence about business.";
https.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(prompt)}`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("Hercai:", data.substring(0, 500));
  });
}).on("error", (e) => console.log("Error:", e.message));
