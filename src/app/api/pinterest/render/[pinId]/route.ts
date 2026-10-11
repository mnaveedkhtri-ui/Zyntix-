import { NextRequest, NextResponse } from 'next/server';
import { getPinById } from '@/services/pinterest/pipeline';
import { renderPinImageResponse, generatePinSvgMarkup } from '@/services/pinterest/image-engine';
import { HookAngle } from '@/services/pinterest/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pinId: string }> }
) {
  try {
    const { pinId } = await params;
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'png';

    let pin = getPinById(pinId);

    // If pin wasn't stored in memory yet, create a dynamic fallback representation
    if (!pin) {
      const cleanSlug = pinId.replace(/^pin-/, '').replace(/-\d+$/, '').replace(/-/g, ' ');
      const fallbackAngle: HookAngle = {
        id: pinId,
        angleType: 'listicle',
        angleName: 'High-Converting Listicle',
        badgeText: 'MUST SEE GUIDE',
        headline: cleanSlug.toUpperCase() || 'MODERN ARCHITECTURAL INSPIRATION',
        subheadline: 'Explore practical craftsmanship and design breakdown.',
        ctaText: '👉 Tap to Read Guide',
        imagePrompt: 'modern architecture, timber framing, warm ambient daylight',
        visualTheme: {
          badgeBg: '#f59e0b',
          badgeTextColor: '#000000',
          accentColor: '#fbbf24',
          gradientStart: 'rgba(15, 23, 42, 0.92)',
          gradientEnd: 'rgba(15, 23, 42, 0.98)',
          badgePosition: 'left',
          headlineSize: 64,
          fontFamily: 'Montserrat, sans-serif'
        }
      };

      pin = {
        id: pinId,
        angle: fallbackAngle,
        seo: {
          title: 'Modern Architecture Design Guide',
          description: 'Explore practical craftsmanship and structural design techniques.',
          hashtags: ['Architecture', 'ModernHome'],
          destinationUrl: 'https://www.moderntrendsnow.org',
          boardName: 'Architecture'
        },
        schedule: {
          scheduledSlotTime: '11:00 AM',
          scheduledIsoDate: new Date().toISOString(),
          dripDelayMinutes: 0,
          hashSalt: 'default-salt'
        },
        imageUrl: '',
        renderApiUrl: '',
        svgMarkup: '',
        createdAt: new Date().toISOString(),
        status: 'ready'
      };
    }

    // 1. SVG Format request
    if (format === 'svg') {
      const svg = pin.svgMarkup || generatePinSvgMarkup({
        angle: pin.angle,
        domain: 'moderntrendsnow.org'
      });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
      });
    }

    // 2. High-Res 1000x1500 PNG Format via Satori/ImageResponse
    return renderPinImageResponse({
      angle: pin.angle,
      domain: 'moderntrendsnow.org'
    });
  } catch (error) {
    console.error('[Pinterest Render Error]:', error);
    return new NextResponse('Internal Render Error', { status: 500 });
  }
}
