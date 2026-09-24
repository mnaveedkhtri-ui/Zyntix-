async function test() {
  const url = "https://script.google.com/macros/s/AKfycbxAbCVzFukUcqrtJwWdjuFeq8qgaY7dQ5ELJUm_xoPS2fnQWTeWMfjPiHoVKia4C0rbQQ/exec";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: "Test Plumber", targetUrl: "https://example.com" }),
      redirect: "follow"
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text.substring(0, 200));
  } catch (e) {
    console.error(e);
  }
}
test();
