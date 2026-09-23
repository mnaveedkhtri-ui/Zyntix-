import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, keyword, articleCount, devtoKey, hashnodeKey, notionKey } = body;

    if (!devtoKey) {
      return NextResponse.json({ error: "Missing API Keys. Please configure them in Settings." }, { status: 400 });
    }

    const links = [];

    // 1. Post to Dev.to
    if (devtoKey) {
      const articleBody = {
        article: {
          title: `The Ultimate Guide to ${keyword}`,
          published: true,
          body_markdown: `Welcome to our comprehensive guide on ${keyword}. If you are looking for the best resources, make sure to visit our recommended site here: [${keyword}](${targetUrl}).\n\nThis is an automated SEO article syndicated via Zyntix.`,
          tags: ["seo", "marketing", "tech"]
        }
      };

      const devtoRes = await fetch("https://dev.to/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": devtoKey
        },
        body: JSON.stringify(articleBody)
      });

      if (devtoRes.ok) {
        const data = await devtoRes.json();
        links.push({
          id: data.id || Math.random().toString(),
          url: data.url,
          platform: "Dev.to (Web 2.0)",
          status: "Live",
          da: "90"
        });
      } else {
        const errorText = await devtoRes.text();
        console.error("Dev.to Error:", errorText);
      }
    }

    // Return the successfully created links
    return NextResponse.json({
      success: true,
      message: "Campaign generated successfully via API",
      data: links
    });

  } catch (error) {
    console.error("Campaign API Error:", error);
    return NextResponse.json(
      { error: "Failed to process campaign." },
      { status: 500 }
    );
  }
}
