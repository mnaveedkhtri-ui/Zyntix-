import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, keyword, appsScriptUrl } = body;

    if (!appsScriptUrl) {
      return NextResponse.json({ error: "Missing Apps Script URL." }, { status: 400 });
    }

    // Call the user's Google Apps Script Web App
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // Apps script accepts text/plain best for cross-origin
      body: JSON.stringify({ targetUrl, keyword })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Apps Script failed to generate document.");
    }

    const links = [{
      id: Date.now().toString(),
      url: data.url,
      platform: "Google Docs (DA 99)",
      status: "Live",
      da: "99"
    }];

    return NextResponse.json({
      success: true,
      message: "Google Entity Stack generated successfully",
      data: links
    });

  } catch (error: any) {
    console.error("Apps Script Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to process Google Stacking." },
      { status: 500 }
    );
  }
}
