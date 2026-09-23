async function testCDX() {
  try {
    const res = await fetch("https://web.archive.org/cdx/search/cdx?url=*newyorklawyer*&output=json&limit=3");
    const data = await res.json();
    console.log("CDX Results:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
testCDX();
