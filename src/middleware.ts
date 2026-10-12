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

  // 2. Base platform domains (Never rewrite these as subdomains)
  // Canonical redirect: forward temporary vercel.app to production domain where Clerk is verified
  const isVercelDomain = currentHost.endsWith(".vercel.app");
  if (isVercelDomain) {
    const targetUrl = new URL(url.pathname + url.search, "https://www.moderntrendsnow.org");
    return NextResponse.redirect(targetUrl, 308);
  }

  const isApex = 
    currentHost === "localhost" || 
    currentHost === "127.0.0.1" || 
    currentHost === "zyntix.app" ||
    currentHost === "www.zyntix.app" ||
    currentHost === "moderntrendsnow.org" ||
    currentHost === "www.moderntrendsnow.org";

  if (isApex) {
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      const rewriteUrl = new URL(`/site/demo${url.pathname}`, req.url);
      rewriteUrl.search = url.search;
      return NextResponse.rewrite(rewriteUrl);
    }
    // Normal platform access (Landing, Studio, etc.)
    return NextResponse.next();
  }

  // 3. Subdomain detection on custom apex (e.g., client.zyntix.app or client.moderntrendsnow.org)
  if (currentHost.endsWith(".zyntix.app")) {
    const subdomain = currentHost.replace(".zyntix.app", "");
    if (subdomain && subdomain !== "www" && subdomain !== "app") {
      const path = url.pathname === "/" ? "" : url.pathname;
      const rewriteUrl = new URL(`/site/${subdomain}${path}`, req.url);
      rewriteUrl.search = url.search;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  if (currentHost.endsWith(".moderntrendsnow.org")) {
    const subdomain = currentHost.replace(".moderntrendsnow.org", "");
    if (subdomain && subdomain !== "www" && subdomain !== "app" && subdomain !== "clerk" && subdomain !== "accounts") {
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
