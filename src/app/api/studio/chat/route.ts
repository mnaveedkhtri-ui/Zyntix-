import { NextResponse } from 'next/server';
import { failoverShield } from '@/lib/failover-shield';
import { getSiteById, saveOrUpdateSite, SiteConfig, BlogPost } from '@/lib/sites';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, siteId, currentSite } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const targetSite: SiteConfig = currentSite || (siteId ? getSiteById(siteId) : null) || {
      id: 'site-default-demo',
      subdomain: 'demo',
      name: 'Meridian Craft & Architecture',
      tagline: 'Architectural Craftsmanship, Sustainable Engineering & Thoughtful Construction',
      description: 'An independent architectural studio and research journal dedicated to timeless masonry, sustainable timber framing, and grounded regional engineering.',
      niche: 'Architecture & Craftsmanship',
      location: 'Austin, Texas',
      author: {
        name: 'Julian Vance',
        credentials: 'AIA & Master Timber Artisan',
        bio: 'Practicing architect and timber framer with 22 years of field experience in historic restoration across Central Texas.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      stats: [
        { label: 'Commissioned Projects', value: '48+' },
        { label: 'Heritage Craftsmanship', value: '18 Yrs' },
        { label: 'Avg Structural Lifespan', value: '100+ Yrs' },
        { label: 'Sustainable Timber & Stone', value: '100%' }
      ],
      navigation: [
        { label: 'Services', href: '#services' },
        { label: 'Journal', href: '/site/demo/blog' },
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      services: [
        {
          title: 'Monolithic Stone Restoration',
          description: 'Specialized structural restoration for historic masonry envelopes and non-hydraulic lime mortar stabilization.'
        },
        {
          title: 'Timber Frame Engineering',
          description: 'Traditional mortise-and-tenon structural timber design engineered for 100-year seismic and environmental durability.'
        },
        {
          title: 'Passive Climate Envelopes',
          description: 'High-thermal mass building envelopes calculated for passive solar gain and natural cross-ventilation.'
        }
      ],
      posts: [],
      aboutContent: {
        mission: 'To practice architecture as an enduring discipline of durable materials, honest proportions, and regional stewardship.',
        history: 'Founded in 2008 as a cooperative timber framing guild in Austin, Texas.',
        values: [
          'Zero synthetic shortcuts or fake veneers',
          'Locally sourced limestone and heavy timbers',
          'Complete transparency in structural drawings',
          'Lifetime client consultation warranties'
        ]
      },
      contact: {
        email: 'studio@meridiancraft.com',
        phone: '+1 (512) 894-3920',
        address: '742 Congress Ave, Austin, TX 78701'
      },
      seo: {
        keywords: ['architecture', 'masonry', 'timber framing', 'austin architects']
      }
    };

    const systemInstruction = `You are the Master Autonomous Web & Editorial Architect for Zyntix.
Your job is to understand whatever the user requests in natural language (in English, Urdu, Hindi, or any language) and customize or generate the client's website accordingly.

CRITICAL RULES:
1. Always respond in fluent, polished, and professional ENGLISH in the "reply" field.
2. Maintain a quiet, high-integrity, human-crafted editorial aesthetic (no AI buzzwords, no cheap sales hype).
3. If the user asks to modify the site (e.g., change name, change location, update services, change contact details, write a new essay/article, update author, or completely redesign for a new niche like legal, medical, automotive, hospitality, etc.):
   - You must generate the complete updated site configuration.
   - If they ask for a new essay/article, generate a high-depth human essay with [AEO_ANSWER]:, markdown sections, high-res Unsplash cover image, read time, and thoughtful field notes.
4. Always respond strictly in valid JSON matching this schema:
{
  "reply": "Professional English explanation of what you updated or created.",
  "action": "update_site" | "create_site" | "add_post" | "general_chat",
  "site": {
    "id": "string",
    "subdomain": "string",
    "name": "string",
    "tagline": "string",
    "description": "string",
    "niche": "string",
    "location": "string",
    "author": {
      "name": "string",
      "credentials": "string",
      "bio": "string",
      "avatar": "string"
    },
    "stats": [
      { "label": "string", "value": "string" }
    ],
    "services": [
      { "title": "string", "description": "string" }
    ],
    "posts": [
      {
        "slug": "string",
        "title": "string",
        "excerpt": "string",
        "date": "string",
        "readTime": "string",
        "category": "string",
        "coverImage": "string",
        "content": ["string"]
      }
    ],
    "aboutContent": {
      "mission": "string",
      "history": "string",
      "values": ["string"]
    },
    "contact": {
      "email": "string",
      "phone": "string",
      "address": "string"
    }
  }
}
Do NOT output any markdown backticks outside the JSON. Only return the raw JSON string.`;

    const prompt = `Current Site Context:
${JSON.stringify({
  subdomain: targetSite.subdomain,
  name: targetSite.name,
  niche: targetSite.niche,
  location: targetSite.location,
  servicesCount: targetSite.services?.length,
  postsCount: targetSite.posts?.length,
  author: targetSite.author?.name
})}

User Request: "${message}"

Generate the appropriate JSON response updating or configuring the site precisely as requested:`;

    const aiRes = await failoverShield.callWithFailover(prompt, systemInstruction);
    let parsed: any = null;

    try {
      const cleaned = aiRes.text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      // Fallback regex extractor if LLM added formatting
      const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse AI JSON', e);
        }
      }
    }

    if (!parsed || !parsed.site) {
      return NextResponse.json({
        success: true,
        reply: `I have received your instruction: "${message}". I am refining your publication according to your exact requirements.`,
        site: targetSite,
        provider: aiRes.provider
      });
    }

    // Merge and persist updated site
    const updatedSite: SiteConfig = {
      ...targetSite,
      ...parsed.site,
      id: targetSite.id,
      subdomain: targetSite.subdomain,
      updatedAt: new Date().toISOString()
    };

    saveOrUpdateSite(updatedSite);

    return NextResponse.json({
      success: true,
      reply: parsed.reply || `I have successfully updated ${updatedSite.name} according to your instructions.`,
      action: parsed.action || 'update_site',
      site: updatedSite,
      provider: aiRes.provider
    });

  } catch (error: any) {
    console.error('Studio chat error:', error);
    return NextResponse.json(
      { success: false, error: String(error?.message || error) },
      { status: 500 }
    );
  }
}
