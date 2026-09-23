import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-8 py-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
          <p>Last updated: September 2026</p>
          
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>At Zyntix, we prioritize your privacy. The only information we process is the data necessary to execute your SEO campaigns. This includes your target URLs, keywords, and the API keys you provide.</p>
          
          <h2 className="text-xl font-bold text-white">2. Local Storage of API Keys</h2>
          <p>For your security, <strong>we do not store your Google Cloud Service Account JSON keys on our servers.</strong> All sensitive API credentials are saved exclusively in your browser's <code>localStorage</code>. They are transmitted directly to the API endpoints during campaign execution and are never persisted in our database.</p>
          
          <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
          <p>We use the provided URLs and keywords strictly to generate documents and SEO assets on your behalf via the APIs you have authorized.</p>
          
          <h2 className="text-xl font-bold text-white">4. Third-Party Access</h2>
          <p>We do not sell, trade, or otherwise transfer your campaign data or client information to outside parties. Your SEO strategies remain entirely your own.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
