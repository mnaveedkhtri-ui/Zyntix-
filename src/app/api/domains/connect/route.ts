import { NextResponse } from 'next/server';
import { getSiteById, saveOrUpdateSite } from '@/lib/sites';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { siteId, domain, registrar = 'custom' } = body;

    if (!siteId || !domain) {
      return NextResponse.json(
        { success: false, error: 'siteId and domain are required' },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const site = getSiteById(siteId);

    if (!site) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
    }

    // Step 1: Vercel Domains REST API Integration (if Vercel token is configured)
    let vercelApiResult = { added: false, message: 'Ready for DNS delegation' };
    const vercelToken = process.env.VERCEL_AUTH_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;

    if (vercelToken && vercelProjectId) {
      try {
        const vRes = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/domains`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: cleanDomain }),
        });
        const vData = await vRes.json();
        vercelApiResult = { added: vRes.ok, message: vData.message || 'Domain submitted to Vercel API' };
      } catch (vErr) {
        console.warn('Vercel API error:', vErr);
      }
    }

    // Step 2: Save custom domain in tenant config
    const updatedSite = saveOrUpdateSite({
      ...site,
      customDomain: cleanDomain,
    });

    // Step 3: Zero-Confusion Guided DNS instructions per registrar
    const dnsRecords = {
      aRecord: { type: 'A', name: '@', value: '76.76.21.21' },
      cnameRecord: { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
    };

    const registrarGuides: Record<string, string[]> = {
      godaddy: [
        'Log in to GoDaddy Domain Portfolio and select your domain.',
        'Click DNS Records -> Add New Record -> Select Type A, Name @, Value 76.76.21.21.',
        'Add CNAME Record: Name www, Value cname.vercel-dns.com.',
        'Click Save. SSL is automatically provisioned within 15 minutes.'
      ],
      namecheap: [
        'Log in to Namecheap -> Domain List -> Click Manage.',
        'Go to Advanced DNS tab.',
        'Add A Record: Host @, Value 76.76.21.21, TTL Automatic.',
        'Add CNAME Record: Host www, Target cname.vercel-dns.com.',
        'Save all changes.'
      ],
      hostinger: [
        'Open Hostinger hPanel -> Domains -> DNS / Nameservers.',
        'Add A Record: Name @, Points to 76.76.21.21.',
        'Add CNAME Record: Name www, Target cname.vercel-dns.com.',
        'Save Changes.'
      ],
      custom: [
        'Go to your domain provider DNS settings.',
        'Point A Record (@) to 76.76.21.21.',
        'Point CNAME Record (www) to cname.vercel-dns.com.',
        'Automatic free Let\'s Encrypt SSL certificate will activate.'
      ]
    };

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      site: updatedSite,
      dns: dnsRecords,
      guide: registrarGuides[registrar] || registrarGuides.custom,
      ssl: {
        status: 'Provisioning',
        provider: 'Let\'s Encrypt (Automatic)',
        renewal: 'Auto-renews forever ($0 Cost)'
      },
      vercelApiResult
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
