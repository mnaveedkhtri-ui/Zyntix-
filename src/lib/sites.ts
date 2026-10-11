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
  content: string[]; // array of paragraphs, quotes, headings
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

const DATA_DIR = path.join(process.cwd(), 'data');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SITES_FILE)) {
    const initialSites: SiteConfig[] = [
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
          },
          {
            slug: 'building-for-longevity',
            title: 'Building for the 10-Year Horizon: Thoughts on Code & Life',
            excerpt: 'A personal reflection on writing code that survives trends, maintaining genuine human relationships with clients, and choosing substance over superficiality.',
            date: 'September 14, 2026',
            readTime: '5 min read',
            category: 'Reflections',
            author: {
              name: 'Naveed Khatri',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              role: 'Author'
            },
            coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
            content: [
              'Every framework that appears today promises to revolutionize tomorrow. Yet the fundamentals of clear communication, empathetic problem solving, and disciplined simplicity remain untouched by the passage of decades.'
            ]
          }
        ],
        contact: {
          email: 'hello@naveedkhatri.com',
          twitter: '@naveedkhatri',
          linkedin: 'linkedin.com/in/naveedkhatri'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(SITES_FILE, JSON.stringify(initialSites, null, 2), 'utf-8');
  }
}

export function getAllSites(): SiteConfig[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(SITES_FILE, 'utf-8');
    return JSON.parse(raw) as SiteConfig[];
  } catch (e) {
    console.error('Failed to read sites:', e);
    return [];
  }
}

export function getSiteBySubdomainOrDomain(identifier: string): SiteConfig | null {
  const sites = getAllSites();
  const cleanId = identifier.toLowerCase().trim();
  return sites.find(s => 
    s.subdomain.toLowerCase() === cleanId || 
    (s.customDomain && s.customDomain.toLowerCase() === cleanId)
  ) || null;
}

export function getSiteById(id: string): SiteConfig | null {
  const sites = getAllSites();
  return sites.find(s => s.id === id) || null;
}

export function saveOrUpdateSite(siteData: Partial<SiteConfig> & { subdomain: string; name: string }): SiteConfig {
  const sites = getAllSites();
  const existingIdx = sites.findIndex(s => 
    s.subdomain.toLowerCase() === siteData.subdomain.toLowerCase() || 
    (siteData.id && s.id === siteData.id)
  );

  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const updated: SiteConfig = {
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
    sites[existingIdx] = updated;
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
    return updated;
  } else {
    const newSite: SiteConfig = {
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
    sites.push(newSite);
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
    return newSite;
  }
}

export function deleteSite(id: string): boolean {
  const sites = getAllSites();
  const filtered = sites.filter(s => s.id !== id && s.subdomain !== id);
  if (filtered.length !== sites.length) {
    fs.writeFileSync(SITES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}
