import React from 'react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  ArrowRight,
  BookOpen,
  Phone,
  Mail,
  Compass,
  CheckCircle2
} from '@/components/Icons';

interface ArticlePageProps {
  params: Promise<{ subdomain: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);
  if (!site) return { title: 'Article Not Found | Zyntix' };

  const post = site.posts?.find(p => p.slug === slug);
  if (!post) return { title: 'Article Not Found | Zyntix' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app';
  const siteUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${baseUrl}/site/${site.subdomain}`;
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} — ${site.name}`,
    description: post.excerpt,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: articleUrl,
      siteName: site.name,
      images: [
        {
          url: post.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.name || site.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

function renderInlineMarkdown(text: string) {
  // Support bold: **text**
  // Support italic: *text*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-stone-950 font-sans tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic text-stone-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: ArticlePageProps) {
  const { subdomain, slug } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  if (!site) {
    notFound();
  }

  const post = site.posts?.find(p => p.slug === slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = site.posts.filter(p => p.slug !== slug).slice(0, 2);

  const isStaging = subdomain === 'demo' || subdomain === site.subdomain;
  const homeUrl = isStaging ? `/site/${site.subdomain}` : '/';
  const blogIndexUrl = isStaging ? `/site/${site.subdomain}/blog` : '/blog';
  const canonicalBase = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app'}/site/${site.subdomain}`;

  // Dedicated JSON-LD Structured Data Schema for Article Rich Results
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.coverImage,
    'datePublished': post.date,
    'author': {
      '@type': 'Person',
      'name': post.author?.name || site.author.name,
      'jobTitle': site.author.credentials || 'Master Craftsman & Author'
    },
    'publisher': {
      '@type': 'Organization',
      'name': site.name,
      'url': canonicalBase
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${canonicalBase}/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Schema.org BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top Announcement Ribbon */}
      <div className="bg-[#1c1917] text-stone-300 py-2.5 px-4 text-xs font-sans border-b border-stone-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
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

      {/* Header & Navigation */}
      <header className="border-b border-stone-200/90 bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href={homeUrl} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center font-serif text-base font-bold shadow-sm group-hover:bg-amber-900 transition">
              {site.name.slice(0, 1)}
            </div>
            <div>
              <span className="text-lg tracking-tight font-normal text-stone-950 block leading-tight">
                {site.name}
              </span>
              <span className="text-[10px] text-stone-500 font-sans uppercase tracking-widest block">
                Research Journal
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4 font-sans text-xs">
            <a 
              href={blogIndexUrl}
              className="text-stone-600 hover:text-stone-950 transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Essays</span>
            </a>
            <a 
              href={`${homeUrl}#contact`}
              className="bg-stone-900 text-stone-50 px-4 py-2 rounded-xl text-xs font-medium hover:bg-amber-950 transition"
            >
              Commission Atelier
            </a>
          </div>
        </div>
      </header>

      {/* Main Long-Form Article */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 flex-1 w-full">
        {/* Breadcrumbs */}
        <nav className="font-sans text-xs text-stone-400 mb-8 flex items-center gap-2">
          <a href={homeUrl} className="hover:text-stone-800 transition flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>{site.name}</span>
          </a>
          <span>/</span>
          <a href={blogIndexUrl} className="hover:text-stone-800 transition">
            Journal
          </a>
          <span>/</span>
          <span className="text-stone-700 truncate max-w-[240px] sm:max-w-xs">{post.category}</span>
        </nav>

        {/* Title & Metadata */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 font-sans text-xs">
            <span className="font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded text-[11px] uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-stone-400">&bull;</span>
            <span className="text-stone-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal text-stone-950 tracking-tight leading-[1.18] mb-6 font-serif">
            {post.title}
          </h1>

          <p className="text-lg sm:text-2xl text-stone-700 font-serif italic leading-relaxed border-l-3 border-amber-900/60 pl-5 sm:pl-6 my-8">
            "{post.excerpt}"
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-stone-200/90 font-sans text-xs text-stone-600">
            <div className="flex items-center gap-3.5">
              <img 
                src={post.author?.avatar || site.author.avatar} 
                alt={post.author?.name || site.author.name} 
                className="w-10 h-10 rounded-full object-cover border border-stone-300"
              />
              <div>
                <span className="font-semibold text-stone-900 block text-sm">
                  {post.author?.name || site.author.name}
                </span>
                <span className="text-stone-500 text-[11px]">
                  {post.date} &bull; Field Researcher
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-400">
              <span className="text-[11px] hidden sm:inline">Permanent Colophon</span>
            </div>
          </div>
        </header>

        {/* Cover Photography */}
        {post.coverImage && (
          <div className="mb-14 rounded-3xl overflow-hidden bg-stone-100 shadow-md border border-stone-200/80">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-[280px] sm:h-[480px] object-cover filter contrast-[1.02]"
            />
            <div className="p-3 bg-stone-100/90 border-t border-stone-200 text-center font-sans text-[11px] text-stone-500">
              Documentary archival photography &bull; {site.location} Studio archives
            </div>
          </div>
        )}

        {/* Rich Long-Form Body Content */}
        <article className="space-y-7 text-stone-800 leading-[1.95] text-base sm:text-lg font-serif">
          {post.content.map((block, pIdx) => {
            if (block.startsWith('[AEO_ANSWER]:')) {
              const answer = block.replace('[AEO_ANSWER]:', '').trim();
              return (
                <div key={pIdx} className="my-10 p-6 sm:p-8 bg-[#f5ede3] border-l-4 border-amber-900 rounded-2xl font-sans text-sm sm:text-base text-stone-900 leading-relaxed shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-900 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-bold text-amber-950 font-sans">
                      Executive Direct Answer (#0 AEO Snippet)
                    </span>
                  </div>
                  <p className="font-sans leading-relaxed text-stone-800 text-[15px] sm:text-base">
                    {renderInlineMarkdown(answer)}
                  </p>
                </div>
              );
            }
            if (block.startsWith('### ') || block.startsWith('## ')) {
              return (
                <h2 key={pIdx} className="text-2xl sm:text-4xl font-normal text-stone-950 pt-12 pb-3 border-b border-stone-200/90 font-serif tracking-tight">
                  {block.replace(/^(### |## )/, '')}
                </h2>
              );
            }
            if (block.startsWith('#### ')) {
              return (
                <h3 key={pIdx} className="text-xl sm:text-2xl font-medium text-stone-900 pt-8 pb-2 font-serif text-amber-950">
                  {block.replace('#### ', '')}
                </h3>
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
                <blockquote key={pIdx} className="my-10 p-6 sm:p-8 bg-white/70 border-l-4 border-amber-900/70 rounded-r-2xl italic text-xl sm:text-2xl text-stone-800 font-serif shadow-xs">
                  &ldquo;{block.replace('> ', '').replace(/^"|"$/g, '')}&rdquo;
                </blockquote>
              );
            }
            if (block.startsWith('![')) {
              const match = block.match(/!\[(.*?)\]\((.*?)\)/);
              if (match) {
                return (
                  <figure key={pIdx} className="my-12 rounded-3xl overflow-hidden shadow-md border border-stone-200/90 bg-stone-100">
                    <img src={match[2]} alt={match[1]} className="w-full h-[320px] sm:h-[480px] object-cover filter contrast-[1.03]" />
                    <figcaption className="p-3.5 bg-stone-100/95 border-t border-stone-200/90 text-center font-sans text-xs text-stone-600">
                      <span className="font-semibold text-stone-900 mr-1.5 uppercase tracking-wider text-[11px]">Plate &bull;</span>
                      {match[1]}
                    </figcaption>
                  </figure>
                );
              }
            }
            // Numbered list items (e.g., 1. Modern EIFS...)
            const numMatch = block.match(/^(\d+)\.\s+(.*)$/);
            if (numMatch) {
              return (
                <div key={pIdx} className="my-3 p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-4">
                  <span className="w-8 h-8 rounded-xl bg-amber-900 text-stone-100 font-sans text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                    {numMatch[1]}
                  </span>
                  <div className="flex-1 font-sans text-sm sm:text-base text-stone-800 leading-relaxed">
                    {renderInlineMarkdown(numMatch[2])}
                  </div>
                </div>
              );
            }
            // FAQ format: **Question?** Answer
            if (block.startsWith('**') && block.includes('?**')) {
              const [qRaw, ...rest] = block.split('?**');
              const question = qRaw.replace(/^\*\*/, '') + '?';
              const answer = rest.join('?**').trim();
              return (
                <div key={pIdx} className="my-5 p-6 sm:p-7 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-900/30 transition">
                  <h4 className="font-serif text-lg sm:text-xl font-medium text-stone-950 mb-3 flex items-start gap-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-sans text-xs font-bold uppercase tracking-wider shrink-0 mt-0.5">
                      Q
                    </span>
                    <span>{question}</span>
                  </h4>
                  <div className="font-sans text-sm sm:text-base text-stone-700 leading-relaxed pl-10 border-l-2 border-amber-900/10">
                    {renderInlineMarkdown(answer)}
                  </div>
                </div>
              );
            }
            return (
              <p key={pIdx} className="leading-[1.95] text-stone-800 text-base sm:text-lg font-serif">
                {renderInlineMarkdown(block)}
              </p>
            );
          })}
        </article>

        {/* Author Bio Colophon */}
        <section className="mt-16 pt-12 border-t border-stone-300 bg-[#f5ede3] p-8 sm:p-10 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img 
              src={site.author.avatar} 
              alt={site.author.name} 
              className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-stone-300"
            />
            <div className="flex-1">
              <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-bold block mb-1">
                About The Author & Principle Investigator
              </span>
              <h3 className="text-2xl font-serif text-stone-950 font-normal mb-2">
                {site.author.name}
              </h3>
              <p className="text-stone-600 font-sans text-xs sm:text-sm leading-relaxed mb-4 font-light">
                {site.author.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-sans text-xs text-stone-500">
                <span>Practicing in {site.location}</span>
                <span>&bull;</span>
                <span>{site.author.credentials || 'Licensed Master Artisan'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                Continuing Field Inquiries
              </h3>
              <a href={blogIndexUrl} className="font-sans text-xs text-amber-950 font-semibold hover:underline">
                View All Journal Entries &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedPosts.map((rel, rIdx) => (
                <a 
                  key={rIdx} 
                  href={`${blogIndexUrl}/${rel.slug}`}
                  className="p-6 rounded-2xl bg-white border border-stone-200/90 hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-bold block mb-2">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-xl text-stone-950 font-normal group-hover:text-stone-600 transition leading-snug mb-3">
                      {rel.title}
                    </h4>
                    <p className="font-sans text-xs text-stone-600 line-clamp-2 font-light leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between font-sans text-xs text-stone-400">
                    <span>{rel.readTime}</span>
                    <span className="text-stone-900 font-medium group-hover:translate-x-1 transition-transform">
                      Read Essay &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#141210] text-stone-400 font-sans text-xs py-12 border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-serif text-lg text-white block mb-1">{site.name}</span>
            <p className="text-stone-500 text-[11px]">&copy; {new Date().getFullYear()} All field research and architectural drawings protected.</p>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <a href={homeUrl} className="hover:text-white transition">Home</a>
            <a href={blogIndexUrl} className="hover:text-white transition">Journal</a>
            <a href={`${homeUrl}#contact`} className="hover:text-white transition">Inquire</a>
            <a href={`${homeUrl}#privacy`} className="hover:text-white transition">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
