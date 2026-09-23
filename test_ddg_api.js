async function testDDGAPI() {
  try {
    const res = await fetch("https://api.duckduckgo.com/?q=Best+Personal+Injury+Lawyer+in+New+York&format=json");
    const data = await res.json();
    console.log("DDG API AbstractURL:", data.AbstractURL);
    console.log("DDG API Related:", data.RelatedTopics.slice(0,3).map(r => r.FirstURL));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testDDGAPI();
