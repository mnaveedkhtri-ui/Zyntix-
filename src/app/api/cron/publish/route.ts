import { NextResponse } from 'next/server';
import { getAllSites, saveOrUpdateSite } from '@/lib/sites';
import { fetchGoogleSerpSuggestions, generateDeepHumanArticle } from '@/lib/seo-engine';
import { injectBiDirectionalLinks } from '@/lib/link-mesh';
import { generateHeadingMatchedImage } from '@/lib/image-engine';
import { pingIndexNow, pingGoogleSitemap } from '@/lib/indexing';
import { optimizeMetaTitle, optimizeMetaDescription } from '@/lib/seo-helpers';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const targetSubdomain = url.searchParams.get("subdomain") || url.searchParams.get("site");
    const targetSiteId = url.searchParams.get("siteId");

    let sites = getAllSites();
    if (targetSubdomain) {
      sites = sites.filter(s => s.subdomain.toLowerCase() === targetSubdomain.toLowerCase());
    } else if (targetSiteId) {
      sites = sites.filter(s => s.id === targetSiteId);
    }

    const results = [];

    for (const site of sites) {
      // 1. Fetch organic SERP long-tail opportunities
      const queries = await fetchGoogleSerpSuggestions(site.niche);
      const chosenTopic = queries.length > 0 
        ? queries[Math.floor(Math.random() * queries.length)]
        : `${site.niche} Craftsmanship & Practical Work`;

      // 2. Generate high-depth human article
      const article = await generateDeepHumanArticle(chosenTopic, site.author.name);

      // Track already used URLs from existing posts to guarantee zero duplicates across publication
      const usedUrls = new Set<string>();
      site.posts.forEach(p => {
        if (p.coverImage) usedUrls.add(p.coverImage);
        p.content.forEach(c => {
          const m = c.match(/!\[.*?\]\((https:\/\/images\.unsplash\.com\/[^\)]+)\)/);
          if (m && m[1]) usedUrls.add(m[1]);
        });
      });

      const coverImg = generateHeadingMatchedImage(article.title, site.niche, usedUrls);

      // 3. Attach heading-matched images & internal link mesh
      const enrichedBlocks: string[] = [
        `[AEO_ANSWER]: ${article.aeoAnswer}`
      ];

      for (const section of article.sections) {
        enrichedBlocks.push(`### ${section.heading}`);
        if (section.subheading) enrichedBlocks.push(`*${section.subheading}*`);
        enrichedBlocks.push(...section.paragraphs);

        // Generate contextual image strictly matched to heading and guaranteed unique
        const matchedImg = generateHeadingMatchedImage(section.heading, site.niche, usedUrls);
        enrichedBlocks.push(`![${matchedImg.alt}](${matchedImg.url})`);
        enrichedBlocks.push(`*${matchedImg.caption}*`);

        if (section.quote) enrichedBlocks.push(`> ${section.quote}`);
      }

      // Inject bi-directional links & authoritative E-E-A-T citations
      const existingSummary = site.posts.map(p => ({ slug: p.slug, title: p.title }));
      const linkedContent = injectBiDirectionalLinks(enrichedBlocks, existingSummary, site.niche);

      const optimizedTitle = optimizeMetaTitle(article.title, site.name);
      const optimizedExcerpt = optimizeMetaDescription(article.excerpt);

      const newPost = {
        slug: article.slug,
        title: optimizedTitle,
        excerpt: optimizedExcerpt,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: article.readTime,
        category: article.category,
        author: {
          name: site.author.name,
          avatar: site.author.avatar,
          role: 'Author'
        },
        coverImage: coverImg.url,
        content: linkedContent
      };

      // Save to publication
      const updatedSite = saveOrUpdateSite({
        ...site,
        posts: [newPost, ...site.posts]
      });

      // 4. Autonomous Search Engine Ping
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.moderntrendsnow.org';
      const host = site.customDomain || 'www.moderntrendsnow.org';
      const cleanDomain = site.customDomain ? site.customDomain.replace(/^https?:\/\//, '') : '';
      const domainBase = cleanDomain ? `https://${cleanDomain}` : baseUrl;
      const targetUrl = cleanDomain 
        ? `${domainBase}/blog/${article.slug}`
        : `${baseUrl}/site/${site.subdomain}#${article.slug}`;
      const sitemapUrl = `${domainBase}/sitemap.xml`;

      const [indexNowRes, googleRes] = await Promise.all([
        pingIndexNow(targetUrl, host),
        pingGoogleSitemap(sitemapUrl)
      ]);

      results.push({
        site: site.name,
        subdomain: site.subdomain,
        publishedArticle: article.title,
        indexing: { indexNowRes, googleRes }
      });
    }

    return NextResponse.json({
      success: true,
      cadence: 'Daily Autonomous Cron Dispatched',
      timestamp: new Date().toISOString(),
      processedCount: results.length,
      results
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}

