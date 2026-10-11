/**
 * Zyntix Autonomous Pinterest Traffic Machine - Pinterest SEO & Metadata Generator
 * - Pin Title strictly < 100 characters with high search intent
 * - Pin Description strictly < 500 characters with 4-6 high-volume hashtags
 * - Destination URL with UTM tracking parameters
 * - Recommended Pinterest Boards
 */

import { HookAngle, PinSeoMetadata } from './types';

export interface SeoGenerationOptions {
  angle: HookAngle;
  articleTitle: string;
  articleUrl: string;
  niche: string;
  slug: string;
  domain: string;
  excerpt?: string;
}

/**
 * Generates Pinterest search-optimized metadata for an individual pin angle
 */
export function generatePinSeoMetadata(options: SeoGenerationOptions): PinSeoMetadata {
  const { angle, articleTitle, articleUrl, niche, slug, domain, excerpt } = options;

  // 1. Keyword-stuffed Pin Title (< 100 chars)
  const pinTitle = buildPinTitle(angle.headline, articleTitle, niche);

  // 2. High-volume Pinterest hashtags (4-6 tags)
  const hashtags = generatePinterestHashtags(articleTitle, niche, angle.angleType);

  // 3. Search-optimized Pin Description (< 500 chars)
  const pinDescription = buildPinDescription({
    angle,
    articleTitle,
    niche,
    domain,
    excerpt,
    hashtags
  });

  // 4. Destination URL with UTM tracking
  const destinationUrl = buildUtmDestinationUrl(articleUrl, slug, angle.angleType);

  // 5. Recommended Pinterest Board
  const boardName = recommendPinterestBoard(niche, articleTitle);

  return {
    title: pinTitle,
    description: pinDescription,
    hashtags,
    destinationUrl,
    boardName
  };
}

/**
 * Builds Pinterest title under 100 characters with highest keyword density
 */
function buildPinTitle(headline: string, articleTitle: string, niche: string): string {
  let title = headline.trim();
  
  // Append niche if short
  if (title.length < 70) {
    const cleanNiche = niche.split('&')[0].trim();
    if (!title.toLowerCase().includes(cleanNiche.toLowerCase())) {
      title = `${title} | ${cleanNiche}`;
    }
  }

  // Strict cut to 98 chars max to prevent truncation
  if (title.length > 98) {
    const cut = title.slice(0, 95);
    const lastSpace = cut.lastIndexOf(' ');
    title = (lastSpace > 75 ? cut.slice(0, lastSpace) : cut).trim();
  }

  return title;
}

/**
 * Builds high-intent description under 500 characters
 */
function buildPinDescription(params: {
  angle: HookAngle;
  articleTitle: string;
  niche: string;
  domain: string;
  excerpt?: string;
  hashtags: string[];
}): string {
  const { angle, articleTitle, niche, domain, excerpt, hashtags } = params;
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Opening hook
  const hook = angle.subheadline || `Looking for ${articleTitle}? Here is the complete practical breakdown.`;

  // Body value
  const context = excerpt 
    ? excerpt.replace(/\[AEO_ANSWER\]:\s*/gi, '').slice(0, 160)
    : `Discover expert techniques, practical design tips, and structural craftsmanship for ${niche}.`;

  // Call to action
  const cta = `👉 Tap through to ${cleanDomain} for all design ideas and full project guide!`;

  // Hashtags line
  const tagsLine = hashtags.map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ');

  let fullDescription = `${hook} ${context} ${cta}\n\n${tagsLine}`.trim();

  // Enforce strict limit under 490 chars
  if (fullDescription.length > 490) {
    const excess = fullDescription.length - 490;
    const shortenedContext = context.slice(0, Math.max(context.length - excess - 10, 40));
    fullDescription = `${hook} ${shortenedContext}... ${cta}\n\n${tagsLine}`.trim();
  }

  return fullDescription;
}

/**
 * Builds clean UTM tracking destination URL
 */
function buildUtmDestinationUrl(baseArticleUrl: string, slug: string, angleType: string): string {
  const urlObj = new URL(baseArticleUrl.startsWith('http') ? baseArticleUrl : `https://${baseArticleUrl}`);
  urlObj.searchParams.set('utm_source', 'pinterest');
  urlObj.searchParams.set('utm_medium', 'organic_pin');
  urlObj.searchParams.set('utm_campaign', slug);
  urlObj.searchParams.set('utm_content', angleType);
  return urlObj.toString();
}

/**
 * Generates 4-6 high-volume viral Pinterest hashtags tailored to niche and angle
 */
export function generatePinterestHashtags(title: string, niche: string, angleType: string): string[] {
  const baseHashtags: Record<string, string[]> = {
    architecture: ['ArchitectureLovers', 'TimberFraming', 'HomeDesign', 'SustainableLiving', 'ModernHouse', 'Craftsmanship'],
    fence: ['FenceDesign', 'BackyardPrivacy', 'CurbAppeal', 'HomeImprovement', 'BackyardIdeas', 'ModernFence'],
    garden: ['GardenInspiration', 'BackyardOasis', 'OutdoorLiving', 'LandscapeDesign', 'GardenGoals', 'HomeGarden'],
    decor: ['HomeDecor', 'InteriorDesign', 'ModernHome', 'AestheticHome', 'DecorInspo', 'DIYHome'],
    construction: ['Woodworking', 'DIYProjects', 'ContractorLife', 'HomeRenovation', 'BuildingDesign', 'TimberWork']
  };

  const matchedKey = Object.keys(baseHashtags).find(k => 
    title.toLowerCase().includes(k) || niche.toLowerCase().includes(k)
  ) || 'architecture';

  const tags = [...baseHashtags[matchedKey]];

  // Angle-specific bonus tag
  if (angleType === 'problem_solver') tags.push('BudgetDIY');
  if (angleType === 'mistake_warning') tags.push('HomeHacks');
  if (angleType === 'comparison') tags.push('CostGuide');
  if (angleType === 'aesthetic_showcase') tags.push('DesignInspo');

  // Return strictly 5-6 hashtags
  return Array.from(new Set(tags)).slice(0, 6);
}

/**
 * Suggests the highest converting Pinterest Board Name
 */
function recommendPinterestBoard(niche: string, title: string): string {
  const lower = (niche + ' ' + title).toLowerCase();
  if (lower.includes('fence') || lower.includes('backyard') || lower.includes('garden')) {
    return 'Modern Backyard & Outdoor Living';
  }
  if (lower.includes('timber') || lower.includes('wood') || lower.includes('craftsmanship')) {
    return 'Architectural Craftsmanship & Timber Design';
  }
  if (lower.includes('interior') || lower.includes('decor')) {
    return 'Modern Home Interior & Architecture';
  }
  return 'Architectural Design & Modern Trends';
}
