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

    // It's a text/plain response usually containing JSON from apps script
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      // If the apps script just returned plain text URL
      data = { docUrl: text.trim() };
    }

    if (data.docUrl) {
      return NextResponse.json({ success: true, url: data.docUrl });
    } else {
      return NextResponse.json({ error: "No URL returned from script" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Failed to connect to Google Apps Script" }, { status: 500 });
  }
}
