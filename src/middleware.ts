import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Exclude Next.js system assets, static files, and API routes
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();

  // 2. Base platform domains (Never rewrite these as subdomains)
  // Matches: localhost, zyntix.app, *.vercel.app (e.g. zyntix-studio-ivory.vercel.app)
  const isVercelDomain = currentHost.endsWith(".vercel.app");
  const isApex = currentHost === "localhost" || currentHost === "127.0.0.1" || currentHost === "zyntix.app";

  if (isVercelDomain || isApex) {
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      const rewriteUrl = new URL(`/site/demo${url.pathname}`, req.url);
      rewriteUrl.search = url.search;
      return NextResponse.rewrite(rewriteUrl);
    }
    // Normal platform access (Landing, Studio, etc.)
    return NextResponse.next();
  }

  // 3. Subdomain detection on custom apex (e.g., client.zyntix.app)
  if (currentHost.endsWith(".zyntix.app")) {
    const subdomain = currentHost.replace(".zyntix.app", "");
    if (subdomain && subdomain !== "www" && subdomain !== "app") {
      const path = url.pathname === "/" ? "" : url.pathname;
      const rewriteUrl = new URL(`/site/${subdomain}${path}`, req.url);
      rewriteUrl.search = url.search;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 4. Custom domain detection
  const path = url.pathname === "/" ? "" : url.pathname;
  const rewriteUrl = new URL(`/site/${currentHost}${path}`, req.url);
  rewriteUrl.search = url.search;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
