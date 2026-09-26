import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { keyword, targetUrl, language, count } = await req.json();

    const GITHUB_TOKEN = process.env.GITHUB_PAT;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Helper to generate content (With Fallback if Quota is reached)
    const generateArticle = async (sectionNum: number) => {
      // Fallback Template (In case API fails or quota is reached)
      const fallbackContent = `## Essential Strategies for ${keyword}

When looking into ${keyword}, it is crucial to understand the fundamental mechanics that drive success in this area. Industry experts consistently highlight that approaching this with a well-structured methodology yields the best long-term results. 

### Why This Matters in 2026
Implementing the right techniques for ${keyword} not only builds local authority but also establishes a strong foundation for semantic entity trust. This ensures that your brand remains visible, relevant, and authoritative across all search engines.

*   **Consistency:** Keep your NAP (Name, Address, Phone) consistent.
*   **Authority:** Leverage high DA cloud assets to push power.
*   **Relevance:** Ensure your semantic entities match user intent.

By focusing on these core pillars, businesses can effectively dominate their local niche and secure top placements.`;

      if (!GEMINI_API_KEY) {
        return fallbackContent;
      }

      try {
        const prompt = `Write a comprehensive, highly SEO-optimized article section about '${keyword}'. Language: ${language}. Strict Guidelines: 1. Start with an engaging H2 heading. 2. Write natural, human-like content. 3. Include LSI keywords. 4. Include bullet points. 5. Format strictly in Markdown. Length: 300 words.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        
        if (!response.ok) throw new Error('API Quota or Auth Error');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackContent;
      } catch (error) {
        console.warn("AI Generation Failed (Quota limit etc). Using Fallback SEO Content.");
        return fallbackContent;
      }
    };

    const createGist = async (title: string, content: string) => {
      const filename = `${title.replace(/ /g, '_').toLowerCase()}.md`;
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ZyntixBot/3.0'
        },
        body: JSON.stringify({
          description: `SEO Entity Stack for ${title}`,
          public: true,
          files: { [filename]: { content } }
        })
      });
      
      if (response.status === 201) {
        const data = await response.json();
        return data.html_url;
      }
      return null;
    };
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let previousUrl = null;
        
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'info', message: `Starting Anti-Ban AI Silo Generation for: ${keyword} in ${language}` }) + '\n'));

        for (let i = 1; i <= count; i++) {
          const title = `${keyword} Part ${i}`;
          
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'info', message: `[${i}/${count}] Generating content (AI/Fallback)...` }) + '\n'));
          const aiArticle = await generateArticle(i);
          
          let content = `# ${keyword} - Ultimate Guide (Part ${i})\n\n`;
          content += aiArticle + "\n\n---\n";
          
          if (previousUrl) {
            content += `🔙 **Previous Concept:** Read more here: [Previous Node](${previousUrl})\n\n`;
          }
          content += `👉 **Main Resource:** Visit our main site for more details: [Money Site](${targetUrl})\n`;

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'info', message: `[${i}/${count}] Publishing to GitHub API...` }) + '\n'));
          const gistUrl = await createGist(title, content);
          
          if (gistUrl) {
            previousUrl = gistUrl;
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'success', url: gistUrl, message: `Successfully created Gist ${i}` }) + '\n'));
          }

          if (i < count) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'info', message: `[Anti-Ban] Waiting to simulate human behavior...` }) + '\n'));
            await new Promise(r => setTimeout(r, 2000)); 
          }
        }
        
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', message: 'Silo Generation Complete!' }) + '\n'));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
