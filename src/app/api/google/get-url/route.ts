import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "pg";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    let connStr = process.env.POSTGRES_PRISMA_URL || "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
    connStr = connStr.replace("?sslmode=require", "").replace("&supa=base-pooler.x", "").replace("&pgbouncer=true", "");
    const db = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
    await db.connect();
    const settingRes = await db.query("SELECT value FROM settings WHERE key = 'master_script_url';");
    await db.end();

    if (!settingRes.rows.length) {
      return NextResponse.json({ error: "Master script URL not configured." }, { status: 500 });
    }

    return NextResponse.json({ url: settingRes.rows[0].value });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to get URL" }, { status: 500 });
  }
}
