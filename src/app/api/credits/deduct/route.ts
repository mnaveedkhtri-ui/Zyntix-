import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await clerkClient().users.getUser(userId);
    const currentCredits = (user.publicMetadata.credits as number) || 0;

    if (currentCredits <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    const newBalance = currentCredits - 1;

    await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        credits: newBalance,
      }
    });

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    console.error("Failed to deduct credit:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
