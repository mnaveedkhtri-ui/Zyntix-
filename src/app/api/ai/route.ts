import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    // Scrape DuckDuckGo for real SERP snippets (Better than AI for SEO!)
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
        throw new Error("DDG failed");
    }

    const html = await response.text();
    
    // Extract snippets using regex
    const snippets: string[] = [];
    const regex = /<a class="result__snippet[^>]*>(.*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null && snippets.length < 10) {
        let cleanText = match[1].replace(/<b>|<\/b>|<strong>|<\/strong>|<em>|<\/em>|<br>/gi, '');
        cleanText = cleanText.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&hellip;/g, '...');
        if (cleanText.length > 30) {
            snippets.push(cleanText.trim());
        }
    }

    if (snippets.length < 3) {
        throw new Error("Not enough snippets");
    }

    // Combine top 2 snippets for the Intro
    const aiIntro = `When exploring ${keyword}, industry leaders consistently emphasize the importance of making informed decisions. ${snippets[0]} In today's competitive landscape, leveraging the right strategies is crucial for long-term success. ${snippets[1]} Our comprehensive analysis provides a definitive breakdown of the best available options.`;

    // Use remaining snippets for Bullets
    let aiBullets = "";
    for (let i = 2; i < Math.min(6, snippets.length); i++) {
        aiBullets += `Comprehensive Industry Analysis: ${snippets[i]}\n`;
    }

    return NextResponse.json({ aiIntro, aiBullets });

  } catch (error: any) {
    return NextResponse.json({ aiIntro: "", aiBullets: "" }, { status: 200 }); // Graceful fallback
  }
}
