import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword, targetUrl, appsScriptUrl, preGeneratedIntro, preGeneratedBullets } = await req.json();

    if (!keyword || !targetUrl || !appsScriptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let aiIntro = preGeneratedIntro || "";
    let aiBullets = preGeneratedBullets || "";
    
    // Only fetch AI if not provided by frontend
    if (!aiIntro || !aiBullets) {
      try {
        const cleanKeyword = keyword.replace(/\s*\(Variation \d+\)/g, '').trim();
        const p1 = `Write a highly professional, 150-word SEO introduction paragraph explaining the services and importance of ${cleanKeyword}. Make it sound like an expert industry report. Do not use quotes or markdown.`;
        const p2 = `Write 5 highly actionable bullet points (key takeaways) regarding ${cleanKeyword}. Keep it professional and short. Do not include numbers, just the text. No markdown.`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8500); 

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
    }

    // High Quality Premium Fallbacks
    const fallbackIntro = `Navigating the complexities of ${keyword} requires a deep understanding of current industry standards, local regulations, and proven methodologies. In today's competitive landscape, establishing authority in this sector is not just about visibility; it is about delivering measurable, high-impact results. This comprehensive guide serves as an authoritative resource, outlining the critical frameworks and strategic insights necessary to excel in ${keyword}. By analyzing market trends and leveraging data-driven approaches, this document provides professionals and consumers alike with the actionable intelligence required to make informed decisions.`;

    const fallbackBullets = `Comprehensive Market Analysis: Utilizing advanced metrics to identify the most effective strategies for ${keyword}.\nRegulatory Compliance & Standards: Ensuring all implementations meet rigorous local and international quality benchmarks.\nScalable Solutions: Designing robust architectures that grow alongside consumer demands and technological advancements.\nROI-Driven Execution: Prioritizing methodologies that yield the highest return on investment through optimized resource allocation.\nContinuous Innovation: Adapting to emerging trends and leveraging cutting-edge technologies to maintain a competitive edge in ${keyword}.`;

    const finalIntro = aiIntro || fallbackIntro;
    const finalBullets = aiBullets || fallbackBullets;

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      body: JSON.stringify({ keyword, targetUrl, aiIntro: finalIntro, aiBullets: finalBullets }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const textData = await response.text();
    try {
      const data = JSON.parse(textData);
      if (data.success && data.url) {
        return NextResponse.json({ success: true, data: [{ url: data.url }] });
      }
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
