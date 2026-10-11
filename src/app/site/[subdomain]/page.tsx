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
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col items-center justify-center p-6 text-center font-serif">
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

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-stone-900 antialiased flex flex-col justify-between">
      {/* Top Editorial Masthead (Mobile + Laptop Ultra Responsive) */}
      <header className="border-b border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-18 sm:h-22 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-xs font-serif font-bold shrink-0">
              {site.name.slice(0, 1)}
            </span>
            <a 
              href={`/site/${site.subdomain}`} 
              className="text-xl sm:text-3xl tracking-tight font-normal text-stone-950 hover:text-stone-700 transition"
            >
              {site.name}
            </a>
          </div>

          <nav className="flex items-center gap-4 sm:gap-8 text-[11px] sm:text-xs uppercase tracking-widest font-sans text-stone-600 font-medium">
            {site.navigation.map((item, idx) => (
              <a 
                key={idx} 
                href={item.href}
                className="hover:text-stone-950 transition hover:underline underline-offset-4 hidden xs:inline-block"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#newsletter"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-900 text-stone-950 hover:bg-stone-900 hover:text-stone-50 transition text-[11px] font-sans font-semibold"
            >
              Subscribe
            </a>
          </nav>
        </div>
      </header>

      {/* Hero / Statement Section */}
      <section className="py-14 sm:py-24 border-b border-stone-200/80 bg-gradient-to-b from-[#faf8f5] via-[#f7f3ee] to-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 text-stone-700 font-sans text-[11px] uppercase tracking-wider font-semibold mb-6">
            <span>{site.niche}</span>
            <span>&bull;</span>
            <span>Edited by {site.author.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.2] text-stone-950 tracking-tight mb-6">
            "{site.tagline}"
          </h1>

          <p className="text-base sm:text-xl text-stone-600 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            {site.description}
          </p>
        </div>
      </section>

      {/* Main Journal Feed */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex-1 w-full">
        {/* Featured Story */}
        {featuredPost && (
          <article className="mb-16 sm:mb-24 pb-14 sm:pb-20 border-b border-stone-200">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="font-sans text-[11px] uppercase tracking-widest text-amber-900 font-semibold bg-amber-100/70 px-3 py-1 rounded">
                {featuredPost.category}
              </span>
              <span className="text-xs text-stone-400 font-sans">&bull;</span>
              <span className="text-xs text-stone-500 font-sans font-medium">{featuredPost.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-stone-950 tracking-tight leading-[1.25] mb-4 hover:text-stone-700 transition">
              {featuredPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs font-sans text-stone-500 mb-8">
              <img 
                src={featuredPost.author.avatar} 
                alt={featuredPost.author.name} 
                className="w-7 h-7 rounded-full object-cover border border-stone-300"
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
                  className="w-full h-[240px] sm:h-[420px] md:h-[480px] object-cover filter contrast-[1.02] hover:scale-102 transition duration-500"
                />
              </div>
            )}

            <p className="text-lg sm:text-2xl text-stone-800 leading-relaxed font-serif italic mb-8 border-l-2 border-stone-400 pl-4 sm:pl-6">
              "{featuredPost.excerpt}"
            </p>

            {/* Paragraphs with AEO Executive Summary, Headings, and Quotes */}
            <div className="space-y-6 text-stone-800 leading-[1.9] text-base sm:text-xl font-serif">
              {featuredPost.content.map((block, pIdx) => {
                if (block.startsWith('[AEO_ANSWER]:')) {
                  const answer = block.replace('[AEO_ANSWER]:', '').trim();
                  return (
                    <div key={pIdx} className="my-8 sm:my-12 p-6 sm:p-8 bg-[#f5ede3] border-l-4 border-amber-900 rounded-r-2xl font-sans text-sm sm:text-base text-stone-900 leading-relaxed shadow-sm">
                      <span className="block text-xs uppercase tracking-widest font-bold text-amber-950 mb-2">
                        Summary (Answer at a Glance)
                      </span>
                      {answer}
                    </div>
                  );
                }
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-2xl sm:text-3xl md:text-4xl font-normal text-stone-950 pt-8 pb-3 border-b border-stone-200">
                      {block.replace('### ', '')}
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
                    <blockquote key={pIdx} className="my-8 sm:my-10 pl-6 border-l-3 border-stone-400 italic text-xl sm:text-2xl text-stone-800 font-serif">
                      {block.replace('> ', '')}
                    </blockquote>
                  );
                }
                return <p key={pIdx} className="leading-relaxed">{block}</p>;
              })}
            </div>
          </article>
        )}

        {/* Chronological Essays Grid */}
        <div className="space-y-12 sm:space-y-16">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-sans text-xs uppercase tracking-widest text-stone-500 font-bold">
              Archival Entries & Field Investigations
            </h3>
            <span className="font-sans text-xs text-stone-400">
              {regularPosts.length} Earlier Stories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {regularPosts.map((post, index) => (
              <article key={index} className="group flex flex-col justify-between bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="font-sans text-xs text-stone-400">
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-normal text-stone-950 group-hover:text-stone-600 transition leading-snug mb-3">
                    {post.title}
                  </h4>

                  <p className="text-stone-600 text-sm leading-relaxed font-sans font-light mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between font-sans text-xs">
                  <span className="text-stone-500">{post.date}</span>
                  <span className="text-stone-950 font-semibold group-hover:translate-x-1 transition-transform">
                    Read Story &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Author Colophon Box */}
        <section id="about" className="mt-20 sm:mt-28 p-8 sm:p-12 rounded-3xl bg-[#f5ede3] border border-stone-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            <img 
              src={site.author.avatar} 
              alt={site.author.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md shrink-0"
            />
            <div className="flex-1">
              <span className="font-sans text-[11px] uppercase tracking-widest text-amber-950 font-bold block mb-1">
                Published & Verified By
              </span>
              <h5 className="text-2xl sm:text-3xl font-normal text-stone-950 mb-2">
                {site.author.name}
              </h5>
              <p className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed mb-4 font-light">
                {site.author.bio}
              </p>
              <div className="font-sans text-xs text-stone-600 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <a href={`mailto:${site.contact.email}`} className="text-stone-950 underline font-medium hover:text-stone-700">
                  {site.contact.email}
                </a>
                {site.contact.twitter && (
                  <span>Twitter: {site.contact.twitter}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section id="newsletter" className="mt-16 sm:mt-24 py-12 sm:py-16 text-center border-t border-stone-200">
          <h5 className="text-2xl sm:text-3xl font-normal text-stone-950 mb-3">Join the Weekly Dispatch</h5>
          <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
            Delivered directly to your inbox every Sunday morning. Thoughtful long-form essays with zero promotional fluff.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your personal email address..." 
              className="w-full sm:flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 font-sans focus:outline-none focus:border-stone-900 shadow-xs"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 text-stone-50 rounded-xl font-sans text-xs sm:text-sm font-medium hover:bg-stone-800 transition tracking-wide cursor-pointer shadow-sm"
            >
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-10 font-sans text-xs text-stone-500 bg-[#f7f3ee]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} {site.name}. All intellectual rights reserved.</p>
          <p className="text-stone-400">Written by humans &bull; Powered by Zyntix Autopilot</p>
        </div>
      </footer>
    </div>
  );
}
