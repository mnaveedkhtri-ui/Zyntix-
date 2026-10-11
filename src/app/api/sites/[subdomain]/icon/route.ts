import { NextRequest } from 'next/server';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  const siteName = site?.name || 'Zyntix';
  const initial = siteName.trim().charAt(0).toUpperCase() || 'Z';
  const niche = (site?.niche || '').toLowerCase();

  // Niche-specific luxury color palette
  let bg = '#1c1917';
  let fg = '#faf8f5';
  let accent = '#d97706';

  if (niche.includes('tech') || niche.includes('software') || niche.includes('ai') || niche.includes('data')) {
    bg = '#09090b';
    fg = '#ffffff';
    accent = '#38bdf8';
  } else if (niche.includes('health') || niche.includes('wellness') || niche.includes('green') || niche.includes('eco')) {
    bg = '#052e16';
    fg = '#f0fdf4';
    accent = '#22c55e';
  } else if (niche.includes('legal') || niche.includes('law') || niche.includes('finance') || niche.includes('wealth')) {
    bg = '#18181b';
    fg = '#fef08a';
    accent = '#ca8a04';
  } else if (niche.includes('art') || niche.includes('fashion') || niche.includes('luxury') || niche.includes('media')) {
    bg = '#262626';
    fg = '#fafafa';
    accent = '#e11d48';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="128" fill="${bg}"/>
  <rect x="2" y="2" width="508" height="508" rx="126" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="4"/>
  <text x="256" y="340" 
        font-family="Georgia, 'Times New Roman', serif" 
        font-size="280" 
        font-weight="bold" 
        fill="${fg}" 
        text-anchor="middle" 
        dominant-baseline="middle">${initial}</text>
  <circle cx="380" cy="132" r="24" fill="${accent}"/>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
