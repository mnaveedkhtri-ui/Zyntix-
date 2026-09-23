const https = require("https");
https.get("https://text.pollinations.ai/models", (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    const models = JSON.parse(data);
    models.forEach(m => console.log(m.name, m.reasoning));
  });
});
