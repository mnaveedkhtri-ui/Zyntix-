import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

interface BlogIndexProps {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: BlogIndexProps): Promise<Metadata> {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);
  if (!site) return { title: 'Journal Not Found | Zyntix' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app';
  const siteUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${baseUrl}/site/${site.subdomain}`;

  return {
    title: `The Research Journal & Field Notes — ${site.name}`,
    description: `Complete archive of research essays, architectural monographs, and practical craftsmanship studies published by ${site.name}.`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: `The Research Journal — ${site.name}`,
      description: `Complete archive of research essays and practical craftsmanship studies in ${site.location}.`,
      url: `${siteUrl}/blog`,
      siteName: site.name,
      type: 'website',
    },
  };
}

export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  if (!site) {
    notFound();
  }

  const posts = site.posts || [];
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const homeUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `/site/${site.subdomain}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Top Announcement Ribbon */}
      <div className="bg-[#1c1917] text-stone-300 py-2.5 px-4 text-xs font-sans border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
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

      {/* Header */}
      <header className="border-b border-stone-200/90 bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href={homeUrl} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center font-serif text-base font-bold shadow-sm group-hover:bg-amber-900 transition">
              {site.name.slice(0, 1)}
            </div>
            <div>
              <span className="text-lg tracking-tight font-normal text-stone-950 block leading-tight">
                {site.name}
              </span>
              <span className="text-[10px] text-stone-500 font-sans uppercase tracking-widest block">
                Research Archive
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4 font-sans text-xs">
            <a 
              href={homeUrl}
              className="text-stone-600 hover:text-stone-950 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Atelier</span>
            </a>
            <a 
              href={`${homeUrl}#contact`}
              className="bg-stone-900 text-stone-50 px-4 py-2 rounded-xl text-xs font-medium hover:bg-amber-950 transition"
            >
              Inquire
            </a>
          </div>
        </div>
      </header>

      {/* Main Archive Index */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-20 flex-1 w-full">
        <div className="mb-14">
          <span className="font-sans text-xs uppercase tracking-widest text-amber-900 font-bold block mb-2">
            Field Research & Monograph Archive
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal text-stone-950 tracking-tight leading-tight mb-4">
            The Journal & Field Records
          </h1>
          <p className="text-stone-600 font-sans text-base max-w-2xl font-light leading-relaxed">
            A comprehensive, ongoing publication of independent field audits, historical masonry practices, and durable structural methods observed by {site.name}.
          </p>
        </div>

        {/* Lead Featured Article */}
        {featuredPost && (
          <div className="mb-16 p-8 sm:p-12 rounded-3xl bg-white border border-stone-200/90 shadow-sm">
            <div className="flex items-center gap-3 mb-4 font-sans text-xs">
              <span className="font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded text-[11px] uppercase tracking-wider">
                Lead Monograph
              </span>
              <span className="text-stone-400">&bull;</span>
              <span className="text-stone-500">{featuredPost.readTime}</span>
              <span className="text-stone-400">&bull;</span>
              <span className="text-stone-500">{featuredPost.date}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 tracking-tight leading-snug mb-4 hover:text-stone-700 transition">
              <a href={`${homeUrl}/blog/${featuredPost.slug}`}>
                {featuredPost.title}
              </a>
            </h2>

            {featuredPost.coverImage && (
              <div className="my-8 rounded-2xl overflow-hidden bg-stone-100 max-h-[360px]">
                <img 
                  src={featuredPost.coverImage} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-serif italic mb-6">
              "{featuredPost.excerpt}"
            </p>

            <a 
              href={`${homeUrl}/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-stone-950 uppercase tracking-wider hover:text-amber-950"
            >
              Read Full Monograph &rarr;
            </a>
          </div>
        )}

        {/* Grid of Remaining Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {remainingPosts.map((post, pIdx) => (
            <article 
              key={pIdx} 
              className="p-8 rounded-3xl bg-white border border-stone-200/90 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="font-sans text-xs text-stone-400">{post.readTime}</span>
                </div>

                <h3 className="font-serif text-2xl text-stone-950 group-hover:text-stone-600 transition leading-snug mb-3">
                  <a href={`${homeUrl}/blog/${post.slug}`}>
                    {post.title}
                  </a>
                </h3>

                <p className="font-sans text-sm text-stone-600 font-light leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between font-sans text-xs">
                <span className="text-stone-400">{post.date}</span>
                <a 
                  href={`${homeUrl}/blog/${post.slug}`}
                  className="font-semibold text-stone-950 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                >
                  <span>Read Essay</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#141210] text-stone-400 font-sans text-xs py-12 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-serif text-lg text-white block mb-1">{site.name}</span>
            <p className="text-stone-500 text-[11px]">&copy; {new Date().getFullYear()} {site.location} Studio. Monograph archive index.</p>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <a href={homeUrl} className="hover:text-white transition">Home</a>
            <a href={`${homeUrl}#services`} className="hover:text-white transition">Services</a>
            <a href={`${homeUrl}#about`} className="hover:text-white transition">About</a>
            <a href={`${homeUrl}#contact`} className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
