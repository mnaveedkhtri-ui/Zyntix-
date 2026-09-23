async function testGoogleFAQ() {
  try {
    const res = await fetch("http://suggestqueries.google.com/complete/search?client=chrome&q=how+to+emergency+roof+repair");
    const data = await res.json();
    console.log("Real Google FAQs:", data[1]);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testGoogleFAQ();
