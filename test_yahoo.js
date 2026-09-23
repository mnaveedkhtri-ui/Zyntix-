const cheerio = require("cheerio");

async function testYahoo() {
  try {
    const res = await fetch("https://search.yahoo.com/search?p=Best+Personal+Injury+Lawyer+in+New+York", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $("div.compTitle a").each((i, el) => {
      let url = $(el).attr("href");
      if(url) {
         if (url.includes("RU=")) {
             url = decodeURIComponent(url.split("RU=")[1].split("/RK=")[0]);
         }
         if (url.startsWith("http")) results.push(url);
      }
    });
    console.log("Yahoo Results:", results.slice(0, 3));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testYahoo();
