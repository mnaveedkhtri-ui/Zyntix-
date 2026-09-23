import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-8 py-24 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black mb-8">About <span className="text-emerald-400">Zyntix</span></h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p className="lead text-xl text-slate-400 mb-8">
            Zyntix was born out of a simple frustration: building high-authority local entity networks manually takes too much time, costs too much money, and requires complex proxy setups that constantly break.
          </p>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p>
                We believe that local businesses and SEO agencies deserve access to enterprise-grade ranking power without the enterprise price tag. By leveraging the official APIs of the world's most trusted cloud infrastructure (Google Cloud), we've engineered a way to pass unparalleled domain authority directly to your assets.
              </p>
            </div>
            
            <div className="bg-[#050B14] p-8 rounded-2xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">The Power of Google Stacking</h2>
              <p className="mb-4">
                Google trusts its own ecosystem more than anything else on the web. A public Google Document hosted on docs.google.com carries a native Domain Authority (DA) of 99. 
              </p>
              <p>
                Instead of buying toxic PBN links, Zyntix automates the creation of hundreds of deeply nested, highly optimized Google Drive assets that all point back to your main entity. It's clean, it's safe, and it's devastatingly effective.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Built for Agencies</h2>
              <p>
                Whether you are ranking a local plumber in London or a law firm in Dubai, Zyntix provides the heavy artillery you need. 100% automated, zero proxies required, and completely white-label ready.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
