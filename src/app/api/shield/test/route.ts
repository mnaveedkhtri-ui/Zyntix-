import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rawGemini = process.env.GEMINI_KEY_POOL || process.env.GEMINI_API_KEY || '';
    const geminiKey = rawGemini.split(',')[0]?.trim();
    const groqKey = process.env.GROQ_API_KEY || '';

    let geminiModels: string[] = [];
    let groqModels: string[] = [];

    if (geminiKey) {
      try {
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const gData = await gRes.json();
        if (gData.models) {
          geminiModels = gData.models.map((m: any) => m.name.replace('models/', ''));
        }
      } catch (e: any) {
        geminiModels = [e.message];
      }
    }

    if (groqKey) {
      try {
        const grRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${groqKey}` }
        });
        const grData = await grRes.json();
        if (grData.data) {
          groqModels = grData.data.map((m: any) => m.id);
        }
      } catch (e: any) {
        groqModels = [e.message];
      }
    }

    return NextResponse.json({ geminiModels, groqModels });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
