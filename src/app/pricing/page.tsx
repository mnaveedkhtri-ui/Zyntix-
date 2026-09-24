import Link from "next/link";
import { Check, Mail, MessageCircle } from "lucide-react";
import NavBar from "@/components/NavBar";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30 font-sans">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Unlock Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Entity Stacking</span>
          </h1>
          <p className="text-lg text-slate-400">
            Join elite agencies scaling their SEO with automated DA-99 Google Link Wheels. No APIs required. Fully managed cloud infrastructure.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-[#050B14] border border-emerald-500/30 rounded-3xl p-8 relative shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
              Most Popular
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Agency Pro</h3>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-white">$299</span>
                <span className="text-slate-400 font-medium pb-1">/month</span>
              </div>
              <p className="text-sm text-emerald-400 font-medium">Billed manually via Wire/Crypto</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited Link Wheel Generations",
                "Fully Managed Google Apps Script",
                "Advanced AEO Content Spinner",
                "Automatic Daisy-Chain Interlinking",
                "Permanent Cloud Report Storage",
                "Priority 24/7 Agency Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <p className="text-center text-sm font-bold text-slate-500 mb-2">CONTACT SALES TO UPGRADE</p>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#25D366]/20">
                <MessageCircle className="w-5 h-5" />
                Message on WhatsApp
              </a>
              <a href="mailto:admin@zyntix.com" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all border border-slate-700">
                <Mail className="w-5 h-5" />
                Email Sales Team
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
