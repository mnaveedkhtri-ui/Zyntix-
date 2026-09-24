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
    const { keyword, targetUrl, previousUrl } = body;

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
      body: JSON.stringify({ keyword, targetUrl, previousUrl })
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

    const finalUrl = data.docUrl || data.url;
    if (finalUrl && finalUrl.startsWith("http")) {
      return NextResponse.json({ success: true, url: finalUrl });
    } else {
      return NextResponse.json({ error: data.error || "No valid URL returned from script." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Failed to connect to Google Apps Script" }, { status: 500 });
  }
}
