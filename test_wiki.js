async function testWiki() {
  try {
    const res = await fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search=Best+Personal+Injury+Lawyer+in+New+York&limit=3&namespace=0&format=json");
    const data = await res.json();
    console.log("Wiki Results:", data[3]);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testWiki();
