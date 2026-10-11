import { MetadataRoute } from "next";
import { getAllSites } from "@/lib/sites";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zyntix-studio-ivory.vercel.app";
  const now = new Date();

  // Platform Root Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic Multi-Tenant Sites and All Published Articles
  const sites = getAllSites();
  const dynamicSiteRoutes: MetadataRoute.Sitemap = [];

  for (const site of sites) {
    const siteUrl = site.customDomain 
      ? `https://${site.customDomain}` 
      : `${baseUrl}/site/${site.subdomain}`;

    // Main Site / Publication Landing
    dynamicSiteRoutes.push({
      url: siteUrl,
      lastModified: new Date(site.updatedAt || now),
      changeFrequency: "daily",
      priority: 0.95,
    });

    // Sub-sections / Anchors
    dynamicSiteRoutes.push({
      url: `${siteUrl}#services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
    dynamicSiteRoutes.push({
      url: `${siteUrl}#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    dynamicSiteRoutes.push({
      url: `${siteUrl}#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Individual Articles
    if (site.posts && Array.isArray(site.posts)) {
      for (const post of site.posts) {
        dynamicSiteRoutes.push({
          url: `${siteUrl}#${post.slug}`,
          lastModified: new Date(post.date || now),
          changeFrequency: "monthly",
          priority: 0.9,
        });
      }
    }
  }

  return [...staticRoutes, ...dynamicSiteRoutes];
}
