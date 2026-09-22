"use client";

import Link from "next/link";
import { ArrowRight, Zap, Globe, ShieldCheck, Activity, Layers, Workflow, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 overflow-hidden font-sans">
      
      {/* Premium Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-[#020617]/70 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Nexus<span className="text-cyan-400">Syndicator</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide text-slate-400">
          <Link href="/features" className="hover:text-white transition-all duration-300 hover:scale-105">Platform</Link>
          <Link href="/how-it-works" className="hover:text-white transition-all duration-300 hover:scale-105">How it Works</Link>
          <Link href="/integrations" className="hover:text-white transition-all duration-300 hover:scale-105">Integrations</Link>
          <Link href="/pricing" className="hover:text-white transition-all duration-300 hover:scale-105">Pricing</Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="group relative px-5 py-2.5 rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-transform duration-300 group-hover:scale-105"></div>
            <div className="relative text-sm font-bold text-slate-950 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <motion.main style={{ y, opacity }} className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[90vh]">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[600px] md:h-[600px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[50vw] h-[50vw] md:w-[500px] md:h-[500px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse duration-[5000ms]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-xl">
            <Sparkles className="w-4 h-4" />
            Built for SEO Agencies
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white">
            Automate your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 drop-shadow-sm">
              Backlink Strategy.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl font-medium leading-relaxed">
            Stop building links manually. Connect your Web 2.0 accounts once, drop your target URLs, and let our system automatically publish highly relevant, unique articles across your entire network.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-1"
            >
              Start Automating
              <span className="p-1 rounded-full bg-slate-100 group-hover:bg-cyan-100 transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-900 group-hover:text-cyan-600" />
              </span>
            </Link>
          </motion.div>

          {/* Trusted Networks - Marquee Style */}
          <motion.div variants={itemVariants} className="mt-28 w-full border-t border-white/10 pt-10 relative">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Natively integrated platforms</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
              {['Medium', 'LinkedIn', 'Dev.to', 'Hashnode', 'Blogger', 'Substack'].map((platform) => (
                <span key={platform} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-300 hover:text-white transition-colors cursor-default drop-shadow-md">
                  {platform}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Bento Grid Features */}
      <section className="py-32 bg-[#020617] relative z-20" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Built to Scale</h2>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">Run bulk campaigns across hundreds of domains automatically. Save hours of manual labor every week.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Big Bento Item */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-cyan-500/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-[#050B14] p-10 rounded-[22px] border border-white/5 overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-500/20">
                  <Activity className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Smart Content Rewriting</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  We generate unique variations of your content for every single post. This prevents duplicate content penalties and ensures your target URLs get maximum SEO value from every placement.
                </p>
                
                {/* Decorative UI inside card */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-900/30 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Small Bento Item 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/30 transition-colors duration-500"
            >
              <div className="relative h-full bg-[#050B14] p-8 rounded-[22px] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Safe & Natural</h3>
                <p className="text-slate-400 leading-relaxed">
                  Submissions are automatically throttled and paced to look like normal human behavior, keeping your accounts safe.
                </p>
              </div>
            </motion.div>

            {/* Small Bento Item 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/30 transition-colors duration-500"
            >
              <div className="relative h-full bg-[#050B14] p-8 rounded-[22px] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/20">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Agency Bulk Processing</h3>
                <p className="text-slate-400 leading-relaxed">
                  Paste up to 500 URLs at once. Setup your campaign in minutes and let it run in the background.
                </p>
              </div>
            </motion.div>

            {/* Small Bento Item 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-emerald-500/30 transition-colors duration-500"
            >
              <div className="relative h-full bg-[#050B14] p-10 rounded-[22px] border border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Layers className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Premium Cover Photos</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Forget about weird AI-generated images. We pull high-resolution, relevant stock photography from Unsplash to make your articles look professional.
                  </p>
                </div>
                {/* Decorative mock image */}
                <div className="w-full md:w-64 h-48 rounded-xl bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600')] bg-cover bg-center shadow-2xl shadow-emerald-500/20 border border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
