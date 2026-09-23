async function testGoogleSuggest() {
  try {
    const res = await fetch("http://suggestqueries.google.com/complete/search?client=chrome&q=emergency+roof+repair");
    const data = await res.json();
    console.log("Real Google Search Suggestions:", data[1]);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testGoogleSuggest();
