import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const hostHeader = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const host = hostHeader.toLowerCase().replace(/:\d+$/, "");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const targetHost = host || "www.moderntrendsnow.org";
  const sitemapUrl = `${protocol}://${targetHost}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "PerplexityBot", "ChatGPT-User"],
        allow: "/",
      }
    ],
    sitemap: sitemapUrl,
  };
}
