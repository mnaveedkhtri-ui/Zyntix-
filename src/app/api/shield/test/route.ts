import { NextResponse } from 'next/server';
import { failoverShield } from '@/lib/failover-shield';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || 'Summarize the core tenets of timeless craftsmanship in 3 sentences.';

    const result = await failoverShield.executeWithFailover(
      prompt,
      'You are an authoritative editor writing for a prestigious publication. Write in a thoughtful, calm, and grounded voice.'
    );

    return NextResponse.json({
      success: true,
      provider: result.provider,
      output: result.text
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
