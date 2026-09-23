import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6">Get in <span className="text-emerald-400">Touch</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Have a question about Zyntix, need custom agency pricing, or require technical support? We're here to help.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email Us</h3>
                  <p className="text-slate-400 text-sm">We usually respond within 24 hours.</p>
                </div>
              </div>
              <a href="mailto:naveedkhtri7@gmail.com" className="text-xl font-medium hover:text-emerald-400 transition-colors">naveedkhtri7@gmail.com</a>
            </div>

            <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">WhatsApp / Call</h3>
                  <p className="text-slate-400 text-sm">Direct line to our support & sales team.</p>
                </div>
              </div>
              <a href="https://wa.me/923323219981" target="_blank" className="text-xl font-medium hover:text-emerald-400 transition-colors">+92 332 3219981</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#050B14] p-8 rounded-3xl border border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                <input type="text" className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input type="email" className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="john@agency.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                <textarea rows={4} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

