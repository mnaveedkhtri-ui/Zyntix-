import Link from "next/link";
import { Database, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050B14] pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">Zyntix</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The premier Google Entity Stacking platform for SEO agencies. Build DA-99 authority networks on autopilot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">How it Works</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Dashboard Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-500" />
                <a href="mailto:naveedkhtri7@gmail.com" className="hover:text-white transition-colors">naveedkhtri7@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-emerald-500" />
                <a href="https://wa.me/923323219981" target="_blank" className="hover:text-white transition-colors">WhatsApp: +92 332 3219981</a>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>Global Digital Agency<br/>100% Remote</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Zyntix SEO. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Built for scale.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
