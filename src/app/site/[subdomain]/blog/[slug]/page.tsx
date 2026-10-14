import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { getSiteBySubdomainOrDomain, getSiteBySubdomainOrDomainAsync } from '@/lib/sites';
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

import { optimizeMetaTitle, optimizeMetaDescription } from '@/lib/seo-helpers';

interface ArticlePageProps {
  params: Promise<{ subdomain: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const site = await getSiteBySubdomainOrDomainAsync(subdomain);
  if (!site) return { title: 'Article Not Found | Zyntix' };

  const post = site.posts?.find(p => 
    p.slug === slug || 
    (slug === 'the-art-of-quiet-software' && p.slug === 'the-art-of-quiet-structures') || 
    (slug === 'the-art-of-quiet-structures' && p.slug === 'the-art-of-quiet-software')
  );
  if (!post) return { title: 'Article Not Found | Zyntix' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app';
  const effectiveBase = site.customDomain 
    ? (site.customDomain.startsWith('http') ? site.customDomain : `https://${site.customDomain}`)
    : baseUrl;
  const siteUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${baseUrl}/site/${site.subdomain}`;
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const iconUrl = `${baseUrl}/api/sites/${site.subdomain}/icon`;
  const dynamicOgUrl = `${baseUrl}/api/sites/${site.subdomain}/og?slug=${post.slug}`;

  const rawTitle = post.metaTitle || post.title;
  const rawDesc = post.metaDescription || post.excerpt;

  const metaTitle = optimizeMetaTitle(rawTitle, site.name);
  const metaDescription = optimizeMetaDescription(rawDesc, site.description);

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(effectiveBase),
    alternates: {
      canonical: articleUrl,
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: articleUrl,
      siteName: site.name,
      images: [
        {
          url: dynamicOgUrl,
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
      title: metaTitle,
      description: metaDescription,
      images: [dynamicOgUrl],
    },
    verification: {
      google: site.googleVerification || "gCz9yLEhlFt8IGLhyJZdLHR_v5PHJ7px4ot69CUB1pw",
    },
  };
}

const FALLBACK_ARCHITECTURAL_PHOTO = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

const KNOWN_DEAD_PHOTOS = [
  'photo-1541888946425-d0fbb186c5f7',
  'photo-1504917599217-d4dc5ebe6122',
  'photo-1541888946425-d0fbb186c5f8'
];

function sanitizePhotoUrl(url?: string): string {
  if (!url || typeof url !== 'string') return FALLBACK_ARCHITECTURAL_PHOTO;
  if (KNOWN_DEAD_PHOTOS.some(d => url.includes(d))) {
    return FALLBACK_ARCHITECTURAL_PHOTO;
  }
  return url;
}

function renderInlineMarkdown(text: string) {
  // Regex matches: [markdown link](url) OR **bold** OR *italic* OR `code`
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // 1. Markdown link: [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const linkText = match[1];
        const url = match[2];
        const isExternal = url.startsWith('http://') || url.startsWith('https://');

        if (isExternal) {
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-950 underline underline-offset-4 decoration-amber-900/50 hover:decoration-amber-950 hover:text-amber-900 font-medium inline-flex items-center gap-1 transition"
            >
              <span>{linkText}</span>
              <svg className="w-3 h-3 inline-block shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        }

        return (
          <a
            key={i}
            href={url}
            className="text-amber-950 underline underline-offset-4 decoration-amber-900/50 hover:decoration-amber-900 font-semibold transition"
          >
            {linkText}
          </a>
        );
      }
    }

    // 2. Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-stone-950 font-sans tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic text-stone-700">
          {part.slice(1, -1)}
        </em>
      );
    }

    // 4. Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-900 font-mono text-[0.88em]">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export default async function BlogPostPage({ params }: ArticlePageProps) {
  const { subdomain, slug } = await params;
  const site = await getSiteBySubdomainOrDomainAsync(subdomain);

  if (!site) {
    notFound();
  }

  const post = site.posts?.find(p => 
    p.slug === slug || 
    (slug === 'the-art-of-quiet-software' && p.slug === 'the-art-of-quiet-structures') || 
    (slug === 'the-art-of-quiet-structures' && p.slug === 'the-art-of-quiet-software')
  );
  if (!post) {
    notFound();
  }

  const relatedPosts = site.posts.filter(p => p.slug !== slug).slice(0, 2);

  const headersList = await headers();
  const host = (headersList.get("x-forwarded-host") || headersList.get("host") || "").toLowerCase().replace(/:\d+$/, "");
  const isCustomDomain = host !== "" && host !== "localhost" && !host.endsWith(".vercel.app") && host !== "zyntix.app" && host !== "www.zyntix.app";

  const homeUrl = isCustomDomain ? '/' : `/site/${site.subdomain}`;
  const blogIndexUrl = isCustomDomain ? '/blog' : `/site/${site.subdomain}/blog`;
  const canonicalBase = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://zyntix-studio-ivory.vercel.app'}/site/${site.subdomain}`;

  // Extract FAQs for Schema and Rich Snippets
  const faqs: Array<{ question: string; answer: string }> = [];
  for (let i = 0; i < post.content.length; i++) {
    const b = post.content[i].trim();
    if (b.startsWith('### ') && b.includes('?')) {
      const question = b.replace(/^###\s+/, '').trim();
      const next = post.content[i + 1]?.trim() || '';
      const answer = next && !next.startsWith('#') && !next.startsWith('**') && !next.startsWith('!') && !next.startsWith('|') && !next.startsWith('*') ? next : '';
      faqs.push({ question, answer });
    } else if (b.startsWith('**') && b.endsWith('**') && b.includes('?')) {
      const question = b.slice(2, -2).trim();
      const next = post.content[i + 1]?.trim() || '';
      const answer = next && !next.startsWith('#') && !next.startsWith('**') && !next.startsWith('!') && !next.startsWith('|') && !next.startsWith('*') ? next : '';
      faqs.push({ question, answer });
    } else if (b.startsWith('**') && b.includes('?**')) {
      const [qRaw, ...rest] = b.split('?**');
      const question = qRaw.replace(/^\*\*/, '').trim() + '?';
      const answer = rest.join('?**').trim();
      if (answer) {
        faqs.push({ question, answer });
      } else {
        const next = post.content[i + 1]?.trim() || '';
        const nextAnswer = next && !next.startsWith('#') && !next.startsWith('**') && !next.startsWith('!') && !next.startsWith('|') && !next.startsWith('*') ? next : '';
        faqs.push({ question, answer: nextAnswer });
      }
    }
  }

  // Extract Headings for Interactive Monograph Table of Contents (Major Chapters)
  const headings = post.content
    .filter(b => b.startsWith('## ') || (b.startsWith('### ') && !b.includes('?')))
    .map(b => {
      const text = b.replace(/^(### |## )/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { text, id };
    });

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

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': site.name,
        'item': canonicalBase
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Research Journal',
        'item': `${canonicalBase}/blog`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `${canonicalBase}/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Schema.org BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
              src={sanitizePhotoUrl(post.coverImage)} 
              alt={post.title} 
              className="w-full h-[280px] sm:h-[480px] object-cover filter contrast-[1.02]"
            />
            <div className="p-3 bg-stone-100/90 border-t border-stone-200 text-center font-sans text-[11px] text-stone-500">
              Documentary archival photography &bull; {site.location} Studio archives
            </div>
          </div>
        )}

        {/* Table of Contents / Monograph Index */}
        {headings.length > 0 && (
          <div className="mb-12 p-6 sm:p-7 bg-[#fbf9f6] rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <Compass className="w-4 h-4 text-amber-900" />
              <span className="font-sans text-xs uppercase tracking-widest font-bold text-amber-950">
                Monograph Index & Field Inquiries
              </span>
            </div>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-sans">
              {headings.map((h, i) => (
                <a
                  key={i}
                  href={`#${h.id}`}
                  className="text-stone-700 hover:text-amber-950 hover:underline flex items-start gap-2 py-1 transition group"
                >
                  <span className="text-amber-900/60 font-mono font-bold group-hover:text-amber-900">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="font-medium line-clamp-1 text-stone-800 group-hover:text-amber-950">{h.text}</span>
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Rich Long-Form Body Content */}
        <article className="space-y-7 text-stone-800 leading-[1.95] text-base sm:text-lg font-serif">
          {(() => {
            type RenderItem = 
              | { kind: 'block'; text: string }
              | { kind: 'table'; headers: string[]; rows: string[][] };

            const items: RenderItem[] = [];
            let tableBuffer: string[] = [];

            const flushTable = () => {
              if (tableBuffer.length === 0) return;
              const cleanRows = tableBuffer
                .filter(r => !r.includes(':---'))
                .map(r => r.split('|').map(c => c.trim()).filter(Boolean));
              if (cleanRows.length > 0) {
                items.push({
                  kind: 'table',
                  headers: cleanRows[0],
                  rows: cleanRows.slice(1)
                });
              }
              tableBuffer = [];
            };

            for (const b of post.content) {
              const trimmed = b.trim();
              if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                tableBuffer.push(trimmed);
              } else {
                flushTable();
                items.push({ kind: 'block', text: b });
              }
            }
            flushTable();

            return items.map((item, pIdx) => {
              if (item.kind === 'table') {
                return (
                  <div key={pIdx} className="my-10 overflow-x-auto rounded-2xl border border-stone-200/90 shadow-sm bg-white">
                    <table className="w-full text-left font-sans text-xs sm:text-sm">
                      <thead className="bg-[#f5ede3] text-stone-900 border-b border-stone-200">
                        <tr>
                          {item.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px] text-amber-950">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {item.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/20 transition">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-5 py-4 text-stone-700 leading-relaxed font-normal">
                                {renderInlineMarkdown(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              const block = item.text;
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
              if (block.startsWith('## ')) {
                const text = block.replace(/^## /, '').trim();
                const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <h2 key={pIdx} id={headingId} className="text-2xl sm:text-4xl font-normal text-stone-950 pt-12 pb-3 border-b border-stone-200/90 font-serif tracking-tight scroll-mt-24">
                    {text}
                  </h2>
                );
              }
              if (block.startsWith('### ')) {
                const text = block.replace(/^### /, '').trim();
                const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const isFaq = text.includes('?');
                return (
                  <h3 key={pIdx} id={headingId} className="text-xl sm:text-2xl font-medium text-stone-900 pt-8 pb-2 font-serif text-amber-950 scroll-mt-24 flex items-start gap-2.5">
                    {isFaq && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-sans text-[11px] font-bold tracking-wider shrink-0 mt-1">
                        Q
                      </span>
                    )}
                    <span>{renderInlineMarkdown(text)}</span>
                  </h3>
                );
              }
              if (block.startsWith('#### ')) {
                const text = block.replace('#### ', '').trim();
                const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <h4 key={pIdx} id={headingId} className="text-lg sm:text-xl font-medium text-stone-900 pt-6 pb-2 font-serif text-stone-900 scroll-mt-24">
                    {text}
                  </h4>
                );
              }
              // Italic note / Subheading / Citation link
              if (block.startsWith('*') && block.endsWith('*') && !block.startsWith('**')) {
                const inner = block.slice(1, -1);
                // If it's a cross-reference link or authoritative citation
                if (inner.includes('[') && inner.includes('](')) {
                  return (
                    <div key={pIdx} className="my-6 p-4 rounded-2xl bg-[#f5ede3] border border-amber-900/15 text-xs sm:text-sm font-sans text-stone-700 italic flex items-center gap-2 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0" />
                      <div>{renderInlineMarkdown(inner)}</div>
                    </div>
                  );
                }
                return (
                  <p key={pIdx} className="text-stone-600 font-sans text-xs sm:text-sm tracking-wide font-medium italic -mt-1 mb-4">
                    {renderInlineMarkdown(inner)}
                  </p>
                );
              }

              // Bold heading or standalone FAQ Question: **Is lime mortar completely illegal in Australia?**
              if (block.startsWith('**') && block.endsWith('**')) {
                const clean = block.slice(2, -2).trim();
                return (
                  <h3 key={pIdx} className="font-serif text-lg sm:text-xl font-semibold text-stone-950 mt-8 mb-2 flex items-start gap-2.5">
                    {clean.includes('?') && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-sans text-[11px] font-bold tracking-wider shrink-0 mt-0.5">
                        Q
                      </span>
                    )}
                    <span>{renderInlineMarkdown(clean)}</span>
                  </h3>
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
                      <img 
                        src={sanitizePhotoUrl(match[2])} 
                        alt={match[1]} 
                        loading="lazy" 
                        className="w-full h-[320px] sm:h-[480px] object-cover filter contrast-[1.03]" 
                      />
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
            });
          })()}
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
