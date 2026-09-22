import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-[#888888] hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">How It Works</h1>
        <p className="text-xl text-[#888888] mb-12">Three steps to automated authority.</p>
        
        <div className="space-y-8">
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl">
            <h2 className="text-xl font-semibold mb-2">1. Connect Your Accounts</h2>
            <p className="text-[#888888]">Head to the dashboard and authorize our application to post on your behalf to Medium, Blogger, Dev.to, and Hashnode. We use official APIs so your passwords stay secure.</p>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl">
            <h2 className="text-xl font-semibold mb-2">2. Paste Your URLs</h2>
            <p className="text-[#888888]">Drop your target URLs into the bulk upload tool. You can submit a single blog post or a list of 50 pages you want to build links for.</p>
          </div>
          <div className="p-6 border border-[#222222] bg-[#111111] rounded-xl">
            <h2 className="text-xl font-semibold mb-2">3. Let the System Run</h2>
            <p className="text-[#888888]">We take over. The AI reads your posts, rewrites them into fresh articles, fetches cover images, and publishes them across your connected networks with contextual backlinks pointing back to you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
