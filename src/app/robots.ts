import { MetadataRoute } from "next";
import { getAllSites } from "@/lib/sites";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zyntix-studio-ivory.vercel.app";
  
  const sites = getAllSites();
  const customSitemaps = sites
    .filter((s) => s.customDomain)
    .map((s) => `https://${s.customDomain}/sitemap.xml`);

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
    sitemap: Array.from(new Set([`${baseUrl}/sitemap.xml`, ...customSitemaps])),
  };
}
