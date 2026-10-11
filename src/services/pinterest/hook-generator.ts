/**
 * Zyntix Autonomous Pinterest Traffic Machine - 5-Angle Hook Generator
 * Connects to Google Gemini 1.5 Flash with Groq Llama 3.3 70B failsafe.
 * Extracts 5 distinct viral psychological angles for maximum CTR & Saves.
 */

import { failoverShield } from '@/lib/failover-shield';
import { HookAngle, PsychologicalAngleType, VisualTheme } from './types';

interface RawAngleResult {
  angleType: PsychologicalAngleType;
  badgeText: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imagePrompt: string;
}

// Preset visual themes calibrated for high Pinterest CTR and anti-ban visual variation
const THEMES_BY_ANGLE: Record<PsychologicalAngleType, VisualTheme> = {
  listicle: {
    badgeBg: '#f59e0b', // Amber Gold
    badgeTextColor: '#000000',
    accentColor: '#fbbf24',
    gradientStart: 'rgba(15, 23, 42, 0.92)',
    gradientEnd: 'rgba(15, 23, 42, 0.98)',
    badgePosition: 'left',
    headlineSize: 66,
    fontFamily: 'Montserrat, sans-serif'
  },
  problem_solver: {
    badgeBg: '#10b981', // Emerald Growth
    badgeTextColor: '#ffffff',
    accentColor: '#34d399',
    gradientStart: 'rgba(6, 78, 59, 0.88)',
    gradientEnd: 'rgba(2, 44, 34, 0.97)',
    badgePosition: 'center',
    headlineSize: 62,
    fontFamily: 'system-ui, sans-serif'
  },
  mistake_warning: {
    badgeBg: '#ef4444', // Warning Crimson
    badgeTextColor: '#ffffff',
    accentColor: '#f87171',
    gradientStart: 'rgba(69, 10, 10, 0.90)',
    gradientEnd: 'rgba(24, 24, 27, 0.98)',
    badgePosition: 'left',
    headlineSize: 68,
    fontFamily: 'Impact, sans-serif'
  },
  aesthetic_showcase: {
    badgeBg: '#8b5cf6', // Aesthetic Violet
    badgeTextColor: '#ffffff',
    accentColor: '#c084fc',
    gradientStart: 'rgba(30, 27, 75, 0.85)',
    gradientEnd: 'rgba(15, 15, 26, 0.98)',
    badgePosition: 'right',
    headlineSize: 60,
    fontFamily: 'Georgia, serif'
  },
  comparison: {
    badgeBg: '#3b82f6', // Blueprint Blue
    badgeTextColor: '#ffffff',
    accentColor: '#60a5fa',
    gradientStart: 'rgba(30, 58, 138, 0.88)',
    gradientEnd: 'rgba(15, 23, 42, 0.98)',
    badgePosition: 'center',
    headlineSize: 64,
    fontFamily: 'Trebuchet MS, sans-serif'
  }
};

/**
 * Generates 5 distinct psychological angles for any article
 */
export async function generate5HookAngles(
  articleTitle: string,
  niche: string,
  excerpt?: string
): Promise<HookAngle[]> {
  const prompt = `You are a viral Pinterest growth engineer and psychological copywriter.
Generate exactly 5 distinct Pinterest Hook Angles for the following article:

ARTICLE TITLE: "${articleTitle}"
NICHE: "${niche}"
EXCERPT/CONTEXT: "${excerpt || 'High-value practical guide and architectural craftsmanship'}"

You must return a strictly valid JSON array of exactly 5 objects representing these 5 psychological angles:
1. "listicle": High-converting numbers-driven listicle (e.g. "15+ Modern High Fence Ideas That Add Instant Curb Appeal")
2. "problem_solver": Step-by-step practical solution on a budget (e.g. "How to Build a High Privacy Fence on a Budget")
3. "mistake_warning": Urgent warning or common expensive mistake (e.g. "3 Fence Design Mistakes You'll Regret Next Summer")
4. "aesthetic_showcase": Pure aesthetic inspiration and visual dream (e.g. "Minimalist Black Horizontal High Fence Inspiration")
5. "comparison": Direct Versus/Cost breakdown (e.g. "Wood vs. Composite High Fencing: The Honest Cost Breakdown")

For each object, provide:
- "angleType": one of ["listicle", "problem_solver", "mistake_warning", "aesthetic_showcase", "comparison"]
- "badgeText": short 2-4 word punchy badge in ALL CAPS (e.g. "CURB APPEAL", "BUDGET GUIDE", "AVOID THIS", "DESIGN INSPOS", "COST BREAKDOWN")
- "headline": high-impact, bold headline under 65 characters optimized for Pinterest mobile readability
- "subheadline": 1 short supporting sentence that creates curiosity or promises instant value
- "ctaText": high CTR call to action starting with an emoji (e.g. "👉 Tap to View All Designs", "👉 See Step-by-Step Guide")
- "imagePrompt": photorealistic photographic description for an image generator matching this angle, natural lighting, documentary style, no text, no watermark

OUTPUT FORMAT: Return ONLY the JSON array inside a \`\`\`json markdown block. Do not add conversational text.`;

  try {
    const aiResponse = await failoverShield.callWithFailover(
      prompt,
      'You are a high-converting Pinterest growth engineer. Always respond with pure, valid JSON arrays.'
    );

    const parsed = parseAnglesJson(aiResponse.text);
    if (parsed && parsed.length >= 5) {
      return formatAnglesWithThemes(parsed);
    }
  } catch (error) {
    console.warn('[Pinterest Hook Generator] AI generation failed, falling back to deterministic synthesis:', error);
  }

  // Deterministic Algorithmic Fallback ensures 0 downtime and 100% reliable execution
  return getDeterministicHookAngles(articleTitle, niche);
}

/**
 * Robust JSON extraction from LLM response
 */
function parseAnglesJson(rawText: string): RawAngleResult[] | null {
  try {
    // Strip markdown code fences
    const clean = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();

    // Find JSON array bounds
    const startIdx = clean.indexOf('[');
    const endIdx = clean.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1) return null;

    const jsonSub = clean.slice(startIdx, endIdx + 1);
    const data = JSON.parse(jsonSub);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('[Pinterest Hook Generator] Failed to parse JSON response:', e);
  }
  return null;
}

/**
 * Formats parsed angles and attaches tailored visual themes
 */
function formatAnglesWithThemes(rawAngles: RawAngleResult[]): HookAngle[] {
  const angleOrder: PsychologicalAngleType[] = [
    'listicle',
    'problem_solver',
    'mistake_warning',
    'aesthetic_showcase',
    'comparison'
  ];

  return rawAngles.slice(0, 5).map((raw, idx) => {
    const angleType = (raw.angleType || angleOrder[idx] || 'listicle') as PsychologicalAngleType;
    const theme = THEMES_BY_ANGLE[angleType] || THEMES_BY_ANGLE.listicle;

    return {
      id: `pin-angle-${idx + 1}-${angleType}`,
      angleType,
      angleName: getAngleDisplayName(angleType),
      badgeText: (raw.badgeText || 'MUST SEE GUIDE').toUpperCase().slice(0, 24),
      headline: cleanHeadline(raw.headline || 'High-Converting Practical Design Ideas'),
      subheadline: raw.subheadline || 'Explore practical step-by-step techniques and craftsmanship.',
      ctaText: raw.ctaText || '👉 Tap to Read Full Guide',
      imagePrompt: raw.imagePrompt || 'photorealistic architecture craftsmanship, 35mm photography, warm natural daylight, no text',
      visualTheme: {
        ...theme,
        // Dynamic font size variation for anti-ban visual difference
        headlineSize: theme.headlineSize + (idx % 2 === 0 ? 2 : -2)
      }
    };
  });
}

function getAngleDisplayName(type: PsychologicalAngleType): string {
  switch (type) {
    case 'listicle': return 'High-Converting Listicle';
    case 'problem_solver': return 'Step-by-Step Problem Solver';
    case 'mistake_warning': return 'Common Mistake & Warning';
    case 'aesthetic_showcase': return 'Visual Aesthetic Showcase';
    case 'comparison': return 'Cost & Material Comparison';
  }
}

function cleanHeadline(headline: string): string {
  return headline.replace(/^["']|["']$/g, '').trim().slice(0, 75);
}

/**
 * Deterministic fallback generator when AI APIs are down or unreachable
 */
function getDeterministicHookAngles(articleTitle: string, niche: string): HookAngle[] {
  const cleanTitle = articleTitle.replace(/^\d+[\s.-]*/, '').trim();

  const fallbackList: RawAngleResult[] = [
    {
      angleType: 'listicle',
      badgeText: 'CURB APPEAL INSPOS',
      headline: `12+ ${cleanTitle} Ideas That Add Instant Value`,
      subheadline: 'The complete architectural breakdown to transform your space today.',
      ctaText: '👉 Tap to View All Designs',
      imagePrompt: `modern ${cleanTitle}, photorealistic architectural design, warm ambient light, high quality`
    },
    {
      angleType: 'problem_solver',
      badgeText: 'STEP-BY-STEP GUIDE',
      headline: `How to Build ${cleanTitle} on a Realistic Budget`,
      subheadline: 'Smart structural techniques that save thousands in materials.',
      ctaText: '👉 See the Budget Breakdown',
      imagePrompt: `${cleanTitle} construction and craftsmanship, natural daylight, timber woodwork`
    },
    {
      angleType: 'mistake_warning',
      badgeText: 'CRITICAL MISTAKE',
      headline: `3 ${cleanTitle} Mistakes You Will Regret Later`,
      subheadline: 'Avoid these costly structural errors before you begin your project.',
      ctaText: '👉 Learn What to Avoid',
      imagePrompt: `${cleanTitle} architectural detail, raw texture, authentic photography`
    },
    {
      angleType: 'aesthetic_showcase',
      badgeText: 'AESTHETIC INSPIRATION',
      headline: `Minimalist & Modern ${cleanTitle} Inspiration`,
      subheadline: 'Timeless architectural aesthetics designed for modern lifestyles.',
      ctaText: '👉 Tap for Visual Inspiration',
      imagePrompt: `minimalist aesthetic ${cleanTitle}, clean lines, cinematic natural light`
    },
    {
      angleType: 'comparison',
      badgeText: 'MATERIAL COMPARISON',
      headline: `${cleanTitle}: Wood vs. Modern Alternatives Compared`,
      subheadline: 'An honest review of longevity, maintenance costs, and durability.',
      ctaText: '👉 See Honest Comparison',
      imagePrompt: `side by side materials comparison for ${cleanTitle}, craftsmanship studio`
    }
  ];

  return formatAnglesWithThemes(fallbackList);
}
