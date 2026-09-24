import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.publicMetadata.credits === undefined) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          credits: 20,
        }
      });
      return NextResponse.json({ success: true, initialized: true, credits: 20 });
    }

    return NextResponse.json({ success: true, initialized: false });
  } catch (error) {
    console.error("Failed to init credits:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
