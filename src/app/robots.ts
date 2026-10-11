import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const hostHeader = headersList.get("host") || "";
  const host = hostHeader.toLowerCase().replace(/:\d+$/, "");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zyntix-studio-ivory.vercel.app";

  const targetHost = host || "zyntix-studio-ivory.vercel.app";
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
