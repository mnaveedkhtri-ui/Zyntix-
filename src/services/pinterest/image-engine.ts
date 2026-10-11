/**
 * Zyntix Autonomous Pinterest Traffic Machine - 1000x1500 Vertical Graphic Generator
 * - Exact Pinterest 2:3 vertical aspect ratio (1000px width x 1500px height)
 * - $0-cost Pollinations.ai context-matched photorealistic background
 * - High-contrast mobile readability gradient overlays
 * - Satori / Next.js ImageResponse & SVG high-res rendering
 */

import React from 'react';
import { ImageResponse } from 'next/og';
import { HookAngle } from './types';

export interface PinGraphicOptions {
  angle: HookAngle;
  domain: string;
  seed?: number;
  niche?: string;
}

/**
 * Builds the zero-cost Pollinations API photorealistic background image URL
 */
export function buildPollinationsBackgroundUrl(imagePrompt: string, seed: number = 42): string {
  const cleanPrompt = encodeURIComponent(
    `${imagePrompt}, high resolution vertical photography 2:3 portrait, architectural documentary style, cinematic natural lighting, soft grain, clean composition, no text, no watermark`
  );
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1000&height=1500&nologo=true&seed=${seed}`;
}

/**
 * Creates Satori/ImageResponse JSX for 1000x1500 vertical pin graphic
 */
export function createPinJsx(options: PinGraphicOptions): React.ReactElement {
  const { angle, domain, seed = 1000 } = options;
  const theme = angle.visualTheme;
  const bgUrl = buildPollinationsBackgroundUrl(angle.imagePrompt, seed);

  // Layout alignment based on badge position
  const alignSelfBadge = 
    theme.badgePosition === 'center' ? 'center' : 
    theme.badgePosition === 'right' ? 'flex-end' : 'flex-start';

  return React.createElement(
    'div',
    {
      style: {
        width: '1000px',
        height: '1500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: '#090d16',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        overflow: 'hidden'
      }
    },
    [
      // 1. Background Image Layer
      React.createElement('img', {
        key: 'bg-img',
        src: bgUrl,
        alt: angle.headline,
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '1000px',
          height: '1500px',
          objectFit: 'cover'
        }
      }),

      // 2. High-Contrast Dual Gradient Overlay (Top protection + Deep Bottom Reading Contrast)
      React.createElement('div', {
        key: 'dark-overlay',
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '1000px',
          height: '1500px',
          background: `linear-gradient(180deg, rgba(8, 12, 22, 0.88) 0%, rgba(8, 12, 22, 0.25) 35%, rgba(8, 12, 22, 0.45) 55%, rgba(6, 9, 18, 0.96) 88%, rgba(4, 6, 12, 0.99) 100%)`
        }
      }),

      // 3. Header Section with Hook Badge & Category
      React.createElement(
        'div',
        {
          key: 'top-section',
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '70px 65px 0 65px',
            position: 'relative',
            zIndex: 10
          }
        },
        [
          React.createElement(
            'div',
            {
              key: 'badge-pill',
              style: {
                display: 'flex',
                alignItems: 'center',
                alignSelf: alignSelfBadge,
                backgroundColor: theme.badgeBg,
                color: theme.badgeTextColor,
                padding: '16px 34px',
                borderRadius: '40px',
                fontSize: '24px',
                fontWeight: '900',
                letterSpacing: '2px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                textTransform: 'uppercase'
              }
            },
            angle.badgeText
          )
        ]
      ),

      // 4. Center-Bottom Main Copy Section (Headline + Subheadline)
      React.createElement(
        'div',
        {
          key: 'content-section',
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 65px 40px 65px',
            position: 'relative',
            zIndex: 10
          }
        },
        [
          // Accent underline bar
          React.createElement('div', {
            key: 'accent-bar',
            style: {
              width: '110px',
              height: '8px',
              backgroundColor: theme.accentColor,
              borderRadius: '4px',
              marginBottom: '28px'
            }
          }),

          // Viral Bold Headline
          React.createElement(
            'h1',
            {
              key: 'main-headline',
              style: {
                fontSize: `${theme.headlineSize}px`,
                fontWeight: '900',
                lineHeight: 1.14,
                margin: '0 0 24px 0',
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.85)'
              }
            },
            angle.headline
          ),

          // Subheadline / Curiosity hook
          React.createElement(
            'p',
            {
              key: 'sub-headline',
              style: {
                fontSize: '28px',
                lineHeight: 1.35,
                color: '#e2e8f0',
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }
            },
            angle.subheadline
          )
        ]
      ),

      // 5. High-Converting CTA Footer Pill
      React.createElement(
        'div',
        {
          key: 'footer-section',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 65px 65px 65px',
            padding: '24px 40px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '2px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '50px',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            zIndex: 10
          }
        },
        [
          // CTA action
          React.createElement(
            'div',
            {
              key: 'cta-text',
              style: {
                fontSize: '26px',
                fontWeight: '800',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center'
              }
            },
            angle.ctaText
          ),

          // Destination domain badge
          React.createElement(
            'div',
            {
              key: 'domain-badge',
              style: {
                fontSize: '22px',
                fontWeight: '700',
                color: theme.accentColor,
                display: 'flex',
                alignItems: 'center'
              }
            },
            domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
          )
        ]
      )
    ]
  );
}

/**
 * Generates an ImageResponse (1000x1500 PNG) from the pin configuration
 */
export function renderPinImageResponse(options: PinGraphicOptions): ImageResponse {
  const element = createPinJsx(options);
  return new ImageResponse(element, {
    width: 1000,
    height: 1500
  });
}

/**
 * Renders the pin directly to a binary PNG Buffer
 */
export async function renderPinPngBuffer(options: PinGraphicOptions): Promise<Buffer> {
  const imgResponse = renderPinImageResponse(options);
  const arrayBuffer = await imgResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generates pure standalone 1000x1500 SVG vector markup
 * Perfect for instantaneous zero-latency client embedding or serverless SVG generation
 */
export function generatePinSvgMarkup(options: PinGraphicOptions): string {
  const { angle, domain, seed = 500 } = options;
  const theme = angle.visualTheme;
  const bgUrl = buildPollinationsBackgroundUrl(angle.imagePrompt, seed);
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Wrap headline lines for SVG
  const words = angle.headline.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).length > 25) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur += (cur ? ' ' : '') + w;
    }
  }
  if (cur) lines.push(cur.trim());

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
  <defs>
    <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#080c16" stop-opacity="0.90"/>
      <stop offset="35%" stop-color="#080c16" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#080c16" stop-opacity="0.55"/>
      <stop offset="85%" stop-color="#04060c" stop-opacity="0.96"/>
      <stop offset="100%" stop-color="#020306" stop-opacity="0.99"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Image -->
  <image href="${bgUrl}" x="0" y="0" width="1000" height="1500" preserveAspectRatio="xMidYMid slice" />

  <!-- Contrast Gradient Overlay -->
  <rect x="0" y="0" width="1000" height="1500" fill="url(#overlayGrad)" />

  <!-- Top Badge -->
  <g transform="translate(65, 70)" filter="url(#shadow)">
    <rect x="0" y="0" width="${Math.min(angle.badgeText.length * 18 + 48, 500)}" height="58" rx="29" fill="${theme.badgeBg}" />
    <text x="24" y="38" font-family="Montserrat, system-ui, sans-serif" font-size="22" font-weight="900" fill="${theme.badgeTextColor}" letter-spacing="2">
      ${escapeXml(angle.badgeText)}
    </text>
  </g>

  <!-- Accent Line -->
  <rect x="65" y="930" width="110" height="8" rx="4" fill="${theme.accentColor}" />

  <!-- Headline Text -->
  <g transform="translate(65, 1000)" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#ffffff" filter="url(#shadow)">
    ${lines.map((line, i) => `<text x="0" y="${i * 70}" font-size="${theme.headlineSize}">${escapeXml(line)}</text>`).join('\n    ')}
  </g>

  <!-- Subheadline -->
  <text x="65" y="${1000 + lines.length * 70 + 20}" font-family="system-ui, sans-serif" font-size="28" fill="#e2e8f0" font-weight="400">
    ${escapeXml(angle.subheadline.slice(0, 75))}...
  </text>

  <!-- CTA Footer Card -->
  <g transform="translate(65, 1340)" filter="url(#shadow)">
    <rect x="0" y="0" width="870" height="86" rx="43" fill="rgba(255, 255, 255, 0.14)" stroke="rgba(255, 255, 255, 0.25)" stroke-width="2" />
    <text x="40" y="52" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#ffffff">
      ${escapeXml(angle.ctaText)}
    </text>
    <text x="830" y="52" text-anchor="end" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="${theme.accentColor}">
      ${escapeXml(cleanDomain)}
    </text>
  </g>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
