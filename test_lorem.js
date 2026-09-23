async function testLorem() {
  try {
    const res = await fetch("https://loremflickr.com/800/400/ui,ux,designers");
    console.log("Status:", res.status, "Content-Type:", res.headers.get("content-type"));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testLorem();
