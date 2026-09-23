import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword, targetUrl, appsScriptUrl } = await req.json();

    if (!keyword || !targetUrl || !appsScriptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let aiIntro = "";
    let aiBullets = "";
    
    try {
      const cleanKeyword = keyword.replace(/\s*\(Variation \d+\)/g, '').trim();
      
      const p1 = `Write a highly professional, 100-word SEO introduction paragraph explaining the services and importance of ${cleanKeyword}. Make it sound like an expert industry report. Do not use quotes or markdown.`;
      const p2 = `Write 3 highly actionable bullet points (key takeaways) regarding ${cleanKeyword}. Keep it professional and short. Do not include numbers, just the text. No markdown.`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); 

      const [res1, res2] = await Promise.all([
        fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(p1)}`, { cache: 'no-store', signal: controller.signal }).catch(() => null),
        fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(p2)}`, { cache: 'no-store', signal: controller.signal }).catch(() => null)
      ]);

      clearTimeout(timeoutId);

      if (res1 && res1.ok) aiIntro = await res1.text();
      if (res2 && res2.ok) aiBullets = await res2.text();

    } catch(err) {
      console.error("AI Generation failed on Vercel", err);
    }

    // Proxy the request to Apps Script (This works perfectly from Node.js)
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      body: JSON.stringify({ keyword, targetUrl, aiIntro, aiBullets }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const textData = await response.text();
    try {
      const data = JSON.parse(textData);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ error: `Apps Script returned HTML instead of JSON: ${textData.substring(0, 100)}` }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
