import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-[#888888] hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Platform Features</h1>
        <p className="text-xl text-[#888888] mb-12">Everything you need to automate content syndication at scale.</p>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Content Spinner Engine</h2>
            <p className="text-[#888888]">We use state of the art natural language processing to rewrite your content. This ensures that every post sent to Web 2.0 properties is entirely unique, protecting you from duplicate content penalties.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Automated Queues</h2>
            <p className="text-[#888888]">You can paste up to 50 URLs at a time. Our backend processes them one by one, adding natural delays between publications to keep your accounts secure and looking like manual human activity.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Image Sourcing</h2>
            <p className="text-[#888888]">We extract the main topic of your post and automatically pull a related, high-resolution royalty-free image from Unsplash to use as the header.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
