import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllSites } from "@/lib/sites";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const hostHeader = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const host = hostHeader.toLowerCase().replace(/:\d+$/, "");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const now = new Date();

  const sites = getAllSites();

  // Check if this is a platform domain (zyntix.app or vercel.app)
  const isPlatform = 
    host === "" ||
    host === "localhost" ||
    host === "zyntix.app" ||
    host === "www.zyntix.app" ||
    host.endsWith(".vercel.app");

  // If request is from a custom domain (e.g. www.moderntrendsnow.org or moderntrendsnow.org)
  if (!isPlatform) {
    const matchingSite = sites.find(s => 
      (s.customDomain && (
        host === s.customDomain.toLowerCase() ||
        host === `www.${s.customDomain.toLowerCase()}` ||
        s.customDomain.toLowerCase() === `www.${host}` ||
        host.includes(s.customDomain.toLowerCase().replace(/^www\./, ""))
      )) ||
      host === `${s.subdomain}.zyntix.app`
    ) || sites[0];

    const domainBase = `https://${host}`;
    const siteRoutes: MetadataRoute.Sitemap = [
      {
        url: domainBase,
        lastModified: new Date(matchingSite.updatedAt || now),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${domainBase}/blog`,
        lastModified: new Date(matchingSite.updatedAt || now),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];

    if (matchingSite.posts && Array.isArray(matchingSite.posts)) {
      for (const post of matchingSite.posts) {
        siteRoutes.push({
          url: `${domainBase}/blog/${post.slug}`,
          lastModified: new Date(post.date || now),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }

    return siteRoutes;
  }

  // Fallback ONLY for platform root domain (zyntix.app / vercel.app)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host || "zyntix-studio-ivory.vercel.app"}`;

  const platformRoutes: MetadataRoute.Sitemap = [
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

  for (const site of sites) {
    const siteUrl = site.customDomain 
      ? `https://${site.customDomain}` 
      : `${baseUrl}/site/${site.subdomain}`;

    platformRoutes.push({
      url: siteUrl,
      lastModified: new Date(site.updatedAt || now),
      changeFrequency: "daily",
      priority: 0.9,
    });

    platformRoutes.push({
      url: `${siteUrl}/blog`,
      lastModified: new Date(site.updatedAt || now),
      changeFrequency: "daily",
      priority: 0.85,
    });

    if (site.posts && Array.isArray(site.posts)) {
      for (const post of site.posts) {
        platformRoutes.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.date || now),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  return platformRoutes;
}
