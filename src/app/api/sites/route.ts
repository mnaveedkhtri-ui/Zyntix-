import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSitesForUser, saveOrUpdateSite, getSiteById, ADMIN_EMAIL } from "@/lib/sites";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      const site = getSiteById(id);
      return NextResponse.json({ success: true, site });
    }

    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
      if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        userEmail = user.emailAddresses[0]?.emailAddress || null;
      }
    } catch (authErr) {
      // Unauthenticated visitor / sandbox bypass
    }

    // Client query fallback if session is on different domain (e.g. vercel.app vs custom domain)
    const queryUserId = url.searchParams.get("userId");
    const queryUserEmail = url.searchParams.get("userEmail");
    if (!userId && queryUserId) {
      userId = queryUserId;
    }
    if (!userEmail && queryUserEmail) {
      userEmail = queryUserEmail;
    }

    const sites = getSitesForUser(userId, userEmail);
    const isFounder = userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    return NextResponse.json({
      success: true,
      sites,
      isFounder,
      authenticated: !!userId,
      user: userId ? { id: userId, email: userEmail } : null
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.subdomain || !body.name) {
      return NextResponse.json(
        { success: false, error: "Subdomain and Site Name are required" },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (e) {
      // Non-auth creation
    }

    if (userId && !body.userId) {
      body.userId = userId;
    }

    const saved = saveOrUpdateSite(body);
    return NextResponse.json({ success: true, site: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
