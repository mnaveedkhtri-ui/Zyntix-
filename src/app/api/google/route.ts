import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
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

    // Return the AI content to the frontend, let the frontend ping Google Apps Script directly
    return NextResponse.json({ success: true, aiIntro, aiBullets });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate AI content" }, { status: 500 });
  }
}
