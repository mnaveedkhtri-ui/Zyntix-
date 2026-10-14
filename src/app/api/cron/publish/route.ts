import { NextResponse } from 'next/server';
import { getAllSites, saveOrUpdateSiteAsync, syncSitesFromDatabase } from '@/lib/sites';
import { mineHighIntentKeywords, generateDeepHumanArticle } from '@/lib/seo-engine';
import { injectBiDirectionalLinks } from '@/lib/link-mesh';
import { generateHeadingMatchedImage } from '@/lib/image-engine';
import { pingIndexNow, pingGoogleSitemap } from '@/lib/indexing';
import { optimizeMetaTitle, optimizeMetaDescription } from '@/lib/seo-helpers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient time for dual-article generation and DB write

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const targetSubdomain = url.searchParams.get("subdomain") || url.searchParams.get("site");
    const targetSiteId = url.searchParams.get("siteId");

    await syncSitesFromDatabase().catch(() => {});
    let sites = getAllSites();
    if (targetSubdomain) {
      sites = sites.filter(s => s.subdomain.toLowerCase() === targetSubdomain.toLowerCase());
    } else if (targetSiteId) {
      sites = sites.filter(s => s.id === targetSiteId);
    }

    const results = [];

    for (const site of sites) {
      // 1. Mine zero-KD, high-CTR long-tail keywords directly from Google Suggest Intent Matrix
      const existingSummary = (site.posts || []).map(p => ({ slug: p.slug, title: p.title }));
      const existingSlugs = new Set((site.posts || []).map(p => p.slug.toLowerCase()));
      
      const minedTopics = await mineHighIntentKeywords(site.niche, existingSummary);

      const availableTopics = minedTopics.filter(t => {
        const testSlug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return !existingSlugs.has(testSlug);
      });

      // Strict daily cadence: exactly 2 high-depth monographs per run ("din may 2 article hon bas")
      const batchTopics = availableTopics.slice(0, 2);
      if (batchTopics.length === 0) {
        batchTopics.push(
          `${site.niche} Field Structural Standards Vol ${site.posts.length + 1}`,
          `${site.niche} Generational Durability Standards Vol ${site.posts.length + 2}`
        );
      } else if (batchTopics.length === 1) {
        batchTopics.push(`${site.niche} Generational Durability Standards Vol ${site.posts.length + 2}`);
      }

      // Track already used image URLs
      const usedUrls = new Set<string>();
      site.posts.forEach(p => {
        if (p.coverImage) usedUrls.add(p.coverImage);
        p.content.forEach(c => {
          const m = c.match(/!\[.*?\]\((https:\/\/images\.unsplash\.com\/[^\)]+)\)/);
          if (m && m[1]) usedUrls.add(m[1]);
        });
      });

      const newlyGeneratedPosts = [];
      const publishedTitles = [];

      for (const topic of batchTopics) {
        const article = await generateDeepHumanArticle(topic, site.author.name, site.niche);
        
        // Ensure slug is strictly unique
        let finalSlug = article.slug;
        if (existingSlugs.has(finalSlug)) {
          finalSlug = `${finalSlug}-${Date.now().toString(36).slice(-4)}`;
        }
        existingSlugs.add(finalSlug);

        const coverImg = generateHeadingMatchedImage(article.title, site.niche, usedUrls);
        usedUrls.add(coverImg.url);

        // Assemble Information Gain enriched blocks
        const enrichedBlocks: string[] = [
          `[AEO_ANSWER]: ${article.aeoAnswer}`
        ];

        // If structured data comparison table exists, inject as standard markdown table
        if (article.table && article.table.headers.length > 0) {
          enrichedBlocks.push(`| ${article.table.headers.join(' | ')} |`);
          enrichedBlocks.push(`| ${article.table.headers.map(() => ':---').join(' | ')} |`);
          for (const row of article.table.rows) {
            enrichedBlocks.push(`| ${row.join(' | ')} |`);
          }
        }

        // Deep technical sections with figure captions and citations
        for (const section of article.sections) {
          enrichedBlocks.push(`### ${section.heading}`);
          if (section.subheading) enrichedBlocks.push(`*${section.subheading}*`);
          enrichedBlocks.push(...section.paragraphs);

          const matchedImg = generateHeadingMatchedImage(section.heading, site.niche, usedUrls);
          usedUrls.add(matchedImg.url);
          enrichedBlocks.push(`![${matchedImg.alt}](${matchedImg.url})`);
          enrichedBlocks.push(`*${matchedImg.caption}*`);

          if (section.quote) enrichedBlocks.push(`> ${section.quote}`);
        }

        // Field Execution Protocol
        if (article.actionProtocol && article.actionProtocol.steps.length > 0) {
          enrichedBlocks.push(`### ${article.actionProtocol.title}`);
          article.actionProtocol.steps.forEach((step, idx) => {
            enrichedBlocks.push(`${idx + 1}. ${step}`);
          });
        }

        // Frequently Asked Questions
        if (article.faq && article.faq.length > 0) {
          enrichedBlocks.push(`### Frequently Asked Questions`);
          for (const f of article.faq) {
            enrichedBlocks.push(`**${f.question}**`);
            enrichedBlocks.push(f.answer);
          }
        }

        const cumulativeSummary = [...newlyGeneratedPosts, ...site.posts].map(p => ({ slug: p.slug, title: p.title }));
        const linkedContent = injectBiDirectionalLinks(enrichedBlocks, cumulativeSummary, site.niche);

        const optimizedTitle = optimizeMetaTitle(article.metaTitle || article.title, site.name);
        const optimizedExcerpt = optimizeMetaDescription(article.metaDescription || article.excerpt);

        const postObj = {
          slug: finalSlug,
          title: optimizedTitle,
          metaTitle: optimizedTitle,
          excerpt: optimizedExcerpt,
          metaDescription: optimizedExcerpt,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: article.readTime,
          category: article.category,
          author: {
            name: site.author.name,
            avatar: site.author.avatar,
            role: 'Principal Architect & Conservationist'
          },
          coverImage: coverImg.url,
          content: linkedContent
        };

        newlyGeneratedPosts.push(postObj);
        publishedTitles.push(optimizedTitle);
      }

      // Persist both newly generated articles directly into Neon Serverless Postgres
      const updatedSite = await saveOrUpdateSiteAsync({
        ...site,
        posts: [...newlyGeneratedPosts, ...site.posts]
      });

      // 4. Autonomous Search Engine Ping for all newly published articles
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.moderntrendsnow.org';
      const host = site.customDomain || 'www.moderntrendsnow.org';
      const cleanDomain = site.customDomain ? site.customDomain.replace(/^https?:\/\//, '') : '';
      const domainBase = cleanDomain ? `https://${cleanDomain}` : baseUrl;
      const sitemapUrl = `${domainBase}/sitemap.xml`;

      const pingPromises = newlyGeneratedPosts.map(p => {
        const targetUrl = cleanDomain 
          ? `${domainBase}/blog/${p.slug}`
          : `${baseUrl}/site/${site.subdomain}#${p.slug}`;
        return pingIndexNow(targetUrl, host);
      });

      const indexResults = await Promise.all([
        ...pingPromises,
        pingGoogleSitemap(sitemapUrl)
      ]);

      results.push({
        site: site.name,
        subdomain: site.subdomain,
        publishedCount: newlyGeneratedPosts.length,
        publishedArticles: publishedTitles,
        indexing: { results: indexResults }
      });
    }

    return NextResponse.json({
      success: true,
      cadence: 'Dual-Article Autonomous Cron Dispatched',
      timestamp: new Date().toISOString(),
      processedCount: results.length,
      results
    });
  } catch (err) {
    console.error('Autonomous Cron Job Error:', err);
    return NextResponse.json({
      success: false,
      error: (err as Error).message
    }, { status: 500 });
  }
}
