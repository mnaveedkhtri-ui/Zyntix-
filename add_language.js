const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// Add language state
if (!content.includes("const [language, setLanguage]")) {
  content = content.replace(
    'const [count, setCount] = useState(1);',
    'const [count, setCount] = useState(1);\n  const [language, setLanguage] = useState("en");'
  );
}

// Add Language dropdown UI
const languageHtml = `
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Content Language</label>
                    <div className="relative">
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-4 text-white appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                      >
                        <option value="en">English (Default)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="fr">French (Français)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="it">Italian (Italiano)</option>
                        <option value="nl">Dutch (Nederlands)</option>
                        <option value="pt">Portuguese (Português)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
`;

content = content.replace(
  '<div>\n                    <label className="block text-sm font-bold text-slate-400 mb-2">Bulk Quantity (1 Link = 1 Credit)</label>',
  languageHtml + '\n                  <div>\n                    <label className="block text-sm font-bold text-slate-400 mb-2">Bulk Quantity (1 Link = 1 Credit)</label>'
);

// Add language to fetch body
content = content.replace(
  'body: JSON.stringify({ keyword, targetUrl, previousUrl: currentPrev.doc, previousUrls: currentPrev, generateDocs, generateSlides, generateForms })',
  'body: JSON.stringify({ keyword, targetUrl, language, previousUrl: currentPrev.doc, previousUrls: currentPrev, generateDocs, generateSlides, generateForms })'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");

// Update API route
let apiContent = fs.readFileSync("src/app/api/generate/route.ts", "utf8");
apiContent = apiContent.replace(
  'const { keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms } = body;',
  'const { keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms, language } = body;'
);
apiContent = apiContent.replace(
  'body: JSON.stringify({ keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms })',
  'body: JSON.stringify({ keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms, language: language || "en" })'
);
fs.writeFileSync("src/app/api/generate/route.ts", apiContent, "utf8");

console.log("Added Language dropdown to UI and API");
