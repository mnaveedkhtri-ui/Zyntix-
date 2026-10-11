/**
 * Autonomous Indexing Dispatcher
 * - IndexNow Protocol ping for Bing, Yandex, Seznam
 * - Google Search Console / Sitemap Ping
 */

export interface IndexingResult {
  engine: string;
  success: boolean;
  timestamp: string;
  url: string;
  details?: string;
}

export async function pingIndexNow(targetUrl: string, host: string): Promise<IndexingResult> {
  try {
    const key = 'zyntix-indexnow-key-2026';
    const payload = {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: [targetUrl]
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return {
      engine: 'IndexNow (Bing/Yandex)',
      success: res.status === 200 || res.status === 202,
      timestamp: new Date().toISOString(),
      url: targetUrl,
      details: `HTTP ${res.status}`
    };
  } catch (e) {
    return {
      engine: 'IndexNow',
      success: false,
      timestamp: new Date().toISOString(),
      url: targetUrl,
      details: String(e)
    };
  }
}

export async function pingGoogleSitemap(sitemapUrl: string): Promise<IndexingResult> {
  try {
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    return {
      engine: 'Google Sitemap Ping',
      success: res.status === 200,
      timestamp: new Date().toISOString(),
      url: sitemapUrl,
      details: `Status ${res.status}`
    };
  } catch (e) {
    return {
      engine: 'Google Sitemap Ping',
      success: false,
      timestamp: new Date().toISOString(),
      url: sitemapUrl,
      details: String(e)
    };
  }
}
