import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'Zyntix Autonomous AI Web Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(circle at 20% 20%, #1c1917 0%, #09090b 70%)',
          padding: '80px',
          fontFamily: 'serif',
          color: '#faf8f5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#faf8f5',
              color: '#09090b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            Z
          </div>
          <span style={{ fontSize: '34px', letterSpacing: '-0.02em', fontWeight: 400 }}>
            Zyntix
          </span>
          <span
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#a1a1aa',
              marginLeft: '8px',
              fontFamily: 'sans-serif',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
            }}
          >
            Autonomous Editorial Platform
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '960px' }}>
          <h1
            style={{
              fontSize: '54px',
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#ffffff',
            }}
          >
            Websites that feel unmistakably crafted by human hands.
          </h1>
          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.5,
              color: '#a8a29e',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: 300,
            }}
          >
            Autonomous multi-tenant publications that rank on autopilot. Built with quiet typography, deep long-tail SERP gap research, and zero AI noise.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            color: '#71717a',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '28px',
            width: '100%',
          }}
        >
          <span>Instant Global Staging</span>
          <span>•</span>
          <span>AEO #0 Position Answer Snippets</span>
          <span>•</span>
          <span>Automatic Let&apos;s Encrypt SSL</span>
          <span>•</span>
          <span>Custom Domain Concierge</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
