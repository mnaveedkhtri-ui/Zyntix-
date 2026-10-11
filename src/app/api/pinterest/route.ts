import { NextResponse } from 'next/server';
import { generatePinterestCampaign, getAllStoredPins } from '@/services/pinterest/pipeline';
import { PinterestCampaignInput } from '@/services/pinterest/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pins = getAllStoredPins();
    return NextResponse.json({
      success: true,
      count: pins.length,
      pins
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const input: PinterestCampaignInput = {
      articleTitle: body.articleTitle || '15+ Modern High Fence Design Ideas for Backyard Privacy',
      articleUrl: body.articleUrl || 'https://www.moderntrendsnow.org/blog/modern-fence-designs',
      niche: body.niche || 'Home & Garden Architecture',
      slug: body.slug || 'modern-fence-designs',
      domain: body.domain || 'www.moderntrendsnow.org',
      excerpt: body.excerpt,
      authorName: body.authorName
    };

    const campaign = await generatePinterestCampaign(input);

    return NextResponse.json({
      success: true,
      message: 'Generated 5 viral Pinterest pins on complete autopilot',
      campaign
    });
  } catch (error) {
    console.error('[Pinterest API Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
