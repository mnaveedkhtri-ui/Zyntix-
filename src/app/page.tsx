import Link from "next/link";
import { ArrowRight, Box, Check, Globe, Layout, Link2, Search, Settings, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-blue-600/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Nexus</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888888]">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-[#888888] hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] text-sm text-[#A0A0A0] font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Bulk processing is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
          Automate your backlinks.<br />
          Scale your SEO.
        </h1>
        
        <p className="text-lg md:text-xl text-[#888888] mb-10 max-w-2xl mx-auto font-normal">
          Stop buying expensive guest posts. Connect your accounts, paste your URLs, and let our system publish optimized content to Medium, Blogger, and Dev.to automatically.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Start your first campaign <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/how-it-works"
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white border border-[#333333] font-semibold rounded-lg hover:bg-[#222222] transition-colors"
          >
            Read the docs
          </Link>
        </div>

        {/* Mockup / Dashboard Preview */}
        <div className="mt-20 rounded-xl border border-[#333333] bg-[#0A0A0A] p-2 md:p-4 shadow-2xl">
          <div className="rounded-lg border border-[#222222] bg-[#111111] overflow-hidden">
            {/* Fake Mac Window Header */}
            <div className="h-10 border-b border-[#222222] bg-[#0A0A0A] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Fake Dashboard Content */}
            <div className="p-8 text-left grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 w-32 bg-[#222222] rounded"></div>
                <div className="h-32 w-full bg-[#1A1A1A] border border-[#333333] rounded-lg"></div>
                <div className="h-10 w-40 bg-blue-600 rounded-md"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-24 bg-[#222222] rounded"></div>
                <div className="h-12 w-full bg-[#1A1A1A] border border-[#333333] rounded-lg"></div>
                <div className="h-12 w-full bg-[#1A1A1A] border border-[#333333] rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Logos */}
      <section className="border-y border-[#222222] bg-[#111111] py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-[#666666] mb-6">Supported publishing platforms</p>
          <div className="flex flex-wrap justify-center gap-12 text-[#666666]">
            {['Medium', 'LinkedIn', 'Dev.to', 'Hashnode', 'Blogger'].map((platform) => (
              <span key={platform} className="text-xl font-bold">{platform}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Text / Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Bulk syndication for agencies</h2>
            <p className="text-[#888888] text-lg leading-relaxed mb-6">
              Processing one link at a time takes too long. We built a bulk engine that handles up to 50 URLs in a single run. The system spaces out the publishing automatically so your accounts stay safe.
            </p>
            <ul className="space-y-3 text-[#A0A0A0]">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Paste multiple URLs at once</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Automatic background queue</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Live progress tracking</li>
            </ul>
          </div>
          <div className="h-80 bg-[#111111] border border-[#333333] rounded-xl p-8 flex flex-col justify-center gap-4">
            <div className="w-full h-12 bg-[#1A1A1A] rounded flex items-center px-4 border border-[#222222]"><span className="text-sm text-[#666666]">https://client1.com/seo-post</span></div>
            <div className="w-full h-12 bg-[#1A1A1A] rounded flex items-center px-4 border border-[#222222]"><span className="text-sm text-[#666666]">https://client2.com/marketing</span></div>
            <div className="w-full h-12 bg-[#1A1A1A] rounded flex items-center px-4 border border-[#222222]"><span className="text-sm text-[#666666]">https://client3.com/update</span></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333333] rounded-lg flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart rewriting</h3>
            <p className="text-[#888888]">We read your original post and write a new variation that targets the same topic. It is entirely unique content so you avoid duplicate penalties.</p>
          </div>
          <div className="p-6">
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333333] rounded-lg flex items-center justify-center mb-4">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real stock photos</h3>
            <p className="text-[#888888]">Every post needs a good cover. Our system automatically grabs high quality photos from Unsplash based on the topic of your article.</p>
          </div>
          <div className="p-6">
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333333] rounded-lg flex items-center justify-center mb-4">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Contextual links</h3>
            <p className="text-[#888888]">The most important part. Your target URL is placed naturally inside the new content to pass maximum SEO value back to your main site.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Globe className="w-4 h-4 text-[#666666]" />
            <span className="text-[#666666] text-sm font-medium">Nexus Syndicator © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-[#666666]">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">Guides</Link>
            <Link href="/integrations" className="hover:text-white transition-colors">API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
