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
Your absolute number one priority is 100% CUSTOMER DELIGHT and ZERO DISAPPOINTMENT.

CUSTOMER SATISFACTION DIRECTIVES:
1. THE CUSTOMER IS ALWAYS 100% RIGHT: Whatever the client requests (any business name, city, location, phone, email, tone, colors, services, pricing, or custom blog topics), you MUST execute it precisely without pushback, hesitation, or unsolicited arguments. Follow their exact vision.
2. SURGICAL UPDATES WITH COMPLETE PRESERVATION: When updating requested fields (e.g. they say "change phone number to 555-0199" or "add a roofing service"), PRESERVE all other existing site details (articles, founder bio, values, description) so nothing is lost or accidentally erased.
3. AUTHORITATIVE 1,200+ WORD MONOGRAPHS ON DEMAND: If the client asks to write, generate, or add blog posts or articles, NEVER produce short 2-3 paragraph stubs. Every article MUST be an authoritative, in-depth technical monograph with at least 15-25 rich content blocks containing:
   - "[AEO_ANSWER]: Complete direct executive answer answering the core user inquiry in 40-60 words for Google Answer Box (#0 rich snippet)."
   - Rich introductory paragraphs setting deep historical, physical, or technical context.
   - At least 3-5 H2 sections ("### Heading Title") and H3 subheadings ("#### Subheading Title").
   - Seamless internal links: e.g. "[our specialized services](/#services)", "[contact our studio](/#contact)", or linking to other articles "[related field inquiry](/blog/slug)".
   - Authoritative external citations: reputable industry standards/institutions with HTTPS links, e.g. "[American Institute of Architects (AIA)](https://www.aia.org)", "[ASHRAE Standard 90.1](https://www.ashrae.org)", "[National Park Service](https://www.nps.gov)", "[ASTM Standards](https://www.astm.org)".
   - 2-3 high-resolution Unsplash figure plates: "![Detailed descriptive caption](https://images.unsplash.com/photo-...)"
   - Blockquotes: '> "Authoritative pull quote or technical axiom."'
   - Numbered takeaways: "1. Detailed takeaway...", "2. Detailed takeaway..."
   - Structured FAQ section for Google FAQ schema rich results: At least 3-4 entries formatted as "**Question in bold ending with question mark?** Complete technical answer with actionable detail."
4. REASSURING, PROFESSIONAL ENGLISH: In the "reply" field, always respond in articulate, polite, and reassuring professional English. Explicitly confirm the exact items that you modified or created, and invite them to view the live preview.
5. ALWAYS RETURN VALID JSON matching this schema:
{
  "reply": "Polite and reassuring professional English confirmation of what was updated or created.",
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
Do NOT output any markdown backticks outside the JSON. Return only the raw JSON.`;

    // Deterministic Extraction for Contact info (Phone / Email / Google Verification)
    const phoneMatch = message.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}|\+\d{9,16}/);
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const googleVerifyMatch = message.match(/google-site-verification["'\s:=]+(["']?)([a-zA-Z0-9_-]{20,65})\1/i) 
      || message.match(/content=["']([a-zA-Z0-9_-]{20,65})["']/i)
      || message.match(/\b([a-zA-Z0-9_-]{43})\b/);
    const extractedGoogleVerify = googleVerifyMatch ? (googleVerifyMatch[2] || googleVerifyMatch[1]) : null;

    const prompt = `Current Site Context:
${JSON.stringify({
  subdomain: targetSite.subdomain,
  name: targetSite.name,
  tagline: targetSite.tagline,
  niche: targetSite.niche,
  location: targetSite.location,
  author: targetSite.author,
  contact: targetSite.contact,
  googleVerification: targetSite.googleVerification,
  services: targetSite.services?.map(s => ({ title: s.title, description: s.description })),
  postsCount: targetSite.posts?.length,
}, null, 2)}

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
      if (phoneMatch || emailMatch || extractedGoogleVerify) {
        const directContact = { ...(targetSite.contact || {}) };
        if (phoneMatch) directContact.phone = phoneMatch[0].trim();
        if (emailMatch) directContact.email = emailMatch[0].trim();
        const directUpdatedSite: SiteConfig = {
          ...targetSite,
          contact: directContact,
          googleVerification: extractedGoogleVerify || targetSite.googleVerification,
          updatedAt: new Date().toISOString()
        };
        saveOrUpdateSite(directUpdatedSite);
        let respMsg = "I have updated your publication.";
        if (extractedGoogleVerify) {
          respMsg = `I have successfully verified and added your Google Site Verification meta tag (${extractedGoogleVerify}) to your publication's HTML head metadata. You can now click Verify in Google Search Console!`;
        } else if (phoneMatch || emailMatch) {
          respMsg = `Your contact information has been updated. The phone number is now set to ${directContact.phone || "unchanged"} and email to ${directContact.email || "unchanged"}. Please review the live preview to confirm everything looks correct.`;
        }
        return NextResponse.json({
          success: true,
          reply: respMsg,
          site: directUpdatedSite,
          provider: aiRes.provider
        });
      }

      return NextResponse.json({
        success: true,
        reply: `I have received your instruction: "${message}". I am refining your publication according to your exact requirements.`,
        site: targetSite,
        provider: aiRes.provider
      });
    }

    // Handle post deletion or replacement vs intelligent preservation
    const isWipeOrReplace = /\b(delet|delete|remove|wipe|replace|fresh|clean)\b/i.test(message) && /\b(blog|blogs|post|posts|article|articles)\b/i.test(message);

    let finalPosts = targetSite.posts || [];
    if (Array.isArray(parsed.site.posts) && parsed.site.posts.length > 0) {
      if (isWipeOrReplace) {
        finalPosts = parsed.site.posts;
      } else {
        const existingSlugs = new Set(finalPosts.map((p: any) => p.slug));
        const newPosts = parsed.site.posts.filter((p: any) => !existingSlugs.has(p.slug));
        const updatedExisting = finalPosts.map((p: any) => {
          const found = parsed.site.posts.find((np: any) => np.slug === p.slug);
          return found ? { ...p, ...found } : p;
        });
        finalPosts = [...newPosts, ...updatedExisting];
      }
    } else if (isWipeOrReplace) {
      finalPosts = [];
    }

    // Deep merge contact and author
    const updatedContact = {
      ...(targetSite.contact || {}),
      ...(parsed.site.contact || {}),
    };
    if (phoneMatch) {
      updatedContact.phone = phoneMatch[0].trim();
    }
    if (emailMatch) {
      updatedContact.email = emailMatch[0].trim();
    }

    const updatedAuthor = {
      ...(targetSite.author || {}),
      ...(parsed.site.author || {}),
    };

    const updatedAbout = {
      ...(targetSite.aboutContent || {}),
      ...(parsed.site.aboutContent || {}),
    };

    // Merge and persist updated site with 100% data preservation
    const updatedSite: SiteConfig = {
      ...targetSite,
      ...parsed.site,
      id: targetSite.id,
      subdomain: targetSite.subdomain,
      author: updatedAuthor,
      contact: updatedContact,
      aboutContent: updatedAbout,
      googleVerification: extractedGoogleVerify || parsed.site.googleVerification || targetSite.googleVerification,
      customDomain: parsed.site.customDomain !== undefined ? parsed.site.customDomain : targetSite.customDomain,
      posts: finalPosts,
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
