import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <NavBar />

      <main className="max-w-4xl mx-auto px-8 py-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-16 text-center">How <span className="text-emerald-400">Semantic Syndication</span> Works</h1>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-black shadow-lg shadow-emerald-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#050B14] p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="font-bold text-xl mb-3 text-white">Connect Your Cloud API</h3>
              <p className="text-slate-400 leading-relaxed">Authenticate the Zyntix Cloud Engine with your secure Service Account to establish a decentralized node architecture.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-black shadow-lg shadow-emerald-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#050B14] p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="font-bold text-xl mb-3 text-white">Define Semantic Architecture</h3>
              <p className="text-slate-400 leading-relaxed">Input your core entity (target URL) and primary semantic query. Our AEO engine analyzes keyword intent to structure the knowledge graph.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-black shadow-lg shadow-emerald-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">3</div>
            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#050B14] p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="font-bold text-xl mb-3 text-white">Deploy Decentralized Entities</h3>
              <p className="text-slate-400 leading-relaxed">The Zyntix algorithm autonomously deploys live cloud entities (Docs, Slides, Forms), instantly daisy-chaining them to build a highly authoritative trust network targeting your domain.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
