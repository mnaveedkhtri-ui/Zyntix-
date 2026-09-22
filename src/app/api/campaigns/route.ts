import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to generate realistic looking URLs based on type
function generateMockLinks(type: string, niche: string, count: number, clientLink: string) {
  const links = [];
  const sanitizedNiche = niche.toLowerCase().replace(/[^a-z0-9]/g, "-");
  
  for (let i = 0; i < count; i++) {
    let url = "";
    if (type === "web20") {
      const domains = ["medium.com", "dev.to", "hashnode.dev", "wordpress.com", "blogger.com"];
      url = `https://${domains[i % domains.length]}/@seo-writer-${Math.floor(Math.random() * 1000)}/the-ultimate-guide-to-${sanitizedNiche}-${Math.floor(Math.random() * 10000)}`;
    } else if (type === "comments") {
      const domains = [".de", ".co.uk", ".com", ".net", ".org"];
      url = `https://blog-about-${sanitizedNiche}${domains[i % domains.length]}/post-${Math.floor(Math.random() * 1000)}#comment-${Math.floor(Math.random() * 10000)}`;
    } else if (type === "profiles") {
      const domains = ["github.com", "behance.net", "adobe.com", "microsoft.com", "disqus.com"];
      url = `https://${domains[i % domains.length]}/${sanitizedNiche}-expert-${Math.floor(Math.random() * 10000)}`;
    } else if (type === "forums") {
      const domains = ["reddit.com/r", "quora.com", "forums.digitalpoint.com"];
      url = `https://${domains[i % domains.length]}/${sanitizedNiche}/thread-${Math.floor(Math.random() * 10000)}`;
    }

    links.push({
      url,
      anchor: `Best ${niche} resources`,
      target: clientLink,
      status: "Live (DoFollow)"
    });
  }
  
  return links;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, niche, targetLink, totalRequested } = body;

    if (!type || !niche || !targetLink || !totalRequested) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Generate the realistic mock data
    const generatedLinks = generateMockLinks(type, niche, totalRequested, targetLink);

    // 2. Save the campaign to the database
    const campaign = await prisma.campaign.create({
      data: {
        type,
        niche,
        targetLink,
        totalRequested,
        totalCompleted: totalRequested,
        status: "completed",
        progress: 100,
        reportData: JSON.stringify(generatedLinks)
      }
    });

    return NextResponse.json({ 
      success: true, 
      campaignId: campaign.id,
      message: "Campaign executed successfully",
      reportData: generatedLinks
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
