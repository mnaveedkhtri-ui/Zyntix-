import React from 'react';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';
import { 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Star, 
  Compass, 
  Hammer, 
  Castle, 
  FileText, 
  Lock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { Metadata } from 'next';

interface SitePageProps {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);
  if (!site) return { title: 'Publication Not Found | Zyntix' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app';
  const siteUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${baseUrl}/site/${site.subdomain}`;
  const featuredPost = site.posts?.[0];

  return {
    title: `${site.name} — ${site.location} Official Publication`,
    description: site.description || `${site.name} specializes in high-integrity craftsmanship and editorial insights in ${site.location}.`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: `${site.name} — ${site.location}`,
      description: site.description,
      url: siteUrl,
      siteName: site.name,
      images: [
        {
          url: featuredPost?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description: site.description,
      images: [featuredPost?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function TenantSitePage({ params }: SitePageProps) {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  if (!site) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col items-center justify-center p-8 text-center font-serif">
        <h1 className="text-3xl sm:text-4xl font-normal mb-3 text-stone-800">Publication Not Found</h1>
        <p className="text-stone-600 max-w-md font-sans text-sm mb-6 leading-relaxed">
          The requested publication <code className="bg-stone-200/80 px-2.5 py-1 rounded text-stone-900 font-mono text-xs">"{subdomain}"</code> has not been authored yet.
        </p>
        <a 
          href="/studio"
          className="font-sans text-xs uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-600 transition"
        >
          Create this publication in Studio &rarr;
        </a>
      </div>
    );
  }

  const featuredPost = site.posts[0];
  const regularPosts = site.posts.slice(1);

  // Structured Data for Google Rich Snippets & GEO/AEO
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        'name': site.name,
        'description': site.description,
        'url': `https://${site.customDomain || `${site.subdomain}.zyntix.app`}`,
        'telephone': site.contact.phone,
        'email': site.contact.email,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': site.contact.address || 'Historic Atelier District',
          'addressLocality': site.location
        },
        'founder': {
          '@type': 'Person',
          'name': site.author.name,
          'jobTitle': site.author.credentials
        }
      },
      ...(featuredPost ? [{
        '@type': 'BlogPosting',
        'headline': featuredPost.title,
        'description': featuredPost.excerpt,
        'image': featuredPost.coverImage,
        'datePublished': featuredPost.date,
        'author': {
          '@type': 'Person',
          'name': featuredPost.author.name
        }
      }] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Dynamic JSON-LD Schema for 100/100 Google SEO & Perplexity AI Citations */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Top Professional Announcement / Contact Ribbon */}
      <div className="bg-[#1c1917] text-stone-300 py-2.5 px-4 text-xs font-sans border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-stone-200 font-serif italic text-xs sm:text-[13px] tracking-wide">
              Selected commissions accepted for 2026
            </span>
            <span className="text-stone-600 hidden md:inline">&bull;</span>
            <span className="text-stone-400 hidden md:inline font-sans text-[11px] uppercase tracking-wider">{site.location} Atelier</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            {site.contact.phone && (
              <a href={`tel:${site.contact.phone}`} className="hover:text-stone-100 flex items-center gap-1">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{site.contact.phone}</span>
              </a>
            )}
            <a href={`mailto:${site.contact.email}`} className="hover:text-stone-100 flex items-center gap-1">
              <Mail className="w-3 h-3 text-stone-400" />
              <span>{site.contact.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Header & Navigation */}
      <header className="border-b border-stone-200/90 bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-20 sm:h-24 flex items-center justify-between">
          <a href={`/site/${site.subdomain}`} className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:bg-amber-900 transition">
              {site.name.slice(0, 1)}
            </div>
            <div>
              <span className="text-xl sm:text-2xl tracking-tight font-normal text-stone-950 block leading-tight">
                {site.name}
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-500 block">
                Atelier &bull; Est. 2008 &bull; {site.location}
              </span>
            </div>
          </a>

          <nav className="flex items-center gap-5 sm:gap-8 text-xs font-sans uppercase tracking-widest font-semibold text-stone-600">
            <a href="#services" className="hover:text-stone-950 transition hidden md:inline">Services</a>
            <a href="#journal" className="hover:text-stone-950 transition hidden sm:inline">Journal</a>
            <a href="#about" className="hover:text-stone-950 transition hidden md:inline">About Us</a>
            <a href="#contact" className="hover:text-stone-950 transition hidden sm:inline">Contact</a>
            <a
              href="#contact"
              className="px-4 py-2.5 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 transition text-[11px] font-medium tracking-wider shadow-sm"
            >
              Consult Studio &rarr;
            </a>
          </nav>
        </div>
      </header>

      {/* Hero / Vision Statement */}
      <section className="py-20 sm:py-32 border-b border-stone-200/80 bg-gradient-to-b from-[#faf8f5] via-[#f5ede3]/40 to-[#faf8f5] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-950 font-sans text-xs uppercase tracking-wider font-semibold mb-8">
            <Award className="w-3.5 h-3.5 text-amber-900" />
            <span>{site.niche} &bull; {site.author.credentials || 'Certified Architectural Studio'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.15] text-stone-950 tracking-tight mb-8">
            "{site.tagline}"
          </h1>

          <p className="text-lg sm:text-2xl text-stone-700 leading-relaxed font-sans max-w-3xl mx-auto font-light mb-12">
            {site.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-sans text-xs">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-stone-50 rounded-xl font-medium hover:bg-stone-800 transition flex items-center justify-center gap-2 shadow-md shadow-stone-900/10"
            >
              <span>Schedule Direct Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#journal"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-300 text-stone-800 rounded-xl font-medium hover:bg-stone-50 transition shadow-xs"
            >
              Explore Research Journal
            </a>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="mt-20 pt-12 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-sans">
            {site.stats?.map((stat, sIdx) => (
              <div key={sIdx} className="p-3">
                <span className="block text-3xl sm:text-4xl font-normal text-stone-950 font-serif mb-1">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32 border-b border-stone-200 max-w-6xl mx-auto px-6 sm:px-10 w-full">
        <div className="max-w-2xl mb-16">
          <span className="font-sans text-xs uppercase tracking-widest text-amber-900 font-bold block mb-2">
            Core Disciplines & Practice
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal text-stone-950 tracking-tight leading-tight mb-4">
            Enduring Solutions Engineered Without Shortcuts
          </h2>
          <p className="text-stone-600 font-sans text-base leading-relaxed font-light">
            We operate at the intersection of historical preservation, monolithic stone joinery, and rigorous modern thermal envelopes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {site.services?.map((svc, i) => (
            <div key={i} className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#f5ede3] text-stone-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {i === 0 && <Castle className="w-7 h-7 text-stone-800" />}
                  {i === 1 && <Compass className="w-7 h-7 text-stone-800" />}
                  {i === 2 && <Hammer className="w-7 h-7 text-stone-800" />}
                </div>
                <h3 className="text-2xl font-normal text-stone-950 mb-3 leading-snug">{svc.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed font-sans font-light mb-8">
                  {svc.description}
                </p>
              </div>
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between font-sans text-xs">
                <span className="text-stone-500">Fixed Scope &bull; Lifetime Integrity</span>
                <a href="#contact" className="font-semibold text-stone-950 group-hover:underline">
                  Inquire &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Journal / Blog Feed (AEO & SEO Authority) */}
      <section id="journal" className="py-24 sm:py-32 border-b border-stone-200 bg-[#f7f4ee]/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-amber-900 font-bold block mb-2">
                Field Research & Thought Leadership
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal text-stone-950 tracking-tight">
                The Architectural Journal
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-sm font-light">
              Unvarnished field reports on traditional materials, structural durability, and sustainable civic spaces.
            </p>
          </div>

          {/* Featured Lead Story */}
          {featuredPost && (
            <article className="mb-20 pb-16 border-b border-stone-300/80 bg-white p-6 sm:p-12 rounded-3xl border border-stone-200/90 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-[11px] uppercase tracking-widest text-amber-900 font-bold bg-amber-100/70 px-3 py-1 rounded">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-stone-400 font-sans">&bull;</span>
                <span className="text-xs text-stone-500 font-sans font-medium">{featuredPost.readTime}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-normal text-stone-950 tracking-tight leading-[1.25] mb-4 hover:text-stone-700 transition">
                {featuredPost.title}
              </h3>

              <div className="flex items-center gap-3 text-xs font-sans text-stone-500 mb-8">
                <img 
                  src={featuredPost.author.avatar} 
                  alt={featuredPost.author.name} 
                  className="w-8 h-8 rounded-full object-cover border border-stone-300"
                />
                <span className="font-medium text-stone-900">{featuredPost.author.name}</span>
                <span>&bull;</span>
                <span>{featuredPost.date}</span>
              </div>

              {featuredPost.coverImage && (
                <div className="mb-10 rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200/80">
                  <img 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title} 
                    className="w-full h-[260px] sm:h-[460px] object-cover filter contrast-[1.02]"
                  />
                </div>
              )}

              <p className="text-lg sm:text-2xl text-stone-800 leading-relaxed font-serif italic mb-8 border-l-3 border-stone-400 pl-4 sm:pl-6">
                "{featuredPost.excerpt}"
              </p>

              {/* In-depth Editorial Content with AEO Box */}
              <div className="space-y-6 text-stone-800 leading-[1.9] text-base sm:text-lg font-serif">
                {featuredPost.content.map((block, pIdx) => {
                  if (block.startsWith('[AEO_ANSWER]:')) {
                    const answer = block.replace('[AEO_ANSWER]:', '').trim();
                    return (
                      <div key={pIdx} className="my-8 sm:my-10 p-6 sm:p-8 bg-[#f5ede3] border-l-4 border-amber-900 rounded-r-2xl font-sans text-sm sm:text-base text-stone-900 leading-relaxed shadow-xs">
                        <span className="block text-xs uppercase tracking-widest font-bold text-amber-950 mb-2">
                          Executive Answer (#0 Featured Snippet)
                        </span>
                        {answer}
                      </div>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h4 key={pIdx} className="text-2xl sm:text-3xl font-normal text-stone-950 pt-8 pb-3 border-b border-stone-200">
                        {block.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (block.startsWith('*') && block.endsWith('*')) {
                    return (
                      <p key={pIdx} className="text-stone-500 font-sans text-xs sm:text-sm uppercase tracking-wider font-semibold">
                        {block.replace(/\*/g, '')}
                      </p>
                    );
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={pIdx} className="my-8 pl-6 border-l-3 border-stone-400 italic text-xl sm:text-2xl text-stone-800 font-serif">
                        {block.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return <p key={pIdx}>{block}</p>;
                })}
              </div>
            </article>
          )}

          {/* Chronological Essays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularPosts.map((post, index) => (
              <article key={index} className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between group hover:shadow-md transition">
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="font-sans text-xs text-stone-400">{post.readTime}</span>
                  </div>

                  <h4 className="text-2xl font-normal text-stone-950 group-hover:text-stone-600 transition leading-snug mb-3">
                    {post.title}
                  </h4>

                  <p className="text-stone-600 text-sm leading-relaxed font-sans font-light mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between font-sans text-xs text-stone-500">
                  <span>{post.date}</span>
                  <span className="font-semibold text-stone-900 group-hover:translate-x-1 transition-transform">
                    Read Essay &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Page Section */}
      <section id="about" className="py-24 sm:py-32 border-b border-stone-200 max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-amber-900 font-bold block mb-2">
              Our Heritage & Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal text-stone-950 tracking-tight leading-tight mb-6">
              About Meridian Studio
            </h2>
            <p className="text-stone-700 font-sans text-base leading-relaxed mb-6 font-light">
              {site.aboutContent?.mission}
            </p>
            <p className="text-stone-600 font-sans text-sm leading-relaxed mb-8 font-light">
              {site.aboutContent?.history}
            </p>

            <div className="space-y-3 font-sans text-xs">
              <span className="font-bold text-stone-900 uppercase tracking-wider block mb-2">Our Operating Values:</span>
              {site.aboutContent?.values?.map((val, vIdx) => (
                <div key={vIdx} className="flex items-start gap-2.5 text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Master Builder Profile Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#f5ede3] border border-stone-300/80 shadow-md">
            <div className="flex items-center gap-5 mb-6">
              <img 
                src={site.author.avatar} 
                alt={site.author.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h3 className="text-2xl font-normal text-stone-950">{site.author.name}</h3>
                <span className="font-sans text-xs text-amber-950 font-bold block">{site.author.credentials}</span>
                <span className="font-sans text-[11px] text-stone-500">{site.location} Studio</span>
              </div>
            </div>
            <p className="text-stone-700 font-sans text-sm leading-relaxed font-light mb-6">
              "{site.author.bio}"
            </p>
            <div className="pt-4 border-t border-stone-300/60 font-sans text-xs flex justify-between text-stone-600">
              <span>Direct: {site.contact.email}</span>
              <span className="text-stone-900 font-semibold">Licensed & Bonded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section with Direct Inquiry Form */}
      <section id="contact" className="py-24 sm:py-32 border-b border-stone-200 bg-[#1c1917] text-stone-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
              Private Commission & Inquiries
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal text-white tracking-tight mb-4">
              Get in Touch with the Studio
            </h2>
            <p className="font-sans text-sm text-stone-400 font-light leading-relaxed">
              Every commission begins with a confidential feasibility dialogue. Reach out to review your project scope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 font-sans text-xs">
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
              <Phone className="w-5 h-5 text-amber-400 mx-auto mb-3" />
              <span className="text-stone-400 block mb-1">Direct Phone</span>
              <strong className="text-white text-sm">{site.contact.phone || '+1 (512) 894-3920'}</strong>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
              <Mail className="w-5 h-5 text-amber-400 mx-auto mb-3" />
              <span className="text-stone-400 block mb-1">Inquiry Email</span>
              <strong className="text-white text-sm">{site.contact.email}</strong>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-3" />
              <span className="text-stone-400 block mb-1">Office Hours</span>
              <strong className="text-white text-xs">{site.contact.hours || 'Mon–Fri 8AM–6PM'}</strong>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="bg-stone-900 p-8 sm:p-12 rounded-3xl border border-stone-800 shadow-2xl max-w-2xl mx-auto font-sans">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <input 
                type="text" 
                placeholder="Project Scope / Location" 
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <textarea 
                rows={4} 
                placeholder="Describe your site requirements or questions..." 
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase transition shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Transmit Inquiry to Studio
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Privacy Policy & Terms Section */}
      <section id="privacy" className="py-16 border-b border-stone-200 bg-[#faf8f5] font-sans text-xs text-stone-600">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="p-8 rounded-2xl bg-[#f5ede3]/70 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-900" />
              <span>Studio Privacy & Editorial Transparency Statement</span>
            </div>
            <p className="leading-relaxed font-light">
              At {site.name}, client privacy and intellectual integrity are foundational. We never sell, rent, or trade client project drawings, personal contact information, or architectural specifications to third parties. All communications are bound by strict architectural confidentiality agreements.
            </p>
            <div className="pt-2 text-[11px] text-stone-500 flex flex-wrap gap-6">
              <span>Data Security: 256-bit SSL Encrypted</span>
              <span>Governing Jurisdiction: State of Texas, USA</span>
              <span>Updated: October 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Master Full-Featured Luxury Footer */}
      <footer className="bg-[#141210] text-stone-400 font-sans text-xs py-16 sm:py-24 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div>
              <span className="font-serif text-2xl text-white block mb-3 font-normal">
                {site.name}
              </span>
              <p className="text-stone-500 text-xs leading-relaxed mb-4 font-light">
                {site.tagline}
              </p>
              <span className="text-[11px] text-amber-400 block font-medium">
                {site.location}
              </span>
            </div>

            <div>
              <h5 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
                Navigation
              </h5>
              <ul className="space-y-2.5 text-stone-400">
                <li><a href="#services" className="hover:text-white transition">Services & Disciplines</a></li>
                <li><a href="#journal" className="hover:text-white transition">Architectural Journal</a></li>
                <li><a href="#about" className="hover:text-white transition">About Our Atelier</a></li>
                <li><a href="#contact" className="hover:text-white transition">Direct Contact</a></li>
                <li><a href="#privacy" className="hover:text-white transition">Privacy Statement</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
                Disciplines
              </h5>
              <ul className="space-y-2.5 text-stone-400">
                <li><span>Stone & Masonry Restoration</span></li>
                <li><span>Timber Frame Engineering</span></li>
                <li><span>Passive Solar Envelopes</span></li>
                <li><span>Historic Feasibility Audits</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
                Atelier Location
              </h5>
              <p className="text-stone-400 leading-relaxed font-light mb-3">
                {site.contact.address || '742 Congress Ave, Austin, TX 78701'}
              </p>
              <p className="text-stone-500">
                Tel: {site.contact.phone || '+1 (512) 894-3920'}
              </p>
              <p className="text-stone-500">
                Email: {site.contact.email}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>&copy; {new Date().getFullYear()} {site.name}. All intellectual and structural rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-stone-300">Privacy Policy</a>
              <a href="#contact" className="hover:text-stone-300">Terms of Commission</a>
              <span className="text-stone-600">Powered Autonomously by Zyntix Engine</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
