async function testSearx() {
  try {
    const res = await fetch("https://searx.be/search?q=best+seo+tools&format=json");
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    console.log("Searx Results:", data.results.slice(0,3).map(r => r.url));
  } catch (err) {
    console.error("Searx Error:", err.message);
  }
}
testSearx();
