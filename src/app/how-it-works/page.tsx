import Link from "next/link";
import { Database, ShieldCheck, Zap } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Zyntix</span>
        </Link>
        <Link href="/dashboard" className="text-emerald-400 font-bold hover:text-emerald-300">Access Dashboard</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-24">
        <h1 className="text-4xl font-black mb-16 text-center">How <span className="text-emerald-400">Google Stacking</span> Works</h1>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">1</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#050B14] p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-xl mb-2 text-white">Connect Your Cloud API</h3>
              <p className="text-slate-400 text-sm">generate a free JSON Service Account key from Google Cloud Console and paste it into Zyntix Settings.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">2</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#050B14] p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-xl mb-2 text-white">Configure Bulk Campaign</h3>
              <p className="text-slate-400 text-sm">Enter your client's target URL, main keyword, and the desired quantity of documents/pages (up to 500 at once).</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-emerald-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">3</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#050B14] p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-xl mb-2 text-white">Deploy & Extract URLs</h3>
              <p className="text-slate-400 text-sm">Zyntix engine automatically loops through the API, generating live public documents and saving the Live URLs directly to your dashboard report.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

