import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Exclude Next.js system assets, static files, API routes, and auth
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();

  // 2. Base platform domains (Zyntix SaaS platform & Studio builder)
  const isPlatformDomain = 
    currentHost === "localhost" || 
    currentHost === "127.0.0.1" || 
    currentHost === "zyntix.app" ||
    currentHost === "www.zyntix.app" ||
    currentHost.endsWith(".vercel.app");

  if (isPlatformDomain) {
    // Normal SaaS platform access (Landing, Studio, Pricing, Auth)
    return NextResponse.next();
  }

  // 3. Custom domain access: if site owner wants to access /studio from their custom domain
  if (url.pathname === "/studio" || url.pathname.startsWith("/studio/")) {
    return NextResponse.next();
  }

  // Handle Clerk/Auth subdomains on custom domain
  if (currentHost.endsWith(".moderntrendsnow.org")) {
    const sub = currentHost.replace(".moderntrendsnow.org", "");
    if (sub === "clerk" || sub === "accounts") {
      return NextResponse.next();
    }
  }

  // 4. Custom domain & publication rewrite:
  // For moderntrendsnow.org or www.moderntrendsnow.org, this is the demo/custom website!
  const isModernTrends = currentHost === "moderntrendsnow.org" || currentHost === "www.moderntrendsnow.org";
  const targetSubdomainOrDomain = isModernTrends ? "demo" : currentHost;

  const path = url.pathname === "/" ? "" : url.pathname;
  const rewriteUrl = new URL(`/site/${targetSubdomainOrDomain}${path}`, req.url);
  rewriteUrl.search = url.search;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
