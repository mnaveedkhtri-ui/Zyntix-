import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Signed out successfully"
  });

  response.cookies.set("zyntix_session", "", {
    path: "/",
    maxAge: 0
  });

  return response;
}
