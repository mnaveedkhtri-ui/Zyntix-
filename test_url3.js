const fs = require("fs");
async function testURL() {
  try {
    const url = "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ keyword: "Test Lawyer", targetUrl: "https://example.com", aiIntro: "Test Intro", aiBullets: "Test Bullets" }),
      headers: { "Content-Type": "application/json" },
      redirect: "follow"
    });
    const text = await res.text();
    fs.writeFileSync("error_page.html", text);
    console.log("Status:", res.status);
    console.log("Saved to error_page.html");
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testURL();
