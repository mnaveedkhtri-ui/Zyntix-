import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "pg";

const getDbClient = () => {
  let connStr = process.env.POSTGRES_PRISMA_URL || "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
  connStr = connStr.replace("?sslmode=require", "").replace("&supa=base-pooler.x", "").replace("&pgbouncer=true", "");
  return new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms } = body;

    // Always fetch the master URL from DB — users never control this
    const db = getDbClient();
    await db.connect();
    const settingRes = await db.query("SELECT value FROM settings WHERE key = 'master_script_url';");
    await db.end();

    if (!settingRes.rows.length) {
      return NextResponse.json({ error: "Master script URL not configured. Please contact admin." }, { status: 500 });
    }

    const scriptUrl = settingRes.rows[0].value;

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, targetUrl, previousUrl, previousUrls, generateDocs, generateSlides, generateForms })
    });

    const text = await response.text();

    if (text.trim().toLowerCase().startsWith("<!doctype") || text.includes("<html")) {
      return NextResponse.json({ error: "Google Script auth error. Please contact admin." }, { status: 403 });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = { url: text.trim() };
    }

    if (data.urls) {
      return NextResponse.json({ success: true, urls: data.urls });
    } else if (data.url || data.docUrl) {
      return NextResponse.json({ success: true, urls: { doc: data.url || data.docUrl } });
    } else {
      return NextResponse.json({ error: data.error || "No valid URL returned from script." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Failed to connect to Google Apps Script" }, { status: 500 });
  }
}
