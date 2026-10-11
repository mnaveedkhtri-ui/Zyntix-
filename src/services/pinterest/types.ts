/**
 * Zyntix Autonomous Pinterest Traffic Machine - Core Types
 * Engineered for viral CTR, 1000x1500 vertical pin graphics, and anti-ban drip scheduling.
 */

export type PsychologicalAngleType =
  | 'listicle'
  | 'problem_solver'
  | 'mistake_warning'
  | 'aesthetic_showcase'
  | 'comparison';

export interface HookAngle {
  id: string;
  angleType: PsychologicalAngleType;
  angleName: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imagePrompt: string;
  visualTheme: VisualTheme;
}

export interface VisualTheme {
  badgeBg: string;
  badgeTextColor: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  badgePosition: 'left' | 'center' | 'right';
  headlineSize: number;
  fontFamily: string;
}

export interface PinSeoMetadata {
  title: string;          // strictly < 100 characters, high search intent
  description: string;    // strictly < 500 characters with 4-6 viral hashtags
  hashtags: string[];
  destinationUrl: string; // clean URL with strict UTM tracking
  boardName: string;
}

export interface PinSchedule {
  scheduledSlotTime: string; // e.g. "11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM", "10:30 PM"
  scheduledIsoDate: string;  // exact ISO timestamp for execution
  dripDelayMinutes: number;
  hashSalt: string;          // unique salt ensuring computer vision sees 100% unique visual fingerprint
}

export interface GeneratedPin {
  id: string;
  angle: HookAngle;
  seo: PinSeoMetadata;
  schedule: PinSchedule;
  imageUrl: string;          // dynamic render route or pollinations background
  renderApiUrl: string;      // live 1000x1500 PNG endpoint
  svgMarkup: string;         // direct standalone 1000x1500 SVG
  createdAt: string;
  status: 'scheduled' | 'ready' | 'published';
}

export interface PinterestCampaignInput {
  articleTitle: string;
  articleUrl: string;
  niche: string;
  slug: string;
  domain: string;
  excerpt?: string;
  authorName?: string;
}

export interface PinterestCampaignResult {
  campaignId: string;
  articleTitle: string;
  domain: string;
  totalPins: number;
  generatedAt: string;
  pins: GeneratedPin[];
  antiBanStatus: {
    dailyCapEnforced: boolean;
    pinsPerDay: number;
    dripIntervals: string[];
    uniqueFingerprintsGuaranteed: boolean;
  };
}
