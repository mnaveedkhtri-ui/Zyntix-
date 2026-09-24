export const runtime = 'edge';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    const p1 = encodeURIComponent(`IMPORTANT: DO NOT USE REASONING. DO NOT THINK OUT LOUD. DIRECTLY OUTPUT THE TEXT. Write a highly professional, 100-word SEO introduction paragraph for ${keyword}. Make it specific to this exact niche. Do not use quotes or markdown.`);
    const p2 = encodeURIComponent(`IMPORTANT: DO NOT USE REASONING. DO NOT THINK OUT LOUD. DIRECTLY OUTPUT THE TEXT. Write 4 highly actionable bullet points regarding ${keyword}. Keep it specific to the niche. Do not include numbers, just the text. No markdown.`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 sec timeout

    const [res1, res2] = await Promise.all([
      fetch(`https://text.pollinations.ai/prompt/${p1}`, { signal: controller.signal }).catch(() => null),
      fetch(`https://text.pollinations.ai/prompt/${p2}`, { signal: controller.signal }).catch(() => null)
    ]);
    
    clearTimeout(timeoutId);

    let aiIntro = "";
    let aiBullets = "";
    
    if (res1 && res1.ok) aiIntro = await res1.text();
    if (res2 && res2.ok) aiBullets = await res2.text();

    return NextResponse.json({ aiIntro, aiBullets });

  } catch (error: any) {
    return NextResponse.json({ aiIntro: "", aiBullets: "" }, { status: 200 }); // Graceful fallback
  }
}
