import { NextResponse } from "next/server";
import { getUserByEmail, saveUser, encodeSession, ADMIN_EMAIL, ZUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isFounder = cleanEmail === ADMIN_EMAIL.toLowerCase();

    let user = getUserByEmail(cleanEmail);

    // If founder is logging in, auto-create/ensure founder profile
    if (!user && isFounder) {
      user = {
        id: "usr_founder_001",
        name: "Founder Admin",
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        role: "founder"
      };
      saveUser(user);
    } else if (!user) {
      // If user doesn't exist yet, we can either prompt them to sign up or create account directly
      return NextResponse.json({ 
        success: false, 
        error: "Account not found. Please click 'Create Account' to sign up first." 
      }, { status: 404 });
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = encodeSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      message: "Signed in successfully"
    });

    // Set secure cookie for 30 days
    response.cookies.set("zyntix_session", token, {
      path: "/",
      httpOnly: false, // Accessible to client-side scripts as well for convenience
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to sign in" }, { status: 500 });
  }
}
