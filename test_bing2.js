const cheerio = require("cheerio");

async function testBing() {
  try {
    const res = await fetch("https://www.bing.com/search?q=Best+Personal+Injury+Lawyer+in+New+York", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $("li.b_algo h2 a").each((i, el) => {
      let url = $(el).attr("href");
      if(url && url.includes("u=a1")) {
         const base64 = url.split("u=a1")[1].split("&")[0];
         try {
            url = Buffer.from(base64, "base64").toString("utf-8");
         } catch(e){}
      }
      if(url && url.startsWith("http")) results.push(url);
    });
    console.log("Bing Clean Results:", results.slice(0, 3));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testBing();
