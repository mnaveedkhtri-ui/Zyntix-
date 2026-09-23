const cheerio = require("cheerio");

async function testDDG() {
  try {
    const res = await fetch("https://html.duckduckgo.com/html/?q=best+ai+tools+for+seo", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $(".result").each((i, el) => {
      if (i > 2) return;
      const title = $(el).find(".result__title").text().trim();
      const url = $(el).find(".result__url").text().trim();
      results.push({ title, url });
    });
    console.log("DDG Results:", JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("DDG Error:", err.message);
  }
}
testDDG();
