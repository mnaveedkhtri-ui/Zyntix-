const cheerio = require("cheerio");

async function testDDG() {
  try {
    const res = await fetch("https://html.duckduckgo.com/html/?q=best+ai+tools+for+seo", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $(".result").each((i, el) => {
      if (i > 2) return;
      const title = $(el).find(".result__title").text().trim();
      const url = $(el).find(".result__url").attr("href");
      // DDG urls are often relative redirect links, e.g. //duckduckgo.com/l/?uddg=https://...
      let cleanUrl = url;
      if (url && url.includes("uddg=")) {
        cleanUrl = decodeURIComponent(url.split("uddg=")[1].split("&")[0]);
      } else {
         cleanUrl = $(el).find(".result__url").text().trim();
      }
      if(cleanUrl) results.push({ title, url: cleanUrl });
    });
    console.log("DDG Results:", JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("DDG Error:", err.message);
  }
}
testDDG();
