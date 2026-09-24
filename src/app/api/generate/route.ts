import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { scriptUrl, keyword, targetUrl } = body;

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, targetUrl })
    });

    const text = await response.text();
    
    if (text.trim().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
      return NextResponse.json({ error: "Google Script returned an HTML page (Login required). Please set 'Who has access' to 'Anyone' in Apps Script." }, { status: 403 });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = { docUrl: text.trim() };
    }

    const finalUrl = data.docUrl || data.url;
    if (finalUrl && finalUrl.startsWith("http")) {
      return NextResponse.json({ success: true, url: finalUrl });
    } else {
      return NextResponse.json({ error: "No valid URL returned from script." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Failed to connect to Google Apps Script" }, { status: 500 });
  }
}
