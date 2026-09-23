async function testPollinationsText() {
  try {
    const res = await fetch("https://text.pollinations.ai/prompt/write%20a%20short%20SEO%20paragraph%20about%20UI%20UX%20designers");
    const data = await res.text();
    console.log("Text:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testPollinationsText();
