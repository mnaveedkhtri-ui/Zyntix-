import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "pg";
import { clerkClient } from "@clerk/nextjs/server";

const ADMIN_EMAIL = "moderntrendz98@gmail.com";

const getDbClient = () => {
  let connStr = process.env.POSTGRES_PRISMA_URL || "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
  connStr = connStr.replace("?sslmode=require", "").replace("&supa=base-pooler.x", "").replace("&pgbouncer=true", "");
  return new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
};

// GET: Fetch current master script URL
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const db = getDbClient();
    await db.connect();
    const res = await db.query("SELECT value FROM settings WHERE key = 'master_script_url';");
    await db.end();

    return NextResponse.json({ url: res.rows[0]?.value || "" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Update master script URL (Admin only)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Verify admin
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;
    if (email !== ADMIN_EMAIL) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { url } = await req.json();
    if (!url || !url.startsWith("https://script.google.com")) {
      return NextResponse.json({ error: "Invalid Apps Script URL" }, { status: 400 });
    }

    const db = getDbClient();
    await db.connect();
    await db.query(
      "INSERT INTO settings (key, value, updated_at) VALUES ('master_script_url', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW();",
      [url]
    );
    await db.end();

    return NextResponse.json({ success: true, message: "Master URL updated for all users!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
