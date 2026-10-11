import React from 'react';
import { getSiteBySubdomainOrDomain } from '@/lib/sites';

interface SitePageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function TenantSitePage({ params }: SitePageProps) {
  const { subdomain } = await params;
  const site = getSiteBySubdomainOrDomain(subdomain);

  if (!site) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col items-center justify-center p-8 text-center font-serif">
        <h1 className="text-3xl font-normal mb-3 text-stone-800">Publication Not Found</h1>
        <p className="text-stone-600 max-w-md font-sans text-sm mb-6 leading-relaxed">
          The requested journal <code className="bg-stone-200/80 px-2 py-1 rounded text-stone-900 font-mono text-xs">"{subdomain}"</code> has not been penned yet.
        </p>
        <a 
          href="/studio"
          className="font-sans text-xs uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-600 transition"
        >
          Create this journal in Studio &rarr;
        </a>
      </div>
    );
  }

  const featuredPost = site.posts[0];
  const regularPosts = site.posts.slice(1);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased">
      {/* Top Editorial Header */}
      <header className="border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <a href={`/site/${site.subdomain}`} className="text-2xl sm:text-3xl tracking-tight font-normal text-stone-900 hover:text-stone-700 transition">
              {site.name}
            </a>
          </div>

          <nav className="flex items-center gap-6 text-xs uppercase tracking-widest font-sans text-stone-600 font-medium">
            {site.navigation.map((item, idx) => (
              <a 
                key={idx} 
                href={item.href}
                className="hover:text-stone-950 transition hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Masthead Banner */}
      <section className="py-16 sm:py-24 border-b border-stone-200/80">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-4 font-semibold">
            {site.niche} &bull; Edited by {site.author.name}
          </p>
          <h1 className="text-3xl sm:text-5xl font-normal leading-[1.25] text-stone-900 tracking-tight mb-6">
            "{site.tagline}"
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            {site.description}
          </p>
        </div>
      </section>

      {/* Main Content Feed */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Featured Story */}
        {featuredPost && (
          <article className="mb-20 pb-16 border-b border-stone-200">
            <span className="font-sans text-[11px] uppercase tracking-widest text-amber-900 font-semibold bg-amber-100/60 px-3 py-1 rounded mb-4 inline-block">
              {featuredPost.category}
            </span>

            <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 tracking-tight leading-[1.3] mb-4 hover:text-stone-700 transition">
              {featuredPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs font-sans text-stone-500 mb-6">
              <span className="font-medium text-stone-800">{featuredPost.author.name}</span>
              <span>&bull;</span>
              <span>{featuredPost.date}</span>
              <span>&bull;</span>
              <span>{featuredPost.readTime}</span>
            </div>

            {featuredPost.coverImage && (
              <div className="mb-8 rounded-lg overflow-hidden bg-stone-100 shadow-sm border border-stone-200/60">
                <img 
                  src={featuredPost.coverImage} 
                  alt={featuredPost.title} 
                  className="w-full h-[380px] object-cover filter contrast-[1.02]"
                />
              </div>
            )}

            <p className="text-lg text-stone-700 leading-relaxed font-sans font-light mb-8">
              {featuredPost.excerpt}
            </p>

            {/* Structured Paragraphs with AEO Answer, Headings and Quotes */}
            <div className="space-y-6 text-stone-800 leading-[1.85] text-base sm:text-lg font-serif">
              {featuredPost.content.map((block, pIdx) => {
                if (block.startsWith('[AEO_ANSWER]:')) {
                  const answer = block.replace('[AEO_ANSWER]:', '').trim();
                  return (
                    <div key={pIdx} className="my-8 p-6 bg-[#f4eee6] border-l-4 border-amber-800 rounded-r-lg font-sans text-sm sm:text-base text-stone-800 leading-relaxed">
                      <span className="block text-xs uppercase tracking-wider font-bold text-amber-900 mb-1">
                        Executive Summary (Answer at a Glance)
                      </span>
                      {answer}
                    </div>
                  );
                }
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-2xl sm:text-3xl font-normal text-stone-900 pt-6 pb-2 border-b border-stone-200/60">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.startsWith('*') && block.endsWith('*')) {
                  return (
                    <p key={pIdx} className="text-stone-500 font-sans text-sm uppercase tracking-wider font-medium">
                      {block.replace(/\*/g, '')}
                    </p>
                  );
                }
                if (block.startsWith('> ')) {
                  return (
                    <blockquote key={pIdx} className="my-8 pl-6 border-l-2 border-stone-400 italic text-xl text-stone-700 font-serif">
                      {block.replace('> ', '')}
                    </blockquote>
                  );
                }
                return <p key={pIdx}>{block}</p>;
              })}
            </div>

            <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between font-sans text-xs">
              <span className="text-stone-500">&larr; Read all published journals</span>
              <span className="text-stone-500">Verified by Human Editor</span>
            </div>
          </article>
        )}

        {/* Chronological Essays */}
        <div className="space-y-16">
          <h3 className="font-sans text-xs uppercase tracking-widest text-stone-400 font-semibold pb-4 border-b border-stone-200">
            Archival Entries & Research Notes
          </h3>

          {regularPosts.map((post, index) => (
            <article key={index} className="group pb-10 border-b border-stone-100 last:border-b-0">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-medium">
                  {post.category}
                </span>
                <span className="font-sans text-xs text-stone-400">
                  {post.date} &bull; {post.readTime}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-normal text-stone-900 group-hover:text-stone-600 transition leading-snug mb-3">
                {post.title}
              </h4>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans font-light mb-4">
                {post.excerpt}
              </p>

              <span className="font-sans text-xs text-stone-900 font-medium group-hover:underline underline-offset-4 cursor-pointer">
                Read reflection &rarr;
              </span>
            </article>
          ))}
        </div>

        {/* Colophon Section */}
        <section id="about" className="mt-24 p-8 sm:p-10 rounded-2xl bg-[#f4f0eb] border border-stone-200/80">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img 
              src={site.author.avatar} 
              alt={site.author.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div>
              <span className="font-sans text-[11px] uppercase tracking-widest text-stone-500 font-semibold block mb-1">
                About The Author & Editor
              </span>
              <h5 className="text-2xl font-normal text-stone-900 mb-2">
                {site.author.name}
              </h5>
              <p className="text-stone-600 font-sans text-sm leading-relaxed mb-4 font-light">
                {site.author.bio}
              </p>
              <div className="font-sans text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-4">
                <a href={`mailto:${site.contact.email}`} className="text-stone-900 underline hover:text-stone-600">
                  {site.contact.email}
                </a>
                {site.contact.twitter && (
                  <span>{site.contact.twitter}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section id="newsletter" className="mt-16 py-12 text-center border-t border-stone-200">
          <h5 className="text-2xl font-normal text-stone-900 mb-2">Receive new essays via post</h5>
          <p className="font-sans text-xs text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
            Delivered directly to your inbox every Sunday morning. No promotions, ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address..." 
              className="w-full sm:flex-1 bg-white border border-stone-300 rounded-md px-4 py-2.5 text-xs text-stone-900 font-sans focus:outline-none focus:border-stone-800"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-stone-50 rounded-md font-sans text-xs font-medium hover:bg-stone-800 transition tracking-wide cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 text-stone-500 font-sans text-xs">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} {site.name}. All thoughtful rights reserved.</p>
          <p className="text-stone-400">Pure human craftsmanship. Hosted on Zyntix.</p>
        </div>
      </footer>
    </div>
  );
}
