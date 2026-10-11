/**
 * Zyntix Autonomous Pinterest Traffic Machine - Master Pipeline
 * Single orchestrator: takes article title & URL -> returns 5 complete viral pins
 * with generated 1000x1500 graphics, SEO metadata, and anti-ban drip schedule.
 */

import { generate5HookAngles } from './hook-generator';
import { generatePinSeoMetadata } from './seo-metadata';
import { generateDripSchedule, VIRAL_TIME_SLOTS } from './anti-ban';
import { generatePinSvgMarkup, buildPollinationsBackgroundUrl } from './image-engine';
import {
  PinterestCampaignInput,
  PinterestCampaignResult,
  GeneratedPin
} from './types';

// Global Campaign & Pin Store (persists pins across runtime requests for rendering and API retrieval)
const globalPinRegistry = new Map<string, GeneratedPin>();

/**
 * Retrieves a stored pin by its unique ID (used by the render endpoint)
 */
export function getPinById(pinId: string): GeneratedPin | undefined {
  return globalPinRegistry.get(pinId);
}

/**
 * Retrieves all stored pins
 */
export function getAllStoredPins(): GeneratedPin[] {
  return Array.from(globalPinRegistry.values());
}

/**
 * Master Pipeline Orchestrator: Turns any published article into 5 viral vertical Pinterest pins
 */
export async function generatePinterestCampaign(
  input: PinterestCampaignInput
): Promise<PinterestCampaignResult> {
  const {
    articleTitle,
    articleUrl,
    niche,
    slug,
    domain,
    excerpt
  } = input;

  const campaignId = `camp-${slug}-${Date.now().toString(36)}`;
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;

  // 1. Generate 5 distinct psychological hook angles using Gemini/Groq
  const angles = await generate5HookAngles(articleTitle, niche, excerpt);

  // 2. Synthesize each pin with graphics, SEO copy, and drip scheduling
  const pins: GeneratedPin[] = angles.map((angle, index) => {
    const pinId = `pin-${slug}-${index + 1}`;
    const seed = Math.floor(Math.random() * 899999) + 100000;

    // SEO Metadata
    const seo = generatePinSeoMetadata({
      angle,
      articleTitle,
      articleUrl,
      niche,
      slug,
      domain: cleanDomain,
      excerpt
    });

    // Anti-ban Drip Schedule & Hash Variation
    const schedule = generateDripSchedule(index);

    // Direct Pollinations background URL
    const imageUrl = buildPollinationsBackgroundUrl(angle.imagePrompt, seed);

    // Standalone 1000x1500 SVG markup
    const svgMarkup = generatePinSvgMarkup({
      angle,
      domain: cleanDomain,
      seed,
      niche
    });

    // Live 1000x1500 PNG Render Endpoint
    const renderApiUrl = `${baseUrl}/api/pinterest/render/${pinId}`;

    const pin: GeneratedPin = {
      id: pinId,
      angle,
      seo,
      schedule,
      imageUrl,
      renderApiUrl,
      svgMarkup,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    // Store in global registry for image serving & API lookup
    globalPinRegistry.set(pinId, pin);

    return pin;
  });

  const result: PinterestCampaignResult = {
    campaignId,
    articleTitle,
    domain: cleanDomain,
    totalPins: pins.length,
    generatedAt: new Date().toISOString(),
    pins,
    antiBanStatus: {
      dailyCapEnforced: true,
      pinsPerDay: 5,
      dripIntervals: VIRAL_TIME_SLOTS.map(s => s.label),
      uniqueFingerprintsGuaranteed: true
    }
  };

  return result;
}
