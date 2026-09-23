const fs = require('fs');
const https = require('https');

const url = "https://en.wikipedia.org/wiki/Search_engine_optimization";

console.log("==================================================");
console.log("?? ZYNTIX ADVANCED NODE ENGINE (SEO ANALYZER) ??");
console.log("==================================================");
console.log(`\n[+] Starting Advanced SERP Analysis...`);
console.log(`[*] Analyzing competitor: ${url}\n`);

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        // Simple HTML stripping
        const textOnly = data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                             .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                             .replace(/<[^>]+>/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();
        
        const wordCount = textOnly.split(' ').length;
        
        // Extract H2 headings
        const headings = [];
        const regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
        let match;
        while ((match = regex.exec(data)) !== null && headings.length < 5) {
            let hText = match[1].replace(/<[^>]+>/g, '').trim();
            if(hText) headings.push(hText);
        }

        console.log("==================================================");
        console.log("?? SEO COMPETITOR REPORT ??");
        console.log("==================================================");
        console.log(`Target URL   : ${url}`);
        console.log(`Word Count   : ~${wordCount} words`);
        console.log(`Key Headings :`);
        headings.forEach(h => console.log(`  - ${h}`));
        
        console.log("\n[+] To outrank this page, your Zyntix API article should:");
        console.log(`  1. Be at least ${wordCount + 300} words long.`);
        console.log(`  2. Include variations of these headings.`);
        
        fs.writeFileSync('seo_report.csv', `URL,WordCount,Headings\n${url},${wordCount},"${headings.join(' | ')}"`);
        console.log("\n[+] Saved detailed report to seo_report.csv");
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
