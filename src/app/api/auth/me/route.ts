import { NextResponse } from "next/server";
import { decodeSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/zyntix_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const session = decodeSession(token);
    if (!session) {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user: session
    });
  } catch (err) {
    return NextResponse.json({ success: false, user: null });
  }
}
