async function testBackend() {
  try {
    const url = "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";
    
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ keyword: "Test", targetUrl: "test.com", aiIntro: "hi", aiBullets: "hi" }),
      headers: { "Content-Type": "text/plain" }
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response text (first 100 chars):", text.substring(0, 100));
    
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testBackend();
