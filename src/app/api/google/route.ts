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
    const { keyword, targetUrl, appsScriptUrl, aiIntro, aiBullets } = await req.json();

    if (!keyword || !targetUrl || !appsScriptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanKeyword = toTitleCase(keyword.replace(/\s*\(Variation \d+\)/gi, '').trim());

    // Ultra-Niche Local SEO / Service Spintax Template (Sounds like a real agency article)
    const fallbackIntroTemplate = `When {searching for|looking for|seeking out|researching} ${cleanKeyword}, {finding|locating|partnering with} {reliable|trustworthy|highly-rated|verified} professionals is {essential|critical|crucial|vital} for {long-term peace of mind|guaranteed satisfaction|optimal results|a stress-free experience}. Whether you need {emergency assistance|routine maintenance|specialized installations|expert consultations}, selecting the right {experts|specialists|professionals|contractors} can save you {significant time and money|valuable resources|unnecessary stress and costs|both time and unexpected expenses}. Our {comprehensive guide|detailed overview|expert breakdown|official resource} to ${cleanKeyword} highlights {top-tier services|industry-leading solutions|premium providers|elite services}, {transparent pricing|affordable options|upfront cost estimates|competitive rates}, and {verifiable customer reviews|proven track records|outstanding client testimonials|verified local feedback}. By {prioritizing|focusing on|highlighting|recommending} {licensed contractors|certified experts|trained professionals|experienced specialists} and {modern techniques|advanced methodologies|industry best practices|state-of-the-art solutions}, we {ensure|guarantee|certify|make certain} that every {project|job|service call|client interaction} meets the {highest standards|strictest criteria|most rigorous benchmarks|peak levels} of {safety and efficiency|quality and durability|performance and reliability|excellence and customer care}.`;

    const fallbackBulletsTemplate = `{24/7 Rapid Response & Support|Emergency Assistance & Quick Deployment|Fast Turnaround & Priority Service}: {Ensuring immediate assistance|Providing lightning-fast solutions|Guaranteeing minimal wait times} and {minimal downtime|maximum efficiency|prompt resolutions} for all ${cleanKeyword} needs.\n{Licensed, Insured & Certified Experts|Highly Trained & Vetted Professionals|Verified Industry Specialists}: {Guaranteeing strict adherence|Ensuring 100% compliance|Maintaining total alignment} with {local building codes|industry safety standards|municipal regulations} and quality guidelines.\n{Transparent Pricing & Upfront Quotes|No Hidden Fees & Clear Estimates|Honest & Competitive Pricing}: {Providing detailed cost breakdowns|Delivering clear financial estimates|Offering straightforward pricing models} with {zero hidden fees|complete transparency|no surprise charges} for maximum {trust and reliability|client peace of mind|customer satisfaction}.\n{Comprehensive Maintenance & Advanced Solutions|Full-Service Diagnostics & Repairs|End-to-End Expert Solutions}: {Utilizing state-of-the-art diagnostic tools|Leveraging premium equipment and techniques|Deploying modern technology} for {precision and long-lasting results|durability and guaranteed fixes|flawless execution}.\n{Verified Customer Satisfaction & 5-Star Reviews|Proven Track Record of Excellence|Award-Winning Client Care}: Backed by {hundreds of 5-star reviews|a solid reputation in the community|years of outstanding feedback} and a {relentless commitment|dedicated approach|steadfast dedication} to exceptional service quality in the ${cleanKeyword} sector.`;

    const finalIntro = aiIntro || spintax(fallbackIntroTemplate);
    const finalBullets = aiBullets || spintax(fallbackBulletsTemplate);

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
