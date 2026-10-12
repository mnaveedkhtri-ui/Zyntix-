import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const isWwwInput = cleanDomain.startsWith('www.');
    const rootDomain = isWwwInput ? cleanDomain.replace(/^www\./, '') : cleanDomain;
    const wwwDomain = `www.${rootDomain}`;

    const validIps = ['76.76.21.21', '216.198.79.1'];
    const expectedIp = '76.76.21.21';

    // 1. Resolve Root Domain A Record
    let aRecords: string[] = [];
    try {
      const dnsResA = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(rootDomain)}&type=A`, {
        headers: { Accept: 'application/dns-json' },
        cache: 'no-store'
      });
      const dataA = await dnsResA.json();
      const answersA = dataA.Answer || [];
      aRecords = answersA.filter((a: any) => a.type === 1).map((a: any) => a.data);
    } catch (e) {
      console.warn('DNS A resolve error:', e);
    }

    // 2. Resolve WWW Subdomain (CNAME or A)
    let wwwRecords: string[] = [];
    try {
      const dnsResWww = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(wwwDomain)}&type=CNAME`, {
        headers: { Accept: 'application/dns-json' },
        cache: 'no-store'
      });
      const dataWww = await dnsResWww.json();
      const answersWww = dataWww.Answer || [];
      wwwRecords = answersWww.map((a: any) => a.data?.toLowerCase().replace(/\.$/, ''));
    } catch (e) {
      console.warn('DNS WWW resolve error:', e);
    }

    const isRootConnected = aRecords.some((ip: string) => validIps.includes(ip));
    const isWwwConnected = wwwRecords.some(
      (cname: string) => cname.includes('vercel-dns.com') || cname.includes('vercel.app')
    );

    const isVercelConnected = isRootConnected || isWwwConnected;

    const isCloudflareProxy = aRecords.some((ip: string) => 
      ip.startsWith('104.1') || ip.startsWith('104.2') || ip.startsWith('172.64.') || ip.startsWith('172.67.')
    );

    let status = 'not_configured';
    let message = 'No DNS records detected yet. Please add an A Record pointing to 76.76.21.21 in your domain registrar and save.';

    if (isVercelConnected) {
      status = 'connected';
      message = `Success! ${rootDomain} is pointing directly to Zyntix Edge servers (${aRecords.filter(ip => validIps.includes(ip)).join(', ') || 'CNAME Active'}). SSL is active and your publication is live!`;
    } else if (isCloudflareProxy) {
      status = 'cloudflare_proxied';
      message = `${rootDomain} is using Cloudflare Proxy. Please switch your Cloudflare DNS proxy toggle from "Proxied (Orange Cloud)" to "DNS Only (Grey Cloud)" for instant SSL issuance.`;
    } else if (aRecords.length > 0) {
      status = 'pointing_elsewhere';
      message = `${rootDomain} is currently pointing to ${aRecords.join(', ')}. Please update your A Record (@) to 76.76.21.21 in your domain registrar.`;
    }

    return NextResponse.json({
      success: true,
      domain: rootDomain,
      status,
      currentIps: aRecords,
      expectedIp,
      isVercelConnected,
      isRootConnected,
      isWwwConnected,
      wwwRecords,
      message,
      checkedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('DNS Check error:', error);
    return NextResponse.json({ success: false, error: String(error?.message || error) }, { status: 500 });
  }
}
