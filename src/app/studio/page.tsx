"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { 
  Send, 
  ExternalLink, 
  RefreshCw, 
  Monitor, 
  Smartphone, 
  BookOpen, 
  PenTool, 
  Globe, 
  Check, 
  Copy, 
  Plus, 
  ShieldCheck, 
  Eye, 
  ChevronRight, 
  SlidersHorizontal,
  Maximize2,
  Trash2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  ChevronDown,
  Clock,
  Shield
} from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  coverImage: string;
  content: string[];
}

interface SiteConfig {
  id: string;
  subdomain: string;
  customDomain?: string | null;
  name: string;
  tagline: string;
  description: string;
  niche: string;
  location: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
    credentials?: string;
  };
  navigation: Array<{ label: string; href: string }>;
  posts: BlogPost[];
  contact: {
    email: string;
    twitter?: string;
    linkedin?: string;
    phone?: string;
    address?: string;
  };
  services?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export default function ZyntixStudio() {
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [currentSite, setCurrentSite] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"writer" | "domain" | "editor" | "newsite">("writer");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  
  // Slide Preview Drawer State (Cloud-style toggle)
  const [showPreview, setShowPreview] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am your Zyntix AI Co-Pilot. I can generate high-authority human publications, write in-depth essays, or connect custom domains. How can I assist you today?"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Custom Domain Connection State
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [selectedRegistrar, setSelectedRegistrar] = useState("godaddy");
  const [domainConnecting, setDomainConnecting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [conciergeRequested, setConciergeRequested] = useState(false);
  const [conciergeLoading, setConciergeLoading] = useState(false);
  const [conciergeMessage, setConciergeMessage] = useState("");
  const [domainSavedMsg, setDomainSavedMsg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dnsCheckResult, setDnsCheckResult] = useState<{
    status: string;
    currentIps: string[];
    isVercelConnected: boolean;
    message: string;
    urduMessage?: string;
    checked: boolean;
    expectedIp?: string;
  } | null>(null);
  const [checkingDns, setCheckingDns] = useState(false);

  const handleCheckDns = async () => {
    const targetDomain = customDomainInput.trim() || currentSite?.customDomain;
    if (!targetDomain) return;
    setCheckingDns(true);
    try {
      const res = await fetch(`/api/domains/check?domain=${encodeURIComponent(targetDomain)}`);
      const data = await res.json();
      if (data.success) {
        setDnsCheckResult({ ...data, checked: true });
      }
    } catch (err) {
      console.error("DNS check error", err);
    } finally {
      setCheckingDns(false);
    }
  };

  const handleRequestConcierge = async () => {
    const targetDomain = customDomainInput.trim() || currentSite?.customDomain || "moderntrendsnow.org";
    setConciergeLoading(true);
    try {
      const res = await fetch("/api/domains/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: targetDomain,
          registrar: selectedRegistrar,
          email: currentSite?.contact?.email || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        setConciergeRequested(true);
        setConciergeMessage(data.message);
      }
    } catch (err) {
      alert("Concierge request error: " + String(err));
    } finally {
      setConciergeLoading(false);
    }
  };

  // New Site Quick Creation State
  const [newSiteNiche, setNewSiteNiche] = useState("");
  const [newSiteBrand, setNewSiteBrand] = useState("");
  const [newSiteAuthor, setNewSiteAuthor] = useState("Naveed Khatri");

  // Settings / Editor State
  const [editorSaved, setEditorSaved] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async (preserveSite?: SiteConfig) => {
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();
      if (data.success && data.sites && data.sites.length > 0) {
        setSites(data.sites);
        if (preserveSite) {
          setCurrentSite(preserveSite);
          if (preserveSite.customDomain) {
            setCustomDomainInput(preserveSite.customDomain);
          }
        } else {
          setCurrentSite(prev => {
            if (!prev) {
              if (data.sites[0]?.customDomain) {
                setCustomDomainInput(data.sites[0].customDomain);
              }
              return data.sites[0];
            }
            const found = data.sites.find((s: SiteConfig) => s.id === prev.id || s.subdomain === prev.subdomain);
            return found || prev;
          });
        }
      }
    } catch (err) {
      console.error("Failed to load sites", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConnectDomain = async () => {
    if (!customDomainInput.trim() || !currentSite) return;
    setDomainConnecting(true);
    setDomainSavedMsg(null);
    try {
      const res = await fetch("/api/domains/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: currentSite.id,
          domain: customDomainInput.trim(),
          registrar: selectedRegistrar
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentSite(data.site);
        await fetchSites();
        setDomainSavedMsg(`Domain "${data.domain}" mapped successfully to ${data.site.name}! Follow the 2 DNS steps below.`);
        handleCheckDns();
        setChatLog(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Domain **${data.domain}** has been mapped successfully to **${data.site.name}**! Configure the A Record and CNAME Record in ${selectedRegistrar.toUpperCase()} DNS settings. Free Let's Encrypt SSL is active.`
          }
        ]);
      }
    } catch (err) {
      alert("Domain connect error: " + String(err));
    } finally {
      setDomainConnecting(false);
    }
  };

  const handleCreateNewSite = async () => {
    if (!newSiteNiche.trim() || !newSiteBrand.trim()) return;
    setIsProcessing(true);
    try {
      const cleanSub = newSiteBrand.toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + Math.floor(100 + Math.random() * 900);
      const newSitePayload = {
        subdomain: cleanSub,
        name: newSiteBrand,
        tagline: `Thoughtful Perspectives on ${newSiteNiche}`,
        description: `An authentic, human-crafted publication covering the craft, principles, and practice of ${newSiteNiche}.`,
        niche: newSiteNiche,
        location: "Global",
        author: {
          name: newSiteAuthor || "Naveed Khatri",
          bio: `Practitioner, writer, and researcher focused on ${newSiteNiche}.`,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        },
        navigation: [
          { label: "Essays", href: "/" },
          { label: "About", href: "#about" },
          { label: "Newsletter", href: "#newsletter" }
        ],
        posts: [
          {
            slug: "foundational-principles",
            title: `Foundational Principles in Modern ${newSiteNiche}: What Actually Endures`,
            excerpt: `A field inspection into why honest fundamentals and deliberate work outperform temporary shortcuts in ${newSiteNiche}.`,
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            readTime: "7 min read",
            category: "Core Principles",
            author: {
              name: newSiteAuthor || "Naveed Khatri",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              role: "Author"
            },
            coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
            content: [
              `[AEO_ANSWER]: Mastery in ${newSiteNiche} requires stripping away secondary ornamentation and focusing strictly on durable, verifiable methods that stand up to daily human scrutiny.`,
              `In every enduring field of work, true quality begins with a quiet respect for the fundamentals. When we remove unnecessary complexity, what remains is durable, honest, and immediately recognizable as human craftsmanship.`,
              `This publication is an ongoing record of practical observations, tested principles, and field notes.`
            ]
          }
        ]
      };

      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSitePayload)
      });
      const data = await res.json();
      if (data.success) {
        setSites(prev => [...prev, data.site]);
        setCurrentSite(data.site);
        setIframeKey(k => k + 1);
        setActiveTab("writer");
        setShowPreview(true);
        setChatLog(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Congratulations! Your new website **${data.site.name}** has been deployed at **${data.site.subdomain}.zyntix.app**! Click the Preview button to inspect it.`
          }
        ]);
      }
    } catch (err) {
      alert("Failed to create site: " + String(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          siteId: currentSite?.id,
          currentSite: currentSite
        })
      });

      const data = await res.json();

      if (data.success && data.site) {
        setCurrentSite(data.site);
        setShowPreview(true);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`zyntix_preview_${data.site.subdomain}`, JSON.stringify(data.site));
          } catch (e) {}
        }
        setIframeKey((k) => k + 1);
        await fetchSites(data.site);

        // Instant postMessage to preview iframe
        try {
          const iframeEl = document.querySelector('iframe[title="Site Live Preview"]') as HTMLIFrameElement | null;
          if (iframeEl?.contentWindow) {
            iframeEl.contentWindow.postMessage({ type: "ZYNTIX_UPDATE_SITE", site: data.site }, "*");
          }
        } catch (e) {}

        if (data.site.customDomain) {
          setCustomDomainInput(data.site.customDomain);
        }

        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply || `I have successfully refined ${data.site.name} according to your exact instructions.`
          }
        ]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.error ? `Notice: ${data.error}` : "Your publication has been updated."
          }
        ]);
      }
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "bot", text: "Error: " + String(err) }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const previewUrl = currentSite ? `/site/${currentSite.subdomain}?v=${iframeKey}` : `/site/demo?v=${iframeKey}`;
  const liveUrl = currentSite?.customDomain ? `https://${currentSite.customDomain}` : previewUrl;

  return (
    <>
      <Show when="signed-out">
        <div className="h-screen w-screen bg-[#121214] text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-zinc-950 flex items-center justify-center font-serif font-bold text-xl mb-4 shadow-xl">
            Z
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mb-2">Authentication Required</h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-8 font-sans leading-relaxed">
            Please sign in with Google or your email to access your Zyntix Studio publications and AI Co-Pilot.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 font-sans text-xs">
            <Link 
              href="/sign-in?redirect_url=/studio" 
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-zinc-900 rounded-md font-medium hover:bg-stone-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-stone-100/10 font-semibold"
            >
              <span>Sign In with Google &rarr;</span>
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-stone-200 rounded-md font-medium hover:bg-zinc-900 transition flex items-center justify-center cursor-pointer"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="h-screen w-screen bg-[#121214] text-zinc-100 flex flex-col overflow-hidden font-sans antialiased">
      {/* Studio Header */}
      <header className="h-14 border-b border-zinc-800 bg-[#18181b] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-zinc-950 flex items-center justify-center font-serif font-bold text-base shadow-sm">
              Z
            </div>
            <span className="font-serif tracking-tight text-base font-semibold text-stone-100 hidden sm:inline">
              Zyntix <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-zinc-400 ml-1">Studio</span>
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

          {/* Publication Selector */}
          <select 
            value={currentSite?.subdomain || ""}
            onChange={(e) => {
              const selected = sites.find(s => s.subdomain === e.target.value);
              if (selected) {
                setCurrentSite(selected);
                setCustomDomainInput(selected.customDomain || "");
                setIframeKey(k => k + 1);
              }
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-md text-xs px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-500 font-serif max-w-[180px] sm:max-w-xs truncate"
          >
            {sites.map(s => (
              <option key={s.id} value={s.subdomain}>
                {s.name} ({s.customDomain ? s.customDomain : `${s.subdomain}.zyntix.app`})
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab("newsite")}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-stone-200 rounded-md text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Site</span>
          </button>
        </div>

        {/* Viewport, Live Link & Cloud-Style Slide Preview Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud-Style Toggle Preview Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              showPreview 
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20" 
                : "bg-zinc-800 hover:bg-zinc-700 text-stone-200 border border-zinc-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? "Hide Preview" : "Preview Site"}</span>
          </button>

          {showPreview && (
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded text-xs transition ${viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                title="Laptop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded text-xs transition ${viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-100 text-zinc-900 hover:bg-stone-200 text-xs font-medium transition"
          >
            <span>Live URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Studio Body with Cloud Slide Preview Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Work Area (Expands to Fullscreen when Preview is hidden) */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showPreview ? "w-1/2 border-r border-zinc-800" : "w-full max-w-4xl mx-auto"}`}>
          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 text-xs font-medium bg-[#141416]">
            <button
              onClick={() => setActiveTab("writer")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "writer" ? "border-stone-100 text-stone-100 bg-zinc-900/60" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>AI Co-Pilot (English)</span>
            </button>
            <button
              onClick={() => setActiveTab("domain")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "domain" ? "border-emerald-400 text-emerald-400 bg-emerald-500/5 font-semibold" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Connect Custom Domain</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-bold ml-1">MAIN</span>
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "editor" ? "border-stone-100 text-stone-100 bg-zinc-900/60" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Publication Settings</span>
            </button>
            <div className="hidden lg:flex items-center px-3 text-[10px] text-zinc-500 border-l border-zinc-800 gap-1.5 shrink-0">
              <span>Pinterest Auto-Pilot:</span>
              <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold">Coming Soon</span>
            </div>
          </div>

          {/* Tab 1: AI Co-Pilot (Strict English & Intelligent Execution) */}
          {activeTab === "writer" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {chatLog.map((chat, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        chat.sender === "user"
                          ? "bg-stone-100 text-zinc-950 font-medium rounded-br-xs shadow-sm"
                          : "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-xs font-serif leading-relaxed"
                      }`}
                    >
                      {chat.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-serif italic">
                    <RefreshCw className="w-3 h-3 animate-spin text-stone-300" />
                    <span>Zyntix Autopilot compiling updates...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-zinc-800 bg-[#141416]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 max-w-3xl mx-auto"
                >
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Connect domain brand.com, write an essay on timber work..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !prompt.trim()}
                    className="p-3 bg-stone-100 text-zinc-950 rounded-xl hover:bg-stone-200 transition disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Custom Domain & DNS Engine (5-Star Zero-Friction UX) */}
          {activeTab === "domain" && currentSite && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-xs max-w-2xl mx-auto w-full">
              {/* Top Banner: Your Site Status */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                        Website Is 100% Live Online
                      </span>
                    </div>
                    <p className="text-stone-100 font-mono text-sm font-semibold">
                      {currentSite.customDomain ? `https://${currentSite.customDomain}` : `https://${currentSite.subdomain}.zyntix.app`}
                    </p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {currentSite.customDomain 
                        ? "Custom domain active with automatic Edge SSL. Root and www versions are both handled."
                        : `Instant Edge SSL is active at ${currentSite.subdomain}.zyntix.app. Connecting a custom domain is optional, but recommended for authoritative brand equity.`}
                    </p>
                  </div>
                  <a
                    href={currentSite.customDomain ? `https://${currentSite.customDomain}` : `/site/${currentSite.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Option 1: VIP 1-Click Concierge (Zero Technical Effort) */}
              <div className="bg-gradient-to-b from-amber-950/30 via-zinc-900/60 to-zinc-950 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-200 text-xs uppercase tracking-wider">
                      Option 1: 100% Free VIP Concierge Setup (Recommended)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    Zero Effort &bull; 100% Free
                  </span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Prefer our engineering team configure everything for you? We will set up your DNS records and verify SSL certificates within 10–15 minutes completely free of charge.
                </p>

                {conciergeRequested ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-xs flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold mb-0.5">VIP Concierge Request Confirmed!</p>
                      <p className="text-[11px] text-zinc-400">
                        {conciergeMessage || "Our engineering team has received your request and is currently connecting your custom domain."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleRequestConcierge}
                      disabled={conciergeLoading}
                      className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {conciergeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Let Us Connect It For You (1-Click)</span>
                    </button>
                    <a
                      href={`https://wa.me/923323219981?text=${encodeURIComponent(`Hi Zyntix, please help me connect my domain: ${customDomainInput.trim() || currentSite.customDomain || 'my domain'}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp VIP Assistance</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Option 2: Quick Self-Setup (2 Minutes Step-By-Step) */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg text-stone-100 font-semibold mb-1">
                      Option 2: 2-Minute Step-by-Step Self Setup
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Connecting your domain takes less than 2 minutes. You only need to add 2 simple DNS records:
                    </p>
                  </div>
                  <a
                    href="/domain-guide"
                    target="_blank"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-[11px] font-medium border border-zinc-700 transition shrink-0"
                  >
                    <span>Full Visual Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Step 1: Enter Custom Domain */}
                <div className="space-y-2">
                  <span className="font-semibold text-stone-300 text-xs block uppercase tracking-wider">
                    Step 1: Enter Your Domain Name
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={(e) => setCustomDomainInput(e.target.value)}
                      placeholder="e.g. moderntrendsnow.org"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-stone-400 focus:outline-none"
                    />
                    <button
                      onClick={handleConnectDomain}
                      disabled={domainConnecting || !customDomainInput.trim()}
                      className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-zinc-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      {domainConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>Save Domain</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Tip: No need to include https:// or trailing slashes. Both root domain and www subdomain will be automatically mapped.
                  </p>
                  {domainSavedMsg && (
                    <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-medium">{domainSavedMsg}</span>
                    </div>
                  )}
                </div>

                {/* Step 2: Select Provider for Customized Guide */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-300 text-xs block uppercase tracking-wider">
                      Step 2: Choose Your Domain Registrar (Click for Exact Steps)
                    </span>
                    <span className="text-[10px] text-zinc-400">Click-by-click instructions</span>
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
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-medium text-xs ${
                          selectedRegistrar === provider.id
                            ? "bg-stone-100 text-zinc-950 border-stone-100 shadow-sm"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {provider.label}
                      </button>
                    ))}
                  </div>

                  {/* Provider Specific Step-By-Step Box */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2 text-zinc-300 text-xs">
                    <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <span>Exact Steps for {selectedRegistrar.toUpperCase()}:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 leading-relaxed">
                      {selectedRegistrar === "godaddy" && (
                        <>
                          <li>Log in to <strong>GoDaddy</strong> &rarr; Open <strong>Domain Portfolio</strong>.</li>
                          <li>Click on your domain name &rarr; Select the <strong>DNS Records</strong> tab.</li>
                          <li>Find the existing <strong>Type A</strong> record (Name: @) and click <strong>Edit</strong>.</li>
                          <li>Change Value / Points to to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong> and save.</li>
                          <li>Locate the <strong>CNAME</strong> record (Name: www) and set Target to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong> and save.</li>
                        </>
                      )}
                      {selectedRegistrar === "namecheap" && (
                        <>
                          <li>Log in to <strong>Namecheap</strong> &rarr; <strong>Domain List</strong> &rarr; Click <strong>Manage</strong> next to your domain.</li>
                          <li>Click on the <strong>Advanced DNS</strong> tab at the top.</li>
                          <li>Delete any existing "Parking Page" or default A Records.</li>
                          <li>Click <strong>Add New Record</strong> &rarr; Select <strong>A Record</strong> &rarr; Host: <code className="text-white">@</code>, Value: <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong>, TTL: Automatic.</li>
                          <li>Add <strong>CNAME Record</strong> &rarr; Host: <code className="text-white">www</code>, Target: <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong>.</li>
                          <li>Click the green checkmark to Save all changes.</li>
                        </>
                      )}
                      {selectedRegistrar === "hostinger" && (
                        <>
                          <li>Log in to <strong>Hostinger hPanel</strong> &rarr; Click <strong>Domains</strong> &rarr; Manage your domain.</li>
                          <li>Click <strong>DNS / Nameservers</strong> in the left sidebar menu.</li>
                          <li>Under the Manage DNS records section:</li>
                          <li>Type: <strong>A</strong>, Name: <code className="text-white">@</code>, Points to: <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong> &rarr; Click <strong>Add Record</strong>.</li>
                          <li>Type: <strong>CNAME</strong>, Name: <code className="text-white">www</code>, Target: <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong> &rarr; Click <strong>Add Record</strong>.</li>
                        </>
                      )}
                      {selectedRegistrar === "cloudflare" && (
                        <>
                          <li>Open your <strong>Cloudflare Dashboard</strong> &rarr; Select your Domain &rarr; Click <strong>DNS &gt; Records</strong>.</li>
                          <li>Edit A Record (<code className="text-white">@</code>): set IPv4 address to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong>.</li>
                          <li><strong className="text-amber-400">CRITICAL:</strong> Switch Proxy status toggle from Orange Cloud to <strong>DNS Only (Grey Cloud)</strong> for instant SSL certificate issuance.</li>
                          <li>Edit CNAME (<code className="text-white">www</code>): set Target to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong>.</li>
                        </>
                      )}
                      {selectedRegistrar === "ionos" && (
                        <>
                          <li>Log in to <strong>IONOS Control Center</strong> &rarr; <strong>Domains & SSL</strong>.</li>
                          <li>Click gear icon next to domain &rarr; Select <strong>DNS</strong>.</li>
                          <li>Edit A Record: set IPv4 Address to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong>.</li>
                          <li>Set CNAME for <strong>www</strong> to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong> &rarr; Save.</li>
                        </>
                      )}
                      {selectedRegistrar === "other" && (
                        <>
                          <li>Open your domain provider's <strong>DNS Settings / Zone Editor</strong>.</li>
                          <li><strong>A Record (@):</strong> Point to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">76.76.21.21</strong>.</li>
                          <li><strong>CNAME Record (www):</strong> Point to <strong className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">cname.vercel-dns.com</strong>.</li>
                          <li>Save changes. Your free Edge SSL certificate will activate automatically.</li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>

                {/* Step 3: 2 DNS Records with Copy Buttons */}
                <div className="space-y-3">
                  <span className="font-semibold text-stone-300 text-xs block uppercase tracking-wider">
                    Step 3: Copy These 2 DNS Values (1-Click Copy)
                  </span>
                  <div className="space-y-2 font-sans">
                    {/* A Record */}
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3 shadow-inner">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[11px] border border-emerald-500/30">Type: A</span>
                          <span className="text-zinc-400">Name/Host: <strong className="text-white font-mono">@</strong> (root)</span>
                        </div>
                        <div className="text-stone-100 font-mono text-sm font-bold">
                          76.76.21.21
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard("76.76.21.21", "a-record")}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-stone-200 rounded-lg text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedKey === "a-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "a-record" ? "Copied!" : "Copy IP"}</span>
                      </button>
                    </div>

                    {/* CNAME Record */}
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3 shadow-inner">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold font-mono text-[11px] border border-blue-500/30">Type: CNAME</span>
                          <span className="text-zinc-400">Name/Host: <strong className="text-white font-mono">www</strong></span>
                        </div>
                        <div className="text-stone-100 font-mono text-sm font-bold">
                          cname.vercel-dns.com
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard("cname.vercel-dns.com", "cname-record")}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-stone-200 rounded-lg text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedKey === "cname-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "cname-record" ? "Copied!" : "Copy Target"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 4: 3 Golden Rules / Critical Pitfalls to Avoid */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>3 Golden Rules: Critical Pitfalls to Avoid</span>
                  </div>
                  <div className="space-y-2 text-zinc-300 text-[11px] leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">1.</span>
                      <p>
                        <strong>Delete Existing A Records:</strong> If your domain has an existing A record pointing to a parking page or former host, delete it first. Conflicting A records will prevent your site from loading. Only <code className="text-white bg-zinc-900 px-1 rounded">76.76.21.21</code> should remain.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">2.</span>
                      <p>
                        <strong>Cloudflare Users (Grey Cloud):</strong> If using Cloudflare, turn off the Orange Cloud proxy and set it to <strong>DNS Only (Grey Cloud)</strong> for instant SSL generation.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">3.</span>
                      <p>
                        <strong>Allow DNS Propagation (5–30 Minutes):</strong> Do not panic immediately after saving! Global DNS caches take 5 to 30 minutes to update. Your <code className="text-white bg-zinc-900 px-1 rounded">.zyntix.app</code> address remains 100% online in the meantime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5: Live Real-Time DNS Connection Checker */}
                <div className="pt-2 border-t border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-stone-200 text-xs block">
                        Step 5: Verify Live Connection Status
                      </span>
                      <p className="text-zinc-400 text-[11px]">
                        Verify live propagation directly from Google Public DNS (8.8.8.8).
                      </p>
                    </div>
                    <button
                      onClick={handleCheckDns}
                      disabled={checkingDns || (!customDomainInput.trim() && !currentSite.customDomain)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingDns ? "animate-spin" : ""}`} />
                      <span>{checkingDns ? "Checking Live DNS..." : "Verify Connection"}</span>
                    </button>
                  </div>

                  {/* Real-Time Live Status Display */}
                  {dnsCheckResult && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      dnsCheckResult.isVercelConnected
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-amber-950/40 border-amber-500/40 text-amber-200"
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {dnsCheckResult.isVercelConnected ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-400" />
                            <span>Congratulations! Domain Successfully Connected & Live!</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                            <span>DNS Propagation In Progress (Allow 5–15 mins)</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-zinc-200">
                        {dnsCheckResult.message}
                      </p>
                      {dnsCheckResult.currentIps?.length > 0 && (
                        <div className="font-mono text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                          Detected Live DNS IP: <span className="text-white">{dnsCheckResult.currentIps.join(", ")}</span> &bull; Target IP: <span className="text-emerald-400">{dnsCheckResult.expectedIp}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 6: Interactive Frequently Asked Questions (FAQ Accordion) */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <span className="font-semibold text-stone-200 text-xs block uppercase tracking-wider mb-2">
                    Frequently Asked Questions (FAQ):
                  </span>
                  {[
                    {
                      q: "Why does my browser display 'Not Secure' or 'SSL Pending'?",
                      a: "Our automated Let's Encrypt Edge SSL certificates activate automatically within 10 to 15 minutes once the DNS records are detected. No paid SSL certificate is needed. Once verified, your site will show the secure HTTPS lock immediately."
                    },
                    {
                      q: "What is the difference between root domain (@) and 'www'?",
                      a: "The @ record represents your root apex domain (e.g., moderntrendsnow.org), while www handles requests to www.moderntrendsnow.org. Configuring both records guarantees that visitors always reach your publication regardless of whether they type 'www'."
                    },
                    {
                      q: "Will my website experience any downtime while connecting?",
                      a: "Zero downtime. Your fast .zyntix.app cloud subdomain remains fully online and serving visitors 24/7 throughout the entire DNS transition."
                    },
                    {
                      q: "What if I get stuck or need assistance?",
                      a: "Click Option 1 above ('Let Us Connect It For You') or reach out directly to our VIP WhatsApp support (+92 332 3219981). Our engineering team will configure the DNS and verify SSL for you 100% free of charge."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-zinc-300 hover:text-white font-medium transition cursor-pointer text-xs"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${openFaq === idx ? "rotate-180 text-amber-400" : ""}`} />
                      </button>
                      {openFaq === idx && (
                        <div className="p-3.5 pt-0 text-zinc-400 text-[11px] leading-relaxed border-t border-zinc-900 bg-zinc-900/40">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: New Site Launcher */}
          {activeTab === "newsite" && (
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs max-w-xl mx-auto w-full">
              <h3 className="font-serif text-lg text-stone-100 font-semibold mb-1">
                Launch New Publication
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Provide your brand details to generate a responsive human-crafted publication.
              </p>

              <div>
                <label className="text-zinc-400 block mb-1 uppercase text-[10px] tracking-wider">
                  Brand / Publication Name
                </label>
                <input
                  type="text"
                  value={newSiteBrand}
                  onChange={(e) => setNewSiteBrand(e.target.value)}
                  placeholder="e.g. Heritage Architecture Review"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 uppercase text-[10px] tracking-wider">
                  Niche / Domain of Craft
                </label>
                <input
                  type="text"
                  value={newSiteNiche}
                  onChange={(e) => setNewSiteNiche(e.target.value)}
                  placeholder="e.g. Sustainable Architecture, Woodworking, Dental"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                onClick={handleCreateNewSite}
                disabled={isProcessing || !newSiteBrand.trim() || !newSiteNiche.trim()}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-zinc-950 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                {isProcessing ? "Deploying Publication..." : "Deploy Website Instantly &rarr;"}
              </button>
            </div>
          )}

          {/* Tab 4: Direct Publication Customizer */}
          {activeTab === "editor" && currentSite && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs max-w-2xl mx-auto w-full">
              <div>
                <h3 className="font-serif text-lg text-stone-100 font-semibold mb-1">
                  Manual Site Customizer & Settings
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Modify any exact detail of your publication by hand. All changes apply immediately to your live site and preview.
                </p>
              </div>

              {/* Brand & Location */}
              <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-sm">
                <span className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] block">
                  Brand & Identity
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Business / Studio Name
                    </label>
                    <input
                      type="text"
                      value={currentSite.name}
                      onChange={(e) => setCurrentSite({ ...currentSite, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Studio Location (City, State)
                    </label>
                    <input
                      type="text"
                      value={currentSite.location}
                      onChange={(e) => setCurrentSite({ ...currentSite, location: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Masthead Tagline
                  </label>
                  <input
                    type="text"
                    value={currentSite.tagline}
                    onChange={(e) => setCurrentSite({ ...currentSite, tagline: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-serif"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Editorial Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentSite.description}
                    onChange={(e) => setCurrentSite({ ...currentSite, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* Direct Contact Details */}
              <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-sm">
                <span className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] block">
                  Direct Contact & Address (Public On Site)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Public Phone Number
                    </label>
                    <input
                      type="text"
                      value={currentSite.contact?.phone || ""}
                      onChange={(e) => setCurrentSite({
                        ...currentSite,
                        contact: { ...currentSite.contact, phone: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Public Inquiry Email
                    </label>
                    <input
                      type="text"
                      value={currentSite.contact?.email || ""}
                      onChange={(e) => setCurrentSite({
                        ...currentSite,
                        contact: { ...currentSite.contact, email: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                    Physical Studio / Office Address
                  </label>
                  <input
                    type="text"
                    value={currentSite.contact?.address || ""}
                    onChange={(e) => setCurrentSite({
                      ...currentSite,
                      contact: { ...currentSite.contact, address: e.target.value }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-sans"
                  />
                </div>
              </div>

              {/* Founder / Principal Profile */}
              <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-sm">
                <span className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] block">
                  Founder & Principal Craftsman
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Founder / Author Name
                    </label>
                    <input
                      type="text"
                      value={currentSite.author?.name || ""}
                      onChange={(e) => setCurrentSite({
                        ...currentSite,
                        author: { ...currentSite.author, name: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                      Professional Credentials
                    </label>
                    <input
                      type="text"
                      value={currentSite.author?.credentials || ""}
                      onChange={(e) => setCurrentSite({
                        ...currentSite,
                        author: { ...currentSite.author, credentials: e.target.value }
                      })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Services & Offerings Editor */}
              <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
                    Services & Disciplines ({currentSite.services?.length || 0})
                  </span>
                </div>

                <div className="space-y-3">
                  {currentSite.services?.map((svc, sIdx) => (
                    <div key={sIdx} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="font-medium text-stone-200 block text-xs mb-1 font-serif">
                          {svc.title}
                        </span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (currentSite.services || []).filter((_: any, idx: number) => idx !== sIdx);
                          setCurrentSite({ ...currentSite, services: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Service */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Add New Service
                  </span>
                  <input
                    type="text"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="Service title (e.g. Historic Stone Stabilization)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="Service description / scope"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newServiceTitle.trim()) return;
                      const updated = [
                        ...(currentSite.services || []),
                        { title: newServiceTitle.trim(), description: newServiceDesc.trim() || "Bespoke commission scope." }
                      ];
                      setCurrentSite({ ...currentSite, services: updated });
                      setNewServiceTitle("");
                      setNewServiceDesc("");
                    }}
                    disabled={!newServiceTitle.trim()}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-stone-200 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service to Site</span>
                  </button>
                </div>
              </div>

              {/* Master Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsProcessing(true);
                    try {
                      const res = await fetch("/api/sites", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(currentSite)
                      });
                      const data = await res.json();
                      if (data.success) {
                        setEditorSaved(true);
                        setIframeKey(k => k + 1);
                        await fetchSites();
                        setTimeout(() => setEditorSaved(false), 3000);
                      }
                    } catch (e) {
                      alert("Error: " + String(e));
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full py-4 bg-stone-100 hover:bg-stone-200 text-zinc-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  {editorSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Changes Saved to Live Site Successfully!</span>
                    </>
                  ) : (
                    <span>Save & Apply All Changes to Live Site &rarr;</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cloud-Style Slide Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-[#0c0c0e] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden transition-all duration-300">
            <div 
              className={`h-full transition-all duration-300 flex flex-col rounded-2xl overflow-hidden border border-zinc-800 bg-[#faf8f5] shadow-2xl ${
                viewport === "desktop" ? "w-full" : "w-[390px] max-h-[844px] border-4 border-zinc-700 rounded-[40px]"
              }`}
            >
              {/* Minimalist Browser Navigation Chrome */}
              <div className="h-10 bg-[#f4f0eb] border-b border-stone-200 px-4 flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-white rounded-md px-3 py-1 text-[11px] text-stone-600 flex items-center justify-center gap-1 font-mono border border-stone-200 truncate">
                  <span className="text-stone-400">https://</span>
                  <span className="text-stone-800 font-medium">
                    {currentSite?.customDomain ? currentSite.customDomain : `${currentSite?.subdomain || "demo"}.zyntix.app`}
                  </span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-stone-500 hover:text-stone-900 p-1 rounded cursor-pointer"
                  title="Close Slide Preview"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Live Editorial Website Frame */}
              <iframe
                key={iframeKey}
                src={previewUrl}
                className="w-full flex-1 border-0 bg-[#faf8f5]"
                title="Site Live Preview"
                onLoad={(e) => {
                  try {
                    const targetWin = (e.target as HTMLIFrameElement)?.contentWindow;
                    if (targetWin && currentSite) {
                      targetWin.postMessage({ type: "ZYNTIX_UPDATE_SITE", site: currentSite }, "*");
                    }
                  } catch (err) {}
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
      </Show>
    </>
  );
}
