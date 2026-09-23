import { NextResponse } from "next/server";

const spintax = (text: string) => {
  let matches;
  let result = text;
  while ((matches = /\{([^{}]+)\}/g.exec(result)) !== null) {
    const options = matches[1].split('|');
    const randomOption = options[Math.floor(Math.random() * options.length)];
    result = result.substring(0, matches.index) + randomOption + result.substring(matches.index + matches[0].length);
  }
  return result;
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
}

export async function POST(req: Request) {
  try {
    const { keyword, targetUrl, appsScriptUrl } = await req.json();

    if (!keyword || !targetUrl || !appsScriptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Completely remove (Variation X) and format nicely
    const cleanKeyword = toTitleCase(keyword.replace(/\s*\(Variation \d+\)/gi, '').trim());

    // High Quality Premium Fallbacks with Spintax for 100% Uniqueness
    const fallbackIntroTemplate = `{Navigating|Mastering|Understanding|Excelling in} the {complexities|nuances|demands|intricacies} of ${cleanKeyword} requires a {deep|profound|comprehensive|thorough} understanding of {current industry standards|modern best practices|evolving regulatory frameworks|cutting-edge methodologies}. In today's {competitive|dynamic|fast-paced|rapidly evolving} landscape, {establishing authority|building trust|maintaining market leadership|ensuring compliance} in this sector is {not just about visibility; it is about delivering|crucial for delivering|the foundation of|essential for driving} {measurable|tangible|sustainable|high-impact} results. This {comprehensive|authoritative|strategic|in-depth} guide serves as a {vital resource|foundational document|strategic blueprint|premium resource}, outlining the {critical frameworks|essential strategies|proven methodologies|core principles} necessary to {excel|succeed|dominate|outperform competitors} in the ${cleanKeyword} industry. By {analyzing market trends|leveraging data-driven approaches|implementing robust solutions|focusing on long-term value}, this document provides {professionals and consumers|stakeholders and clients|industry leaders|businesses} alike with the {actionable intelligence|strategic insights|verified data|expert knowledge} required to {make informed decisions|drive operational excellence|achieve optimal outcomes|maximize ROI}.`;

    const fallbackBulletsTemplate = `{Comprehensive Market Analysis|Strategic Market Insights|In-Depth Industry Analysis}: {Utilizing advanced metrics to identify the most effective strategies|Leveraging verified data to drive optimal outcomes|Analyzing core trends to maximize project success} for ${cleanKeyword}.\n{Regulatory Compliance & Standards|Quality Assurance & Compliance|Safety & Compliance Protocols}: {Ensuring all implementations meet rigorous local and international quality benchmarks|Adhering strictly to industry regulations and safety standards|Guaranteeing precision and code compliance across all operations}.\n{Scalable Solutions|Future-Proof Architectures|Robust & Scalable Implementation}: {Designing robust architectures that grow alongside consumer demands|Developing solutions built for long-term sustainability|Engineering frameworks that adapt to technological advancements}.\n{ROI-Driven Execution|Cost-Efficient Methodologies|Value-Optimized Delivery}: {Prioritizing methodologies that yield the highest return on investment|Ensuring transparent pricing and maximized long-term value|Focusing on cost reduction without sacrificing premium quality}.\n{Continuous Innovation|Advanced Technological Integration|State-of-the-Art Techniques}: {Adapting to emerging trends to maintain a competitive edge|Deploying modern tools for precision and reliability|Integrating innovative practices for unparalleled performance} in ${cleanKeyword}.`;

    const finalIntro = spintax(fallbackIntroTemplate);
    const finalBullets = spintax(fallbackBulletsTemplate);

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      body: JSON.stringify({ keyword: cleanKeyword, targetUrl, aiIntro: finalIntro, aiBullets: finalBullets }),
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
