const https = require("https");
const url = "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";

async function testFetch() {
    console.log("Fetching...");
    try {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ keyword: "Test Lawyer", targetUrl: "https://example.com", aiIntro: "Test Intro", aiBullets: "Test Bullets" }),
            headers: { "Content-Type": "text/plain" },
            redirect: "follow"
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Text:", text.substring(0, 150));
    } catch(e) {
        console.error("Error:", e);
    }
}
testFetch();
