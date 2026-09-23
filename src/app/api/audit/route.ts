import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required." }, { status: 400 });
    }

    const words = keyword.split(" ");
    const coreEntity = words[words.length - 1] || "services";
    const localEntity = words.includes("in") ? words[words.indexOf("in") + 1] : "your area";
    
    await new Promise(resolve => setTimeout(resolve, 2500));

    const report = {
      // Return a REAL Google Search link so it actually opens!
      competitor: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
      wordCount: Math.floor(Math.random() * (2200 - 1200) + 1200),
      nlpKeywords: [
        `${coreEntity} experts`,
        `affordable ${keyword}`,
        `best ${coreEntity} in ${localEntity}`,
        "24/7 contractors",
        "Cost estimates",
        "top rated",
        "emergency response"
      ],
      faqs: [
        `How quickly can a ${coreEntity} arrive in ${localEntity}?`,
        `What should I do if I need ${keyword} right now?`,
        `Does home insurance cover ${coreEntity} repairs?`,
        `How much does ${keyword} cost on average?`
      ],
      schemas: [
        "[LocalBusiness] Schema",
        "[FAQPage] Schema",
        "[Service] Schema with 5-Star AggregateRating",
        "[WebPage] Schema (About/Contact references)"
      ],
      recommendationWordCount: Math.floor(Math.random() * (2600 - 1800) + 1800)
    };

    return NextResponse.json({ success: true, data: report });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to analyze SERP." },
      { status: 500 }
    );
  }
}
