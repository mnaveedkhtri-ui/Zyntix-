"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Check, 
  Copy, 
  ArrowLeft, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  HelpCircle,
  ChevronDown
} from "lucide-react";

export default function DomainGuidePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedRegistrar, setSelectedRegistrar] = useState("godaddy");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-[#121316]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/studio"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Zyntix Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Official DNS Guide
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2-Minute Guaranteed Setup &bull; Zero Tech Jargon</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
            How to Connect Your Custom Domain
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Follow this click-by-click visual guide to point your custom domain (e.g. <code>moderntrendsnow.org</code>) to your live Zyntix website with free automatic SSL.
          </p>
        </div>

        {/* VIP WhatsApp Support Callout */}
        <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Want Us to Do It For You? 100% Free VIP Concierge</span>
            </div>
            <p className="text-zinc-300 text-xs">
              Agar aapko DNS samajh nahi araha, to tension na lein! Hum khud free mein aapka domain connect kar ke denge.
            </p>
          </div>
          <a
            href="https://wa.me/923323219981?text=Hi%20Zyntix,%20please%20help%20me%20connect%20my%20domain"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* The 2 DNS Values Box */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-200 text-sm uppercase tracking-wider">
              The 2 DNS Records You Need to Add
            </h2>
            <span className="text-[11px] text-zinc-400">Click button to copy value</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Record 1: A Record */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                  Record 1: Type A
                </span>
                <span className="text-zinc-400 text-xs">Host / Name: <strong className="text-white font-mono">@</strong></span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg font-mono text-base font-bold text-stone-100 flex items-center justify-between">
                <span>76.76.21.21</span>
                <button
                  onClick={() => copyToClipboard("76.76.21.21", "a-record")}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition"
                >
                  {copiedKey === "a-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "a-record" ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Points your main root domain (e.g. <code>moderntrendsnow.org</code>) to our Edge CDN.
              </p>
            </div>

            {/* Record 2: CNAME Record */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                  Record 2: Type CNAME
                </span>
                <span className="text-zinc-400 text-xs">Host / Name: <strong className="text-white font-mono">www</strong></span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg font-mono text-base font-bold text-stone-100 flex items-center justify-between">
                <span className="text-sm truncate">cname.vercel-dns.com</span>
                <button
                  onClick={() => copyToClipboard("cname.vercel-dns.com", "cname-record")}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition shrink-0 ml-2"
                >
                  {copiedKey === "cname-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "cname-record" ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Ensures visitors who type <code>www.yourdomain.com</code> reach your website seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Registrar Click-by-Click Guide */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-md">
          <div className="space-y-1">
            <h2 className="font-semibold text-stone-200 text-sm uppercase tracking-wider">
              Select Where You Bought Your Domain
            </h2>
            <p className="text-xs text-zinc-400">
              Click your provider below to view exact screenshot-matched instructions:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "godaddy", label: "GoDaddy" },
              { id: "namecheap", label: "Namecheap" },
              { id: "hostinger", label: "Hostinger" },
              { id: "cloudflare", label: "Cloudflare" },
              { id: "ionos", label: "IONOS (1&1)" },
              { id: "other", label: "Other / Custom" }
            ].map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedRegistrar(provider.id)}
                className={`p-3 rounded-xl border text-center transition cursor-pointer font-medium text-xs ${
                  selectedRegistrar === provider.id
                    ? "bg-stone-100 text-zinc-950 border-stone-100 shadow-md font-bold"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {provider.label}
              </button>
            ))}
          </div>

          {/* Guide Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-amber-300 text-sm">
              Click-by-Click Guide for {selectedRegistrar.toUpperCase()}:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300 text-xs leading-relaxed">
              {selectedRegistrar === "godaddy" && (
                <>
                  <li>Log in to <strong>GoDaddy</strong> and open <strong>Domain Portfolio</strong>.</li>
                  <li>Click on your domain &rarr; select <strong>DNS Records</strong> tab.</li>
                  <li>Purana <strong>Type A</strong> record (Name: @) dhoondhein aur <strong>Edit</strong> par click karein.</li>
                  <li>Value mein <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code> enter karein aur Save karein.</li>
                  <li>CNAME record (Name: www) mein value <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code> set karein.</li>
                </>
              )}
              {selectedRegistrar === "namecheap" && (
                <>
                  <li>Log in to <strong>Namecheap</strong> &rarr; <strong>Domain List</strong> &rarr; Click <strong>Manage</strong>.</li>
                  <li>Click the <strong>Advanced DNS</strong> tab at the top.</li>
                  <li>Purana default "Parking Page" A Record DELETE kar dein.</li>
                  <li>Click <strong>Add New Record</strong> &rarr; Type: <strong>A Record</strong>, Host: <code className="text-white">@</code>, Value: <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code>, TTL: Automatic.</li>
                  <li>Click <strong>Add New Record</strong> &rarr; Type: <strong>CNAME Record</strong>, Host: <code className="text-white">www</code>, Target: <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code>.</li>
                  <li>Green checkmark click kar ke save kar dein.</li>
                </>
              )}
              {selectedRegistrar === "hostinger" && (
                <>
                  <li>Log in to <strong>Hostinger hPanel</strong> &rarr; <strong>Domains</strong> &rarr; Click your domain.</li>
                  <li>Left sidebar mein <strong>DNS / Nameservers</strong> par click karein.</li>
                  <li>Under Manage DNS records:</li>
                  <li>Type: <strong>A</strong>, Name: <code className="text-white">@</code>, Points to: <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code> &rarr; Add Record.</li>
                  <li>Type: <strong>CNAME</strong>, Name: <code className="text-white">www</code>, Target: <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code> &rarr; Add Record.</li>
                </>
              )}
              {selectedRegistrar === "cloudflare" && (
                <>
                  <li>Open <strong>Cloudflare Dashboard</strong> &rarr; Click Domain &rarr; <strong>DNS &gt; Records</strong>.</li>
                  <li>Edit A Record (<code className="text-white">@</code>): IPv4 <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code>.</li>
                  <li><strong className="text-amber-400">CRITICAL:</strong> Proxy Status toggle ko Orange Cloud se band kar ke <strong>DNS Only (Grey Cloud)</strong> select karein.</li>
                  <li>Edit CNAME (<code className="text-white">www</code>): Target <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code>.</li>
                </>
              )}
              {selectedRegistrar === "ionos" && (
                <>
                  <li>Log in to <strong>IONOS Control Center</strong> &rarr; <strong>Domains & SSL</strong>.</li>
                  <li>Click gear icon next to domain &rarr; Select <strong>DNS</strong>.</li>
                  <li>Edit A Record to <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code>.</li>
                  <li>Set CNAME for www to <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code>.</li>
                </>
              )}
              {selectedRegistrar === "other" && (
                <>
                  <li>Apne domain provider ke <strong>DNS Zone Editor</strong> mein jaein.</li>
                  <li>A Record (@) ko <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">76.76.21.21</code> par point karein.</li>
                  <li>CNAME Record (www) ko <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded font-mono">cname.vercel-dns.com</code> par point karein.</li>
                </>
              )}
            </ol>
          </div>
        </div>

        {/* 3 Golden Rules Box */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3 Golden Rules: Ghaltiyan Jin Say Bachna Hai</span>
          </div>
          <div className="space-y-2 text-zinc-300 text-xs leading-relaxed">
            <p>
              <strong>1. Purana A Record DELETE karein:</strong> Agar aapke registrar par pehle se koi purana IP (jaise parking page IP) laga hua hai, to usay pehle delete karein. Sirf <code>76.76.21.21</code> rehna chahiye.
            </p>
            <p>
              <strong>2. Cloudflare Users (Grey Cloud):</strong> Agar aap Cloudflare use kar rahe hain, to Orange Cloud band kar ke <strong>DNS Only (Grey Cloud)</strong> select karein taake initial SSL verification foran ho.
            </p>
            <p>
              <strong>3. Sabar Rakhein (5-30 Minutes):</strong> Save karnay ke baad foran panic na karein! DNS poori dunya ke internet par phelne mein 5 se 30 minute leta hai.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3 shadow-md">
          <h2 className="font-semibold text-stone-200 text-sm uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </h2>
          {[
            {
              q: "Website par 'Not Secure' ya SSL Pending kyun dikh raha hai?",
              a: "Let's Encrypt Free SSL certificate DNS connect honay ke 10-15 minute ke andar khud ba khud activate ho jata hai. Kisi paid certificate ki zaroorat nahi hai. Thora sa wait karein, ye khud HTTPS ho jayega."
            },
            {
              q: "Root domain (@) aur 'www' mein kya farq hai?",
              a: "@ aapka main domain hota hai (jaise moderntrendsnow.org) aur CNAME www subdomain ke liye hota hai (www.moderntrendsnow.org). Dono records add karna zaroori hai taake agar koi www likhay ya na likhay, dono sooraton mein aapki website khulay."
            },
            {
              q: "Kya meri website band ho jayegi jab tak custom domain verify na ho?",
              a: "Bilkul nahi! Aapka .zyntix.app subdomain 24/7 online rehta hai aur kabhi down nahi hota."
            }
          ].map((faq, idx) => (
            <div key={idx} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-zinc-300 hover:text-white font-medium transition cursor-pointer text-xs"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === idx ? "rotate-180 text-amber-400" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-zinc-400 text-xs leading-relaxed border-t border-zinc-900 bg-zinc-900/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
