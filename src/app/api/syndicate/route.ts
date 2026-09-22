import { NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds max duration

export async function POST(request: Request) {
  try {
    const { url, title, description, location, keywords } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch the source content (Simulated or actual fetch if needed)
    // For MVP, we extract keywords from the URL or title to feed the AI.
    const baseTopic = title || url.split('/').pop()?.replace(/-/g, ' ') || 'technology';
    const seoKeywords = keywords || baseTopic;
    const geoTarget = location || 'Global';

    // 2. Unsplash Image Fetch
    let featureImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
    try {
      const unsplashRes = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(baseTopic)}&per_page=1`);
      if (unsplashRes.ok) {
        const unsplashData = await unsplashRes.json();
        if (unsplashData?.results?.length > 0) {
          featureImage = unsplashData.results[0].urls.regular;
        }
      }
    } catch (err) {
      console.log('Unsplash fetch failed, using fallback.', err);
    }

    // 3. Entity-Based Semantic Rewrite via Pollinations AI
    // We strictly enforce AEO (Bullet points), GEO (Location), and SEO (Entities)
    const systemPrompt = `You are a world-class Semantic SEO and AEO Expert. Your task is to rewrite or summarize the topic: "${baseTopic}".
    Target Location (GEO): ${geoTarget}
    Target Keywords: ${seoKeywords}
    
    STRICT RULES:
    1. Entity-Dense: Use related entities, natural language processing concepts, and LSI keywords naturally. Do not keyword stuff.
    2. AEO Optimized: Include at least one bulleted list and direct Q&A formats so AI search engines (ChatGPT/Perplexity) can easily parse it.
    3. GEO Optimized: Mention the target location naturally if applicable.
    4. Information Gain: Provide a unique perspective, don't just repeat basic facts.
    5. Output valid HTML format only (<h1>, <p>, <h2>, <ul>, <li>). Do not use markdown backticks.
    6. Ensure the tone is highly professional and engaging.`;

    let generatedHtml = "";
    try {
      const pollinationsRes = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Generate the complete optimized article HTML.' }
          ],
          model: 'openai'
        })
      });
      if (pollinationsRes.ok) {
        generatedHtml = await pollinationsRes.text();
      } else {
        throw new Error('AI generation failed');
      }
    } catch (err) {
      // Fallback dummy HTML if AI fails
      generatedHtml = `
        <h1>Comprehensive Guide to ${baseTopic}</h1>
        <p>This is a highly optimized semantic article targeting ${geoTarget}...</p>
        <h2>Key Takeaways</h2>
        <ul><li>High authority</li><li>Entity optimization</li></ul>
      `;
    }

    // 4. Generate Meta Data
    const metaTitle = `Ultimate Guide to ${baseTopic} - ${geoTarget}`;
    const metaDescription = `Discover the best insights on ${seoKeywords} in ${geoTarget}. Fully optimized semantic guide for experts.`;

    // 5. Build the Final Output
    const finalPostHTML = `
      <div class="web2-post">
        <img src="${featureImage}" alt="${baseTopic}" style="width:100%; border-radius:10px; margin-bottom:20px;" />
        ${generatedHtml}
        <br/><br/>
        <hr/>
        <p><em>Read the original full article at: <a href="${url}">${url}</a></em></p>
      </div>
    `;

    // In a real application, here we would iterate over the user's connected OAuth platforms 
    // (Medium, Blogger, LinkedIn) and send 'finalPostHTML' via their respective APIs.
    
    return NextResponse.json({
      success: true,
      metaTitle,
      metaDescription,
      featureImage,
      content: finalPostHTML
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
