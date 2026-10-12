import { NextResponse } from "next/server";
import { getUserByEmail, saveUser, encodeSession, ADMIN_EMAIL, ZUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = getUserByEmail(cleanEmail);

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: "An account with this email already exists. Please sign in instead." 
      }, { status: 400 });
    }

    const isFounder = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const newUser: ZUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name?.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      role: isFounder ? "founder" : "member"
    };

    saveUser(newUser);

    const sessionPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };

    const token = encodeSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      message: "Account created successfully"
    });

    response.cookies.set("zyntix_session", token, {
      path: "/",
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create account" }, { status: 500 });
  }
}
