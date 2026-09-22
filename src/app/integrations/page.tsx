import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Integrations() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-[#888888] hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Integrations</h1>
        <p className="text-xl text-[#888888] mb-12">We natively support the most powerful Web 2.0 properties available today.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">Medium</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded">Available</span>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">Dev.to</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded">Available</span>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">Blogger</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded">Available</span>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">Hashnode</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded">Available</span>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">Tumblr</span>
            <span className="text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Coming Soon</span>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl flex items-center justify-between">
            <span className="text-lg font-bold">WordPress.com</span>
            <span className="text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
