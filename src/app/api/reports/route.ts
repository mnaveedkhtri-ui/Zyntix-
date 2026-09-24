import { Client } from "pg";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const getClient = () => {
  // Strip ?sslmode=require from the connection string so it doesn't override our ssl setting
  let connStr = process.env.POSTGRES_PRISMA_URL || "postgres://postgres.cxgbgswhqjeglwhoihei:gFbTqFFr3w1izUYT@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
  connStr = connStr.replace("?sslmode=require", "").replace("&supa=base-pooler.x", "").replace("&pgbouncer=true", "");
  
  return new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { keyword, totalLinks, status, urls } = body;

    const client = getClient();
    await client.connect();

    const result = await client.query(
      `INSERT INTO reports (user_id, keyword, total_links, status, urls) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [userId, keyword, totalLinks, status, JSON.stringify(urls)]
    );

    await client.end();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to save report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const client = getClient();
    await client.connect();

    const result = await client.query(
      `SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC;`,
      [userId]
    );

    await client.end();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return new NextResponse("Missing ID", { status: 400 });

    const client = getClient();
    await client.connect();

    // Ensure the user only deletes their own report
    await client.query("DELETE FROM reports WHERE id = $1 AND user_id = $2", [id, userId]);

    await client.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
