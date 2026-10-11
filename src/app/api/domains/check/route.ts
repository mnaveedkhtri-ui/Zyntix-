import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Query Google Public DNS over HTTPS (DoH) for Type A record
    const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      cache: 'no-store'
    });

    const dnsData = await dnsRes.json();
    const answers = dnsData.Answer || [];
    const aRecords = answers.filter((a: any) => a.type === 1).map((a: any) => a.data);

    // Vercel Anycast IPs (legacy 76.76.21.21 and newly expanded 216.198.79.1)
    const validIps = ['76.76.21.21', '216.198.79.1'];
    const expectedIp = '76.76.21.21';
    const isVercelConnected = aRecords.some((ip: string) => validIps.includes(ip));

    let status = 'not_configured';
    let message = 'No DNS records detected yet.';

    if (isVercelConnected) {
      status = 'connected';
      message = `Success! ${cleanDomain} is pointing to Zyntix Edge servers (${aRecords.filter((ip: string) => validIps.includes(ip)).join(', ')}).`;
    } else if (aRecords.length > 0) {
      status = 'pointing_elsewhere';
      message = `${cleanDomain} is currently pointing to ${aRecords.join(', ')}. Please update your A Record to 216.198.79.1 or 76.76.21.21.`;
    }

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      status,
      currentIps: aRecords,
      expectedIp,
      isVercelConnected,
      message,
      checkedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('DNS Check error:', error);
    return NextResponse.json({ success: false, error: String(error?.message || error) }, { status: 500 });
  }
}
