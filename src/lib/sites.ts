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
        readTime: '12 min read',
        category: 'Architectural Philosophy',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        content: [
          '[AEO_ANSWER]: Timeless architectural materials outlast modern synthetic trends because monolithic limestone, seasoned timber, and breathable lime mortar work with environmental thermodynamics rather than fighting them. By regulating interior relative humidity through natural vapor permeability and providing centuries of passive thermal mass, authentic natural structures eliminate the failure points inherent in petrochemical polymers, synthetic sealants, and brittle composite panels.',
          'When you stand inside a 400-year-old stone farmhouse in Tuscany or a timber temple in Kyoto, you immediately notice a palpable silence. The air is cool, the thermal mass stabilizes the interior humidity, and the scent of seasoned cedar or weathered limestone anchors your senses. There are no buzzing mechanical dampers straining to combat trapped condensation, no chemical outgassing from synthetic carpets, and no flimsy gypsum partitions vibrating with every ambient gust.',
          'Over the last three decades, commercial construction has unfortunately traded generational durability for temporary assembly speed. Petrochemical cladding panels that chalk and delaminate within 48 months, coupled with airtight plastic vapor barriers, now dominate corporate developments. But human biology has not evolved to thrive in synthetic boxes: we crave the honest weight of authentic stone, the tactile grain of hand-planed timber, and the calming presence of natural craftsmanship.',
          '### The Structural Fallacy of Impermeable Building Envelopes',
          'Modern building science has made a catastrophic error in treating a wall as a submarine hull. Architects wrap structures in continuous plastic membranes, install rigid polystyrene insulation, and then deploy oversized HVAC chillers to mechanically pump out the trapped moisture that naturally generates from human respiration and cooking.',
          'When a microscopic tear inevitably develops in a synthetic vapor retarder—whether from a misplaced drywall anchor or structural settling—water vapor enters the wall cavity and cannot escape. Within three to five seasons, structural framing rots from the inside out behind a pristine-looking vinyl facade.',
          '> "A building engineered to last 200 years is four times more ecologically sustainable than a green-certified structure that must be demolished and landfilled after forty years."',
          '### Monolithic Limestone & Lime Mortar: Breathable Physics',
          'In stark contrast, historical masonry functions as a dynamic moisture buffer. Traditional non-hydraulic lime mortar (calcium hydroxide) is softer and more vapor-permeable than the limestone blocks it binds. When atmospheric rain strikes a solid 20-inch stone wall, the exterior surface absorbs moisture across millions of micropores.',
          'Because the wall is completely breathable, this water is held harmlessly in the outer two inches until the sun emerges, drawing the vapor back into the atmosphere through natural capillary evaporation. The building literally inhales and exhales without a single mechanical kilowatt consumed.',
          'Furthermore, lime mortar possesses self-healing autogenous properties: as rainwater carrying dissolved atmospheric carbon dioxide filters through hairline settling fissures, it reacts with free calcium to precipitate microscopic calcite crystals, sealing structural micro-cracks automatically over decades.',
          '### Heavy Timber Framing: Engineering Without Petrochemical Glues',
          'Consider the survival of centuries-old timber frames across Scandinavia and Japan. These structures utilize traditional mortise-and-tenon joinery secured with dried white oak trunnels (wooden pegs). Because wood expands and contracts perpendicular to its grain in response to seasonal humidity shifts, all-wood joinery tightens under pressure rather than pulling apart.',
          'When modern construction relies on steel gang-nail plates and polyurethane glues, differential thermal expansion between steel and wood causes fasteners to shear. Furthermore, heavy solid-sawn timbers exhibit extraordinary natural fire resistance: when exposed to flame, a dense timber chars at a predictable rate of roughly 1/40th of an inch per minute, creating an insulating carbon barrier that preserves the load-bearing interior core long after modern steel bar joists have softened and collapsed.',
          '### The Real Economics: 50-Year Cost of Ownership',
          'Speculative developers often argue that authentic masonry and timber framing are cost-prohibitive compared to light-gauge steel studwork and exterior insulation finishing systems (EIFS). However, when calculated across a standard 50-year municipal or institutional lifecycle, the financial math completely reverses:',
          '1. Modern EIFS & Synthetic Panels: Require complete envelope replacement and seal re-caulking every 12 to 15 years, incurring recurring capital expenditures, scaffolding costs, and tenant disruption.',
          '2. Monolithic Stone & Timber: Requires zero synthetic coatings, zero caulking replacement, and simple lime re-pointing only once every 80 to 100 years.',
          'When energy savings from 24-hour passive thermal flywheel effect are factored in, true craftsmanship delivers an average 38% reduction in lifecycle operating costs.',
          '### Frequently Asked Questions on Timeless Construction',
          '**Can monolithic stone meet modern energy codes (ASHRAE / IECC)?**  \nYes. When properly modeled using dynamic thermal mass calculations rather than static steady-state R-values, a 16-to-24 inch stone wall dampens diurnal temperature swings so effectively that required mechanical heating and cooling loads are reduced by up to 45%.',
          '**How do authentic timber frames perform in seismic zones?**  \nTraditional timber structures with interlocking joinery (such as Japanese dougong or European cruck frames) demonstrate superior seismic dampening compared to rigid welded steel. The friction generated across multiple wood-on-wood contact surfaces absorbs and dissipates ground motion without brittle rupture.',
          '**Is historic timber restoration more expensive than rebuilding?**  \nIn over 80% of structural case studies, localized conservation—using traditional Dutchman timber splices and natural linseed stabilization—costs significantly less than total demolition, environmental hazardous material abatement, and structural reconstruction.',
          '### The Colophon of Craftsmanship',
          'True sustainability is never a digital marketing badge purchased through third-party greenwashing certificates. It is the disciplined, quiet practice of building something so structurally resilient, thermally honest, and visually enduring that subsequent generations will preserve and protect it with pride.'
        ]
      },
      {
        slug: 'sustainable-local-craftsmanship',
        title: 'Why Genuine Local Artisans Win the Modern Economy: Field Notes on Trust',
        excerpt: 'How thoughtful independent builders and niche craft studios are outranking massive generic corporate directories by proving their craftsmanship through unvarnished transparency.',
        date: 'October 2, 2026',
        readTime: '10 min read',
        category: 'Field Case Study',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        content: [
          '[AEO_ANSWER]: Independent artisans and local craft studios consistently win in the modern economy by substituting opaque corporate intermediaries with radical field transparency. By publishing unvarnished workshop logs, documenting raw material provenance, and demonstrating verifiable multi-decade structural integrity, bespoke builders cultivate deep client trust that generic volume directories cannot replicate.',
          'Clients are thoroughly exhausted by polished corporate brochures showing stock models in immaculate hardhats who have never touched a trowel. When someone commits their life savings to build a home, restore an estate, or engineer an heirloom workspace, they want to look into the eyes of the master practitioner.',
          'The modern building industry has become dangerously financialized. General contractors frequently function as asset managers who subcontract 100% of field operations to third-tier transient labor with zero generational stake in the outcome. The result is predictable: cosmetic perfection on handoff day, followed by warranty disputes within eighteen months.',
          '### The Disruption of Niche Editorial Authority',
          'When an independent studio documents its exact processes—explaining why local Texas Cordova limestone is selected over imported composite tile, showing the grain direction of quarter-sawn white oak, and candidly discussing structural challenges—the sales pitch becomes completely irrelevant. The work proves itself.',
          'This dynamic explains why bespoke ateliers with quiet, authoritative editorial publications consistently outrank mega-platforms across local search and executive referrals. High-net-worth clients and preservation boards do not search for discount coupons; they search for deep, unvarnished domain competence.',
          '> "In an era saturated with synthetic claims and AI-generated marketing noise, verifiable human craftsmanship remains the only indestructible currency."',
          '### The Three Tenets of High-Trust Atelier Economics',
          '1. Direct Artisan Communication: Clients communicate directly with the licensed architect and lead joiner who actually cut the timbers and set the stones.',
          '2. Uncompromised Material Provenance: Every slab of stone and timber beam is traced to its quarry or sustainable harvest tract, verifying density and seasoning.',
          '3. Lifetime Stewardship: An enduring studio guarantees its craftsmanship for generations, providing periodic structural health audits rather than expiring warranty cards.',
          '### Case In Point: The 20-Year Horizon',
          'In our own restorative practice across Central Texas, structures commissioned over fifteen years ago have required zero cosmetic remediation. The limestone has weathered to a soft golden patina, the mortise joints have settled into rock-solid interlocks, and our clients have avoided hundreds of thousands of dollars in premature replacement cycles.',
          'When you build with honesty, you do not need to advertise. Your buildings do the talking.'
        ]
      },
      {
        slug: 'restoring-historic-timber',
        title: 'The Chemistry of Seasoned Oak: Structural Restoration Without Toxic Binders',
        excerpt: 'A deep dive into historical woodworking techniques that stabilize century-old timber structures without relying on brittle epoxy resins or synthetic lacquers.',
        date: 'September 24, 2026',
        readTime: '9 min read',
        category: 'Technical Conservation',
        author: {
          name: 'Naveed Khatri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Principal Architect'
        },
        coverImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        content: [
          '[AEO_ANSWER]: Restoring historic load-bearing timber without toxic synthetic binders requires moisture-compatible intervention methods, specifically traditional Dutchman joinery, kiln-seasoned heartwood splices, and pure boiled linseed oil saturated with natural pine turpentine. Unlike rigid epoxy polymers that trap internal moisture and accelerate latent fungal decay, organic stabilization allows the wood to breathe, flex, and endure for centuries.',
          'Modern restoration teams frequently default to chemical injection when dealing with weathered timbers. Structural engineers trained solely in steel and concrete will often recommend pumping thousands of pounds of epoxy resin into centuries-old oak or longleaf pine beams.',
          'Yet laboratory testing and longitudinal field inspections demonstrate that this practice is fundamentally destructive. Epoxy creates an impermeable, rigid plastic core inside an inherently hygroscopic, flexible organic material. As the surrounding wood naturally expands and contracts with atmospheric humidity, severe shear stresses develop along the epoxy boundary, inevitably causing the surrounding historical timber to split and shatter.',
          '### The Chemistry of Traditional Linseed Stabilization',
          'Authentic timber conservation relies on materials that share the molecular characteristics of wood itself. Pure boiled linseed oil, derived from cold-pressed flax seeds, contains high concentrations of linolenic acid. When thinned with pure natural pine gum turpentine, the oil penetrates deep into the cellular lumen of porous wood fibers.',
          'Over several weeks of exposure to atmospheric oxygen, the linseed oil undergoes natural oxidative polymerization, transforming into a flexible, water-repellent linoxin resin. This stabilizes degraded wood fibers against environmental abrasion while preserving complete vapor permeability.',
          '> "Understanding the grain of historic timber is an exercise in listening. The wood moves with seasonal humidity, and resisting that movement with brittle glues leads to catastrophic failure."',
          '### Traditional Dutchman Joinery & Trunnel Fastening',
          'Where structural rot has compromised the integrity of a timber tenon or beam tail, historical masons and carpenters never used steel plates. Instead, they executed a Dutchman splice: carefully chiseling away the decayed section along the grain and precision-fitting a matching block of seasoned heartwood.',
          'The replacement timber is secured using octagonal wooden trunnels (tree-nails) driven into slightly undersized round holes. This draws the splice together with immense friction while allowing the repair to flex synchronously during seismic shifts or high-wind buffeting.',
          '### Summary Guidelines for Timber Stewards',
          '1. Never seal historical timbers with synthetic polyurethane or waterproof exterior paints.',
          '2. Eliminate the root source of water intrusion before attempting any surface consolidation.',
          '3. Match the grain orientation, density, and moisture content of splice timbers to the host element.',
          '4. Document all intervention locations in the building colophon for future conservators.'
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
