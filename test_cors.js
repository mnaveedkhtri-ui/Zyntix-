const https = require("https");
https.get("https://text.pollinations.ai/prompt/test", (res) => {
  console.log("CORS Headers:", res.headers["access-control-allow-origin"]);
});
