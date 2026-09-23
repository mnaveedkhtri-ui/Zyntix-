fetch("https://script.google.com/macros/s/AKfycbxY7i0AxC8bsgj2yt8WH6BzIVJ4Gn2eLT7coEj1dtLZd538W66WMYRAqI_A-FfaGRvwEQ/exec", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: JSON.stringify({ targetUrl: "https://zyntix-seo-test.com", keyword: "Best Zyntix Testing Agent" })
})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
