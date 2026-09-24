import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { keyword, totalLinks, status, urls } = body;

    const result = await sql`
      INSERT INTO reports (user_id, keyword, total_links, status, urls)
      VALUES (${userId}, ${keyword}, ${totalLinks}, ${status}, ${JSON.stringify(urls)})
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to save report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await sql`
      SELECT * FROM reports WHERE user_id = ${userId} ORDER BY created_at DESC;
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
