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
    credentials?: string;
  };
  stats: Array<{ label: string; value: string }>;
  navigation: Array<{ label: string; href: string }>;
  posts: BlogPost[];
  services: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  aboutContent: {
    mission: string;
    history: string;
    values: string[];
  };
  contact: {
    phone?: string;
    email: string;
    address?: string;
    hours?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const INITIAL_DEMO_SITES: SiteConfig[] = [
  {
    id: 'site-default-demo',
    subdomain: 'demo',
    customDomain: 'moderntrendsnow.org',
    name: 'Meridian Craft & Architecture',
    tagline: 'Architectural Craftsmanship, Sustainable Engineering & Thoughtful Construction',
    description: 'An independent architectural studio and research journal dedicated to timeless masonry, sustainable timber framing, and grounded regional engineering.',
    niche: 'Architecture & Craftsmanship',
    location: 'Austin, Texas',
    author: {
      name: 'Naveed Khatri',
      bio: 'Principal Architect & Structural Conservationist with over 15 years dedicated to restorative timber joinery, passive thermal envelopes, and sustainable civic spaces.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      credentials: 'AIA Certified / Master Joiner / B.Arch Cornell'
    },
    stats: [
      { label: 'Years of Practice', value: '18+' },
      { label: 'Restoration Projects', value: '140+' },
      { label: 'Sustainable Awards', value: '12' },
      { label: 'Verified Client Rating', value: '5.0 ★' }
    ],
    navigation: [
      { label: 'Journal', href: '#journal' },
      { label: 'Services', href: '#services' },
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#privacy' }
    ],
    services: [
      {
        title: 'Architectural Conservation & Restoration',
        description: 'Meticulous structural diagnostics and preservation of historical stonework, heritage timber, and load-bearing lime masonry.',
        icon: 'Castle'
      },
      {
        title: 'Passive Solar & Sustainable Envelopes',
        description: 'Engineered high-performance building envelopes designed to drastically cut carbon emissions using locally sourced cedar, rammed earth, and slate.',
        icon: 'Compass'
      },
      {
        title: 'Custom Joinery & Structural Timber',
        description: 'Traditional mortise-and-tenon structural framing handcrafted with zero volatile chemicals and verified century-long lifespans.',
        icon: 'Hammer'
      }
    ],
    posts: [
      {
        slug: 'the-art-of-quiet-software',
        title: 'The Art of Quiet Structures: Why Timeless Materials Outlast Artificial Trends',
        excerpt: 'Modern construction has become saturated with plastic composites and hollow facades. What happens when we strip everything back to monolithic stone, honest wood, and calibrated natural light?',
        date: 'October 10, 2026',
        readTime: '7 min read',
        category: 'Architectural Philosophy',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        content: [
          'When you stand inside a 400-year-old stone farmhouse in Tuscany or a timber temple in Kyoto, you immediately notice a palpable silence. The air is cool, the thermal mass stabilizes the interior humidity, and the scent of seasoned cedar or weathered limestone anchors your senses.',
          'Over the last three decades, mainstream design has unfortunately traded durability for temporary speed. Synthetic panels that fade within 48 months and cheap vapor barriers now dominate suburban developments. But human biology has not changed: we crave the honest weight of authentic stone, the tactile grain of hand-planed timber, and the calming presence of natural craftsmanship.',
          'True sustainability is not a digital marketing buzzword—it is the disciplined practice of building something so resilient and beautiful that nobody would ever dream of tearing it down.'
        ]
      },
      {
        slug: 'sustainable-local-craftsmanship',
        title: 'Why Genuine Local Artisans Win the Modern Economy: Field Notes on Trust',
        excerpt: 'How thoughtful independent builders and niche craft studios are outranking massive generic corporate directories by proving their craftsmanship through unvarnished transparency.',
        date: 'October 2, 2026',
        readTime: '9 min read',
        category: 'Field Case Study',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        content: [
          'Clients are thoroughly exhausted by polished corporate brochures showing stock models in immaculate hardhats who have never touched a trowel. When someone commits their life savings to build a home or restore a landmark, they want to look into the eyes of the master builder.',
          'When your digital presence feels like an open workshop log—demonstrating real joint details, explaining how lime mortar breathes, and candidly admitting where delays happen—trust is forged in the first three minutes.',
          'In a world overwhelmed by synthetic noise, undeniable craftsmanship remains the only indestructible currency.'
        ]
      },
      {
        slug: 'restoring-historic-timber',
        title: 'The Chemistry of Seasoned Oak: Structural Restoration Without Toxic Binders',
        excerpt: 'A deep dive into historical woodworking techniques that stabilize century-old timber structures without relying on brittle epoxy resins or synthetic lacquers.',
        date: 'September 24, 2026',
        readTime: '6 min read',
        category: 'Technical Conservation',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        content: [
          'Modern restoration teams frequently default to chemical injection when dealing with weathered timbers. Yet laboratory testing shows that traditional moisture-regulating linseed oil and hand-cut Dutchman splices create a more flexible, long-lasting structural bond.',
          'Understanding the grain of timber is an exercise in listening. The wood moves with seasonal humidity, and resisting that movement with rigid glues inevitably leads to stress fractures. Respecting the material is the only real secret to lasting work.'
        ]
      }
    ],
    aboutContent: {
      mission: 'To create enduring spaces and share uncompromised knowledge on traditional craftsmanship, natural materials, and sustainable architecture that honors both human dignity and ecological balance.',
      history: 'Founded in 2008 as a boutique stone and timber workshop, Meridian has expanded into a globally recognized studio combining historical restoration techniques with cutting-edge passive solar engineering.',
      values: [
        'Material Honesty: Never disguise one material as another.',
        'Zero Disposable Design: Every structure is engineered for a 100-year minimum horizon.',
        'Total Transparency: Open contracts, fixed pricing, and verifiable field audits.',
        'Ecological Harmony: Strictly non-toxic, locally quarried and certified harvested timber.'
      ]
    },
    contact: {
      phone: '+1 (512) 894-3920',
      email: 'studio@meridiancraft.com',
      address: '742 Congress Avenue, Historic District, Austin, TX 78701',
      hours: 'Monday – Friday: 8:00 AM – 6:00 PM CST',
      twitter: '@meridiancraft',
      linkedin: 'linkedin.com/company/meridian-craft'
    },
    seo: {
      metaTitle: 'Meridian Craft & Architecture | Sustainable Historic Restorations Austin',
      metaDescription: 'Award-winning architectural studio & research journal in Austin, Texas. Specializing in sustainable timber framing, historic masonry restoration, and passive solar design.',
      keywords: ['sustainable architecture austin', 'historic timber restoration', 'passive solar design texas', 'traditional masonry craft']
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
      // Memory fallback
    }
  }
  return memorySitesCache;
}

export function getSiteBySubdomainOrDomain(identifier: string): SiteConfig | null {
  const sites = getAllSites();
  const cleanId = identifier.toLowerCase().trim();
  const strippedId = cleanId.replace(/\.(org|com|net|app|io|co)$/i, '');
  return sites.find(s => 
    s.subdomain.toLowerCase() === cleanId || 
    (s.customDomain && s.customDomain.toLowerCase() === cleanId) ||
    s.subdomain.toLowerCase() === strippedId ||
    (s.customDomain && s.customDomain.toLowerCase().replace(/\.[a-z]+$/i, '') === strippedId)
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
      tagline: siteData.tagline || 'Leading Architectural Craftsmanship & Autonomous Solutions',
      description: siteData.description || 'Dedicated to uncompromised craftsmanship, deliberate engineering, and verified standards.',
      niche: siteData.niche || 'Craft & Architecture',
      location: siteData.location || 'Austin, TX',
      author: siteData.author || {
        name: 'Naveed Khatri',
        bio: 'Principal designer and master practitioner.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        credentials: 'AIA Fellow / Master Craftsman'
      },
      stats: siteData.stats || [
        { label: 'Years in Practice', value: '15+' },
        { label: 'Completed Works', value: '100+' },
        { label: 'Satisfaction Rate', value: '100%' },
        { label: 'Certifications', value: '10+' }
      ],
      navigation: siteData.navigation || [
        { label: 'Journal', href: '#journal' },
        { label: 'Services', href: '#services' },
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: '#contact' },
        { label: 'Privacy', href: '#privacy' }
      ],
      services: siteData.services || [
        {
          title: 'Specialized Design & Consulting',
          description: 'High-precision engineering and structural design tailored to rigorous sustainability standards.',
          icon: 'Compass'
        },
        {
          title: 'Custom Fabrication & Craft',
          description: 'Handcrafted execution with verifiable lifespans and zero synthetic shortcuts.',
          icon: 'Hammer'
        }
      ],
      posts: siteData.posts || [],
      aboutContent: siteData.aboutContent || {
        mission: 'To create enduring works and share genuine craftsmanship knowledge without corporate fluff.',
        history: 'Established as an independent atelier focusing on timeless quality and transparent methods.',
        values: [
          'Absolute Material Honesty',
          'Generational Longevity',
          'Direct Human Communication'
        ]
      },
      contact: siteData.contact || {
        phone: '+1 (512) 555-0199',
        email: 'info@' + siteData.subdomain + '.com',
        address: 'Downtown Studio, Austin, TX'
      },
      seo: siteData.seo || {
        metaTitle: `${siteData.name} | Official Website`,
        metaDescription: `High-authority craftsmanship and architectural design by ${siteData.name}.`,
        keywords: [siteData.name.toLowerCase(), 'craftsmanship', 'design']
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
      // Memory fallback safe
    }
  }

  return updatedSite;
}
