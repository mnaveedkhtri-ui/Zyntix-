import { NextResponse } from 'next/server';
import { getAllSites } from '@/lib/sites';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase().replace(/:\d+$/, '');
  const sites = getAllSites();
  
  const site = sites.find(s => 
    (s.customDomain && (
      host === s.customDomain.toLowerCase() ||
      host === `www.${s.customDomain.toLowerCase()}` ||
      s.customDomain.toLowerCase() === `www.${host}` ||
      host.includes(s.customDomain.toLowerCase().replace(/^www\./, ""))
    ))
  ) || sites[0];

  const domainBase = host.includes('moderntrendsnow.org') 
    ? (host.startsWith('www.') ? 'https://www.moderntrendsnow.org' : 'https://moderntrendsnow.org')
    : `https://${host}`;

  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${domainBase}</loc>\n`;
  xml += `    <lastmod>${site.updatedAt || now}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Blog Archive
  xml += `  <url>\n`;
  xml += `    <loc>${domainBase}/blog</loc>\n`;
  xml += `    <lastmod>${site.updatedAt || now}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // Articles
  if (site.posts && Array.isArray(site.posts)) {
    for (const post of site.posts) {
      let postDate = now;
      try {
        if (post.date) postDate = new Date(post.date).toISOString();
      } catch (e) {}

      xml += `  <url>\n`;
      xml += `    <loc>${domainBase}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${postDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
