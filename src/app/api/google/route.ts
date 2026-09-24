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
    const { keyword, targetUrl, appsScriptUrl, aiIntro, aiBullets, previousUrl } = await req.json();

    if (!keyword || !targetUrl || !appsScriptUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanKeyword = toTitleCase(keyword.replace(/\s*\(Variation \d+\)/gi, '').trim());
    const kwLower = cleanKeyword.toLowerCase();

    // Smart Niche Spintax Engine
    let fallbackIntroTemplate = "";
    let fallbackBulletsTemplate = "";

    if (kwLower.includes("ai ") || kwLower.includes("software") || kwLower.includes("platform") || kwLower.includes("app") || kwLower.includes("saas")) {
        // SaaS / Tech Spintax
        fallbackIntroTemplate = `When {evaluating|researching|selecting|implementing} ${cleanKeyword}, {choosing|partnering with|integrating} the right {technology|platform|software solution|digital infrastructure} is {essential|critical|vital} for {scaling your operations|maximizing efficiency|streamlining workflows|driving digital transformation}. Whether you need {advanced automation|seamless integrations|data-driven insights|cloud-based reliability}, selecting the right {tech stack|AI models|software architecture|digital tools} can save you {significant development time|unnecessary overhead|costly technical debt|valuable engineering hours}. Our {comprehensive guide|technical overview|expert breakdown|official resource} to ${cleanKeyword} highlights {enterprise-grade features|industry-leading capabilities|premium solutions}, {scalable pricing|flexible deployment options|transparent SaaS tiers}, and {verifiable user reviews|proven case studies|verified tech feedback}. By {prioritizing|focusing on|highlighting} {cutting-edge algorithms|robust security protocols|modern tech stacks|innovative frameworks}, we {ensure|guarantee|certify} that your {infrastructure|business logic|platform|operations} meets the {highest standards|strictest criteria|peak levels} of {performance and scalability|uptime and security|innovation and reliability}.`;

        fallbackBulletsTemplate = `{Advanced Automation & AI Integration|Seamless Workflow Automation|Next-Gen Algorithmic Capabilities}: {Deploying cutting-edge models|Leveraging machine learning|Integrating smart automation} to {reduce manual tasks|increase computational efficiency|accelerate time-to-market} for all ${cleanKeyword} needs.\n{Enterprise-Grade Security & Compliance|Robust Data Protection|SOC2 & GDPR Compliant Infrastructure}: {Guaranteeing strict adherence|Ensuring 100% compliance} with {global data privacy laws|enterprise security standards|encryption guidelines} to protect sensitive information.\n{Scalable Cloud Architecture|Flexible Deployment Options|High-Availability Systems}: {Offering straightforward API access|Delivering cloud-native flexibility|Providing microservices architecture} with {zero downtime|99.99% uptime guarantees|complete scalability} for maximum {developer peace of mind|system reliability|operational continuity}.\n{Seamless API & Integrations|End-to-End Interoperability|Full-Stack Compatibility}: {Utilizing modern REST and GraphQL endpoints|Leveraging native webhooks and plugins|Deploying headless architecture} for {precision integration|flawless execution|rapid deployment}.\n{Verified Developer Satisfaction & 5-Star Reviews|Proven Track Record of Excellence|Award-Winning Customer Success}: Backed by {hundreds of verified enterprise deployments|a solid reputation in the tech community|years of outstanding GitHub feedback} and a {relentless commitment|dedicated approach} to exceptional software quality in the ${cleanKeyword} sector.`;
    } else if (kwLower.includes("law") || kwLower.includes("attorney") || kwLower.includes("legal") || kwLower.includes("injury")) {
        // Legal Spintax
        fallbackIntroTemplate = `When {searching for|seeking out|researching} ${cleanKeyword}, {finding|partnering with} {highly-rated legal professionals|experienced attorneys|trusted legal counsel} is {essential|critical|crucial} for {protecting your rights|securing a favorable outcome|navigating complex litigation}. Whether you need {aggressive courtroom representation|strategic settlement negotiations|expert legal advice}, selecting the right {law firm|legal team|advocates} can save you {significant financial risk|unnecessary stress and penalties}. Our {comprehensive guide|detailed overview|official resource} to ${cleanKeyword} highlights {top-tier legal services|award-winning attorneys|premium law firms}, {transparent contingency fees|upfront retainer estimates}, and {verifiable client success stories|proven case results|verified courtroom victories}. By {prioritizing|focusing on} {licensed attorneys|certified legal specialists|experienced litigators} and {modern litigation strategies|aggressive legal tactics}, we {ensure|guarantee} that every {case|client|legal matter} meets the {highest standards|strictest criteria} of {legal excellence and client care|justice and reliability}.`;
        
        fallbackBulletsTemplate = `{Aggressive Courtroom Representation|Strategic Legal Defense|Expert Litigation Services}: {Ensuring immediate legal intervention|Providing lightning-fast case evaluations} and {maximum compensation|optimal legal resolutions} for all ${cleanKeyword} needs.\n{Licensed, Insured & Board-Certified Attorneys|Highly Trained & Vetted Legal Experts|Verified Bar Association Members}: {Guaranteeing strict adherence|Ensuring 100% compliance} with {state bar guidelines|federal legal standards|municipal court rules} and ethical guidelines.\n{Transparent Legal Fees & Free Consultations|No Win, No Fee Guarantees|Honest & Competitive Retainers}: {Providing detailed cost breakdowns|Delivering clear financial estimates} with {zero hidden fees|complete transparency} for maximum {trust and reliability|client peace of mind}.\n{Comprehensive Case Building & Evidence Gathering|Full-Service Legal Diagnostics|End-to-End Trial Preparation}: {Utilizing state-of-the-art forensic tools|Leveraging expert witness testimony|Deploying modern legal technology} for {precision and long-lasting verdicts|durability and guaranteed settlements}.\n{Verified Client Satisfaction & 5-Star Reviews|Proven Track Record of Millions Recovered|Award-Winning Legal Care}: Backed by {hundreds of 5-star reviews|a solid reputation in the legal community} and a {relentless commitment|dedicated approach} to exceptional legal quality in the ${cleanKeyword} sector.`;
    } else {
        // Default / Local Service Spintax
        fallbackIntroTemplate = `When {searching for|looking for|seeking out|researching} ${cleanKeyword}, {finding|locating|partnering with} {reliable|trustworthy|highly-rated|verified} professionals is {essential|critical|crucial|vital} for {long-term peace of mind|guaranteed satisfaction|optimal results|a stress-free experience}. Whether you need {emergency assistance|routine maintenance|specialized installations|expert consultations}, selecting the right {experts|specialists|professionals|contractors} can save you {significant time and money|valuable resources|unnecessary stress and costs|both time and unexpected expenses}. Our {comprehensive guide|detailed overview|expert breakdown|official resource} to ${cleanKeyword} highlights {top-tier services|industry-leading solutions|premium providers|elite services}, {transparent pricing|affordable options|upfront cost estimates|competitive rates}, and {verifiable customer reviews|proven track records|outstanding client testimonials|verified local feedback}. By {prioritizing|focusing on|highlighting|recommending} {licensed contractors|certified experts|trained professionals|experienced specialists} and {modern techniques|advanced methodologies|industry best practices|state-of-the-art solutions}, we {ensure|guarantee|certify|make certain} that every {project|job|service call|client interaction} meets the {highest standards|strictest criteria|most rigorous benchmarks|peak levels} of {safety and efficiency|quality and durability|performance and reliability|excellence and customer care}.`;
        
        fallbackBulletsTemplate = `{24/7 Rapid Response & Support|Emergency Assistance & Quick Deployment|Fast Turnaround & Priority Service}: {Ensuring immediate assistance|Providing lightning-fast solutions|Guaranteeing minimal wait times} and {minimal downtime|maximum efficiency|prompt resolutions} for all ${cleanKeyword} needs.\n{Licensed, Insured & Certified Experts|Highly Trained & Vetted Professionals|Verified Industry Specialists}: {Guaranteeing strict adherence|Ensuring 100% compliance|Maintaining total alignment} with {local building codes|industry safety standards|municipal regulations} and quality guidelines.\n{Transparent Pricing & Upfront Quotes|No Hidden Fees & Clear Estimates|Honest & Competitive Pricing}: {Providing detailed cost breakdowns|Delivering clear financial estimates|Offering straightforward pricing models} with {zero hidden fees|complete transparency|no surprise charges} for maximum {trust and reliability|client peace of mind|customer satisfaction}.\n{Comprehensive Maintenance & Advanced Solutions|Full-Service Diagnostics & Repairs|End-to-End Expert Solutions}: {Utilizing state-of-the-art diagnostic tools|Leveraging premium equipment and techniques|Deploying modern technology} for {precision and long-lasting results|durability and guaranteed fixes|flawless execution}.\n{Verified Customer Satisfaction & 5-Star Reviews|Proven Track Record of Excellence|Award-Winning Client Care}: Backed by {hundreds of 5-star reviews|a solid reputation in the community|years of outstanding feedback} and a {relentless commitment|dedicated approach|steadfast dedication} to exceptional service quality in the ${cleanKeyword} sector.`;
    }

    const finalIntro = aiIntro || spintax(fallbackIntroTemplate);
    const finalBullets = aiBullets || spintax(fallbackBulletsTemplate);

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      body: JSON.stringify({ keyword: cleanKeyword, targetUrl, aiIntro: finalIntro, aiBullets: finalBullets, previousUrl }),
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
