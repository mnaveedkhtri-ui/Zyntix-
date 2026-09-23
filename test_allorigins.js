const cheerio = require("cheerio");

async function testAllOrigins() {
  try {
    const targetUrl = encodeURIComponent("https://www.google.com/search?q=Best+Personal+Injury+Lawyer+in+New+York");
    const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
    const data = await res.json();
    const html = data.contents;
    const $ = cheerio.load(html);
    const results = [];
    $("a").each((i, el) => {
      let href = $(el).attr("href");
      if(href && href.startsWith("/url?q=http")) {
         let realUrl = href.split("/url?q=")[1].split("&")[0];
         if(!realUrl.includes("google.com")) {
            results.push(decodeURIComponent(realUrl));
         }
      }
    });
    // Remove duplicates
    const unique = [...new Set(results)].slice(0, 3);
    console.log("Google via Proxy:", unique);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testAllOrigins();
