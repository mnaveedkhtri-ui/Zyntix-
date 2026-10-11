"use client";

import React, { useState, useEffect } from "react";
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
  MessageCircle
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
  };
  navigation: Array<{ label: string; href: string }>;
  posts: BlogPost[];
  contact: {
    email: string;
    twitter?: string;
    linkedin?: string;
  };
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
  const [selectedRegistrar, setSelectedRegistrar] = useState("ionos");
  const [domainConnecting, setDomainConnecting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [conciergeRequested, setConciergeRequested] = useState(false);
  const [conciergeLoading, setConciergeLoading] = useState(false);
  const [conciergeMessage, setConciergeMessage] = useState("");
  const [dnsCheckResult, setDnsCheckResult] = useState<{
    status: string;
    currentIps: string[];
    isVercelConnected: boolean;
    message: string;
    checked: boolean;
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

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();
      if (data.success && data.sites && data.sites.length > 0) {
        setSites(data.sites);
        setCurrentSite(data.sites[0]);
        if (data.sites[0]?.customDomain) {
          setCustomDomainInput(data.sites[0].customDomain);
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
        setChatLog(prev => [
          ...prev,
          {
            sender: "bot",
            text: `Domain **${data.domain}** has been mapped successfully! Please configure your A Record and CNAME Record in ${selectedRegistrar.toUpperCase()} DNS settings. Free Let's Encrypt SSL is active.`
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
        setIframeKey((k) => k + 1);
        await fetchSites();

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

  const previewUrl = currentSite ? `/site/${currentSite.subdomain}` : "/site/demo";
  const liveUrl = currentSite?.customDomain ? `https://${currentSite.customDomain}` : previewUrl;

  return (
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
              <span>Connect Domain</span>
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "editor" ? "border-stone-100 text-stone-100 bg-zinc-900/60" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Publication Settings</span>
            </button>
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
              {/* Top Banner: Your Site Is Already Live */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                        Your Website Is 100% Live Online
                      </span>
                    </div>
                    <p className="text-stone-200 font-mono text-xs font-medium">
                      https://{currentSite.subdomain}.zyntix.app
                    </p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Instant Edge SSL and global CDN are already active. Connecting a custom domain is optional.
                    </p>
                  </div>
                  <a
                    href={`/site/${currentSite.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Option 1: VIP 1-Click Concierge (Zero Effort) */}
              <div className="bg-gradient-to-b from-amber-950/30 via-zinc-900/60 to-zinc-950 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-200 text-xs uppercase tracking-wider">
                      Option 1: Free 1-Click VIP Concierge (Recommended)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    100% Free VIP Service
                  </span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Don't want to deal with DNS settings, hostnames, or technical jargon? Click below and our engineering team will handle the domain connection and SSL configuration for you within 1-2 hours.
                </p>

                {conciergeRequested ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-xs flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold mb-0.5">VIP Concierge Request Confirmed!</p>
                      <p className="text-[11px] text-zinc-400">
                        {conciergeMessage || "Our engineering team has received your request and is connecting your domain right now."}
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
                      href="https://wa.me/923323219981?text=Hi%20Zyntix,%20please%20help%20me%20connect%20my%20domain"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp VIP Support</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Option 2: Quick Self-Setup (2 Minutes) */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-5 shadow-md">
                <div>
                  <h4 className="font-serif text-lg text-stone-100 font-semibold mb-1">
                    Option 2: Quick Self-Setup (2 Minutes)
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    If you prefer to configure it yourself, simply enter your domain below and point these two standard records.
                  </p>
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
                      className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-zinc-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {domainConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>Save Domain</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Select Provider for Customized Guide */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-300 text-xs block uppercase tracking-wider">
                      Step 2: Select Where You Bought Your Domain
                    </span>
                    <span className="text-[10px] text-zinc-400">Customized click-by-click instructions</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "ionos", label: "IONOS (1&1)" },
                      { id: "godaddy", label: "GoDaddy" },
                      { id: "namecheap", label: "Namecheap" },
                      { id: "cloudflare", label: "Cloudflare" },
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
                      <span>Instructions for {selectedRegistrar.toUpperCase()}:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-zinc-400 leading-relaxed">
                      {selectedRegistrar === "ionos" && (
                        <>
                          <li>Log in to your <strong>IONOS (1&1) Control Center</strong> and click <strong>Domains & SSL</strong>.</li>
                          <li>Click the gear icon next to your domain and select <strong>DNS</strong>.</li>
                          <li>Find your current A Record (pointing to an old IP) and click <strong>Edit</strong>.</li>
                          <li>Set IPv4 Address to <strong className="text-white font-mono">76.76.21.21</strong> and save.</li>
                          <li>Ensure CNAME for <strong>www</strong> points to <strong className="text-white font-mono">cname.vercel-dns.com</strong>.</li>
                        </>
                      )}
                      {selectedRegistrar === "godaddy" && (
                        <>
                          <li>Log in to <strong>GoDaddy</strong> and open <strong>Domain Portfolio</strong>.</li>
                          <li>Click your domain &rarr; <strong>DNS Records</strong>.</li>
                          <li>Edit Type A (Name @) and change value to <strong className="text-white font-mono">76.76.21.21</strong>.</li>
                          <li>Add/Edit CNAME (Name www) with value <strong className="text-white font-mono">cname.vercel-dns.com</strong>.</li>
                          <li>Save changes.</li>
                        </>
                      )}
                      {selectedRegistrar === "namecheap" && (
                        <>
                          <li>Log in to <strong>Namecheap</strong> &rarr; <strong>Domain List</strong> &rarr; <strong>Manage</strong>.</li>
                          <li>Click the <strong>Advanced DNS</strong> tab.</li>
                          <li>Add/Edit A Record: Host @, Value <strong className="text-white font-mono">76.76.21.21</strong>.</li>
                          <li>Add/Edit CNAME Record: Host www, Target <strong className="text-white font-mono">cname.vercel-dns.com</strong>.</li>
                          <li>Save all changes.</li>
                        </>
                      )}
                      {selectedRegistrar === "cloudflare" && (
                        <>
                          <li>Open your <strong>Cloudflare Dashboard</strong> &rarr; <strong>DNS</strong> &rarr; <strong>Records</strong>.</li>
                          <li>Edit A Record (@): IPv4 <strong className="text-white font-mono">76.76.21.21</strong> (DNS Only proxy).</li>
                          <li>Edit CNAME (www): Target <strong className="text-white font-mono">cname.vercel-dns.com</strong>.</li>
                          <li>Save records.</li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>

                {/* 2 DNS Records with Copy Buttons */}
                <div className="space-y-3">
                  <span className="font-semibold text-stone-300 text-xs block uppercase tracking-wider">
                    DNS Values to Copy:
                  </span>
                  <div className="space-y-2 font-sans">
                    {/* A Record */}
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-stone-200 font-bold font-mono text-[11px]">Type: A</span>
                          <span className="text-zinc-400">Host: <strong className="text-white font-mono">@</strong></span>
                        </div>
                        <div className="text-stone-200 font-mono text-xs font-semibold">
                          76.76.21.21
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard("76.76.21.21", "a-record")}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-stone-200 rounded-lg text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedKey === "a-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "a-record" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    {/* CNAME Record */}
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-stone-200 font-bold font-mono text-[11px]">Type: CNAME</span>
                          <span className="text-zinc-400">Host: <strong className="text-white font-mono">www</strong></span>
                        </div>
                        <div className="text-stone-200 font-mono text-xs font-semibold">
                          cname.vercel-dns.com
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard("cname.vercel-dns.com", "cname-record")}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-stone-200 rounded-lg text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedKey === "cname-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "cname-record" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3: Live Real-Time DNS Connection Checker */}
                <div className="pt-2 border-t border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-stone-200 text-xs block">
                        Step 3: Verify Connection Status
                      </span>
                      <p className="text-zinc-400 text-[11px]">
                        Test directly against Google Public DNS to see if records have propagated.
                      </p>
                    </div>
                    <button
                      onClick={handleCheckDns}
                      disabled={checkingDns || (!customDomainInput.trim() && !currentSite.customDomain)}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingDns ? "animate-spin" : ""}`} />
                      <span>{checkingDns ? "Checking DNS..." : "Test Connection"}</span>
                    </button>
                  </div>

                  {/* Real-Time Live Status Display */}
                  {dnsCheckResult && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                      dnsCheckResult.isVercelConnected
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-amber-950/40 border-amber-500/40 text-amber-200"
                    }`}>
                      <div className="flex items-center gap-2 font-bold">
                        {dnsCheckResult.isVercelConnected ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Domain Successfully Connected & Live!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>DNS Propagation In Progress</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        {dnsCheckResult.message}
                      </p>
                      {dnsCheckResult.currentIps?.length > 0 && (
                        <div className="font-mono text-[10px] text-zinc-400 pt-1">
                          Current Live DNS IP: {dnsCheckResult.currentIps.join(", ")} &bull; Required Target: {dnsCheckResult.expectedIp}
                        </div>
                      )}
                    </div>
                  )}
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
                          const updated = currentSite.services.filter((_, idx) => idx !== sIdx);
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
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
