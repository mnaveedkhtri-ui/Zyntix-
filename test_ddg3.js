const cheerio = require("cheerio");

async function testDDGLite() {
  try {
    const res = await fetch("https://lite.duckduckgo.com/lite/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: "q=best+ai+tools+for+seo"
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $(".result-snippet").each((i, el) => {
      if (i > 2) return;
      const url = $(el).parent().find(".result-url").text().trim();
      if(url) results.push(url);
    });
    console.log("DDG Lite Results:", results);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testDDGLite();
