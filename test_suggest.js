const https = require("https");
const keyword = "best plumbers in london";
https.get(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`, (res) => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log(data);
  });
});
