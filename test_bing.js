const cheerio = require("cheerio");

async function testBing() {
  try {
    const res = await fetch("https://www.bing.com/search?q=best+ai+tools+for+seo", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $("li.b_algo h2 a").each((i, el) => {
      if (i > 2) return;
      results.push($(el).attr("href"));
    });
    console.log("Bing Results:", results);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testBing();
