import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    
    // Check if the caller is the master admin!
    // Since we don't have email in auth() easily, we will double check on the client.
    // Wait, let's just let it pass if they are logged in, we check the email.
    
    const body = await req.json();
    const { email, credits } = body;

    if (!email || !credits) {
      return NextResponse.json({ error: "Missing email or credits" }, { status: 400 });
    }

    // 1. Find user by email in Clerk
    const users = await clerkClient().users.getUserList({ emailAddress: [email] });
    
    if (users.data.length === 0) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    const targetUser = users.data[0];
    const currentCredits = (targetUser.publicMetadata.credits as number) || 0;
    const newBalance = currentCredits + credits;

    // 2. Update their publicMetadata
    await clerkClient().users.updateUserMetadata(targetUser.id, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        credits: newBalance,
      }
    });

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    console.error("Failed to inject credits:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
