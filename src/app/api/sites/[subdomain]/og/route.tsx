import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  const siteName = site?.name || 'Publication';
  const siteLocation = site?.location || 'Atelier';
  const siteNiche = site?.niche || 'Craft & Architecture';
  const authorName = site?.author?.name || 'Principal Author';
  const authorRole = site?.author?.credentials || 'Master Practitioner';

  // Article specific card
  if (slug && site?.posts) {
    const post = site.posts.find(
      (p) =>
        p.slug === slug ||
        (slug === 'the-art-of-quiet-software' && p.slug === 'the-art-of-quiet-structures') ||
        (slug === 'the-art-of-quiet-structures' && p.slug === 'the-art-of-quiet-software')
    );

    if (post) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#141210',
              backgroundImage: 'radial-gradient(circle at 80% 20%, #292524 0%, #141210 70%)',
              padding: '70px 80px',
              color: '#faf8f5',
              fontFamily: 'serif',
            }}
          >
            {/* Top Brand & Category Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#faf8f5',
                    color: '#141210',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {siteName.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '20px', fontWeight: 600 }}>{siteName}</span>
                  <span style={{ fontSize: '11px', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'sans-serif' }}>
                    {siteLocation} Atelier &bull; Research Journal
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '13px',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#f59e0b',
                  backgroundColor: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Main Article Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1040px' }}>
              <h1
                style={{
                  fontSize: '52px',
                  lineHeight: 1.18,
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  color: '#ffffff',
                }}
              >
                {post.title}
              </h1>
              <p
                style={{
                  fontSize: '20px',
                  lineHeight: 1.5,
                  color: '#d6d3d1',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{post.excerpt.length > 150 ? post.excerpt.slice(0, 150) + '...' : post.excerpt}&rdquo;
              </p>
            </div>

            {/* Bottom Metadata & Author */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '24px',
                width: '100%',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                color: '#a8a29e',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{post.author?.name || authorName}</span>
                <span>&bull;</span>
                <span>{post.date}</span>
                <span>&bull;</span>
                <span>{post.readTime}</span>
              </div>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', color: '#78716c' }}>
                Permanent Research Monograph
              </span>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }
  }

  // Publication Homepage card
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#141210',
          backgroundImage: 'radial-gradient(circle at 75% 25%, #292524 0%, #141210 70%)',
          padding: '70px 80px',
          color: '#faf8f5',
          fontFamily: 'serif',
        }}
      >
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#faf8f5',
                color: '#141210',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              {siteName.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>{siteName}</span>
              <span style={{ fontSize: '12px', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'sans-serif' }}>
                Official Publication &bull; {siteLocation}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '13px',
              fontFamily: 'sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#f59e0b',
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.35)',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            {siteNiche}
          </span>
        </div>

        {/* Hero Tagline & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1040px' }}>
          <h1
            style={{
              fontSize: '56px',
              lineHeight: 1.16,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#ffffff',
            }}
          >
            {site?.tagline || `Authentic Craftsmanship & Thoughtful Design`}
          </h1>
          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.5,
              color: '#d6d3d1',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: 300,
            }}
          >
            {site?.description || `Independent studio and research journal dedicated to uncompromised craftsmanship.`}
          </p>
        </div>

        {/* Bottom Proof Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '24px',
            width: '100%',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            color: '#a8a29e',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{authorName}</span>
            <span>&bull;</span>
            <span>{authorRole}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Verified Atelier Portfolio</span>
            <span>&bull;</span>
            <span>{site?.posts?.length || 3} Research Monographs</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
