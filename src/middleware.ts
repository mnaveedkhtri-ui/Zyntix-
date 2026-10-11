import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Exclude internal Next.js assets, public images, icons, and static routes
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Determine current domain & extract potential subdomain
  // In development: localhost:3000, brand.localhost:3000
  // In production: zyntix.app, brand.zyntix.app, or custom domain like customdomain.com
  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();
  
  // Define root/platform domains
  const appDomains = ["zyntix.app", "zyntix.vercel.app", "localhost", "127.0.0.1"];
  const isPlatformApex = appDomains.includes(currentHost);

  // Check if we are on a subdomain (e.g. brand.zyntix.app or brand.localhost)
  let subdomain: string | null = null;

  for (const domain of appDomains) {
    if (currentHost.endsWith(`.${domain}`)) {
      subdomain = currentHost.replace(`.${domain}`, "");
      break;
    }
  }

  // Custom domain check: Host is not apex platform domain and not a zyntix subdomain
  const isCustomDomain = !isPlatformApex && !subdomain && !currentHost.includes("localhost");

  // If request has subdomain or custom domain, route to multi-tenant site path
  if (subdomain && subdomain !== "www" && subdomain !== "app" && subdomain !== "admin") {
    // Rewrite path to /site/[subdomain]/...
    const path = url.pathname === "/" ? "" : url.pathname;
    const rewriteUrl = new URL(`/site/${subdomain}${path}`, req.url);
    rewriteUrl.search = url.search;
    
    // Add header for tracking
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-zyntix-subdomain", subdomain);
    response.headers.set("x-zyntix-tenant-type", "subdomain");
    return response;
  }

  if (isCustomDomain) {
    // Rewrite custom domain to /site/_custom/[domain]/...
    const path = url.pathname === "/" ? "" : url.pathname;
    const rewriteUrl = new URL(`/site/${currentHost}${path}`, req.url);
    rewriteUrl.search = url.search;

    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-zyntix-custom-domain", currentHost);
    response.headers.set("x-zyntix-tenant-type", "custom-domain");
    return response;
  }

  // Otherwise, allow standard platform route (Landing, /dashboard, /studio, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
