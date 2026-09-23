async function testReddit() {
  try {
    const res = await fetch("https://www.reddit.com/search.json?q=Best+Personal+Injury+Lawyer+in+New+York&limit=10");
    const data = await res.json();
    const results = [];
    data.data.children.forEach(c => {
       results.push("https://www.reddit.com" + c.data.permalink);
    });
    console.log("Reddit Results:", results.slice(0,3));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testReddit();
