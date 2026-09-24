import Link from "next/link";
import { Check, Mail, MessageCircle, Zap, Shield, Crown } from "lucide-react";
import NavBar from "@/components/NavBar";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30 font-sans">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Simple Pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Maximum Power</span>
          </h1>
          <p className="text-lg text-slate-400">
            Start with 20 free credits. Top up your account when you need more DA-99 Entity Stacks. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Basic Plan */}
          <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-all flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-slate-400 font-medium pb-1">/one-time</span>
              </div>
              <p className="text-sm text-slate-400">Perfect for small websites.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">100 Credits</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">DA-99 Backlinks</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">Standard Support</span></li>
            </ul>
            <a href="https://wa.me/923323219981" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all">
              <MessageCircle className="w-5 h-5" /> Buy Starter
            </a>
          </div>

          {/* Standard Plan */}
          <div className="bg-[#050B14] border border-emerald-500/30 rounded-3xl p-8 relative shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)] flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
              Most Popular
            </div>
            <div className="mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-slate-400 font-medium pb-1">/one-time</span>
              </div>
              <p className="text-sm text-emerald-400 font-medium">For growing agencies.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">300 Credits</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">Automated Interlinking</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">Priority Cloud Storage</span></li>
            </ul>
            <a href="https://wa.me/923323219981" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#25D366]/20">
              <MessageCircle className="w-5 h-5" /> Buy Pro
            </a>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-all flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-slate-400 font-medium pb-1">/one-time</span>
              </div>
              <p className="text-sm text-slate-400">Scale without limits.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">1000 Credits</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">Dedicated Master Key</span></li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /><span className="text-slate-300 font-medium">24/7 WhatsApp Support</span></li>
            </ul>
            <a href="mailto:naveedkhtri7@gmail.com" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all">
              <Mail className="w-5 h-5" /> Email Us
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}
