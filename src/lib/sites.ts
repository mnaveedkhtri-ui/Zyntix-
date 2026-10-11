import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  coverImage: string;
  content: string[];
}

export interface SiteConfig {
  id: string;
  subdomain: string;
  customDomain?: string | null;
  name: string;
  tagline: string;
  description: string;
  niche: string;
  location: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
  };
  navigation: Array<{ label: string; href: string }>;
  posts: BlogPost[];
  contact: {
    email: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const INITIAL_DEMO_SITES: SiteConfig[] = [
  {
    id: 'site-default-demo',
    subdomain: 'demo',
    customDomain: null,
    name: 'The Thoughtful Builder',
    tagline: 'Essays on modern craftsmanship, quiet software, and organic growth.',
    description: 'A quiet publication exploring practical engineering, thoughtful product design, and sustainable internet businesses without the noise.',
    niche: 'Technology & Craftsmanship',
    location: 'Remote',
    author: {
      name: 'Naveed Khatri',
      bio: 'Software engineer and independent builder writing about systems, clean design, and deliberate work.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    navigation: [
      { label: 'Essays', href: '/' },
      { label: 'About', href: '#about' },
      { label: 'Archive', href: '#archive' },
      { label: 'Newsletter', href: '#newsletter' }
    ],
    posts: [
      {
        slug: 'the-art-of-quiet-software',
        title: 'The Art of Quiet Software: Why Less Interface Means More Clarity',
        excerpt: 'Modern tools are increasingly crowded with badges, glowing neon accents, and notifications. What happens when we strip everything down to pure typography and calm white space?',
        date: 'October 8, 2026',
        readTime: '6 min read',
        category: 'Design Philosophy',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: 'Author'
        },
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        content: [
          'When you look at timeless books printed a century ago, there were no flashy banners or synthetic gradients competing for your attention. The paper was tactile, the margins were generous, and every sentence was given room to breathe.',
          'Software has unfortunately drifted far in the opposite direction. Over the last few years, the internet has become saturated with cookie-cutter dark mode interfaces, electric cyan borders, and artificial badges that scream for immediate attention.',
          'Real humans do not live in a futuristic video game. When someone comes to read an analysis, hire an artisan, or learn a craft, they crave honesty, clarity, and genuine warmth. Clean typography, generous line height, and honest narrative voices always beat synthetic hype.'
        ]
      },
      {
        slug: 'sustainable-local-craftsmanship',
        title: 'Why Genuine Local Craftsmanship is Winning the Modern Internet',
        excerpt: 'How thoughtful independent contractors and niche artisans are outranking massive generic directories by simply telling the unpolished truth about their work.',
        date: 'September 29, 2026',
        readTime: '8 min read',
        category: 'Case Study',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: 'Author'
        },
        coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
        content: [
          'Customers are exhausted by corporate stock imagery of people in suits shaking hands in glass conference rooms. They want to see the workshop floor, the real materials being cut, and the honest story of the person standing behind the guarantee.',
          'When your website feels like a handwritten letter from someone who cares deeply about their trade, trust is established in the first three seconds. You do not need twenty popup discounts or countdown timers.'
        ]
      }
    ],
    contact: {
      email: 'hello@naveedkhtri.com',
      twitter: '@naveedkhtri',
      linkedin: 'linkedin.com/in/naveedkhtri'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// In-Memory cache for 100% zero-crash guarantee in any environment
let memorySitesCache: SiteConfig[] = [...INITIAL_DEMO_SITES];

function getSafeFilePath(): string | null {
  try {
    const isVercel = process.env.VERCEL === '1';
    const baseDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    return path.join(baseDir, 'sites.json');
  } catch (err) {
    return null;
  }
}

export function getAllSites(): SiteConfig[] {
  const filePath = getSafeFilePath();
  if (filePath && fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySitesCache = parsed;
        return parsed;
      }
    } catch (e) {
      // Fallback cleanly to in-memory cache
    }
  }
  return memorySitesCache;
}

export function getSiteBySubdomainOrDomain(identifier: string): SiteConfig | null {
  const sites = getAllSites();
  const cleanId = identifier.toLowerCase().trim();
  return sites.find(s => 
    s.subdomain.toLowerCase() === cleanId || 
    (s.customDomain && s.customDomain.toLowerCase() === cleanId)
  ) || sites[0] || null;
}

export function getSiteById(id: string): SiteConfig | null {
  const sites = getAllSites();
  return sites.find(s => s.id === id) || sites[0] || null;
}

export function saveOrUpdateSite(siteData: Partial<SiteConfig> & { subdomain: string; name: string }): SiteConfig {
  const sites = getAllSites();
  const existingIdx = sites.findIndex(s => 
    s.subdomain.toLowerCase() === siteData.subdomain.toLowerCase() || 
    (siteData.id && s.id === siteData.id)
  );

  const now = new Date().toISOString();
  let updatedSite: SiteConfig;

  if (existingIdx >= 0) {
    updatedSite = {
      ...sites[existingIdx],
      ...siteData,
      author: {
        ...sites[existingIdx].author,
        ...(siteData.author || {})
      },
      contact: {
        ...sites[existingIdx].contact,
        ...(siteData.contact || {})
      },
      posts: siteData.posts || sites[existingIdx].posts,
      updatedAt: now
    };
    sites[existingIdx] = updatedSite;
  } else {
    updatedSite = {
      id: siteData.id || `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      subdomain: siteData.subdomain.toLowerCase(),
      customDomain: siteData.customDomain || null,
      name: siteData.name,
      tagline: siteData.tagline || 'Observations on craft, practical work, and honest growth.',
      description: siteData.description || 'A thoughtfully published notebook focusing on real stories and tested knowledge.',
      niche: siteData.niche || 'Craft & Commentary',
      location: siteData.location || 'Everywhere',
      author: siteData.author || {
        name: 'The Editor',
        bio: 'Writer, practitioner, and student of timeless craftsmanship.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      navigation: [
        { label: 'Essays', href: '/' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      posts: siteData.posts || [],
      contact: siteData.contact || {
        email: 'editor@' + siteData.subdomain + '.com'
      },
      createdAt: now,
      updatedAt: now
    };
    sites.push(updatedSite);
  }

  memorySitesCache = sites;

  const filePath = getSafeFilePath();
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(sites, null, 2), 'utf-8');
    } catch (err) {
      // Ignored: memory cache will serve
    }
  }

  return updatedSite;
}
