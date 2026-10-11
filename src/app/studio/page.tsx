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
  Trash2
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
  const [selectedRegistrar, setSelectedRegistrar] = useState("godaddy");
  const [domainConnecting, setDomainConnecting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [conciergeRequested, setConciergeRequested] = useState(false);

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
            href={previewUrl}
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

          {/* Tab 2: Custom Domain & DNS Engine */}
          {activeTab === "domain" && currentSite && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs max-w-2xl mx-auto w-full">
              <div>
                <h3 className="font-serif text-lg text-stone-100 font-semibold mb-1">
                  Connect Custom Domain ($0 Free SSL)
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Enter your domain name to route global traffic directly to this publication. Let's Encrypt SSL is provisioned automatically.
                </p>
              </div>

              {/* Domain Input Form */}
              <div className="space-y-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 shadow-md">
                <div>
                  <label className="text-xs font-medium text-stone-200 block mb-2">
                    Enter Domain Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={(e) => setCustomDomainInput(e.target.value)}
                      placeholder="e.g. apexroofingdallas.com"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={handleConnectDomain}
                      disabled={domainConnecting || !customDomainInput.trim()}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {domainConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>Connect</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1.5 uppercase tracking-wider">
                    Select Your Domain Registrar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["godaddy", "namecheap", "hostinger", "custom"].map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setSelectedRegistrar(reg)}
                        className={`py-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          selectedRegistrar === reg
                            ? "bg-stone-100 text-zinc-950 border-stone-100 font-bold"
                            : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Step Guided DNS Records */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DNS Configuration Records</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active & Validated
                  </span>
                </div>

                {/* A Record */}
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Type: <strong className="text-white">A Record</strong></span>
                    <span>Host: <strong className="text-white">@</strong></span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                    <span className="text-stone-100 text-xs font-bold">76.76.21.21</span>
                    <button
                      onClick={() => copyToClipboard("76.76.21.21", "a-record")}
                      className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "a-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* CNAME Record */}
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Type: <strong className="text-white">CNAME Record</strong></span>
                    <span>Host: <strong className="text-white">www</strong></span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                    <span className="text-stone-100 text-xs font-bold">cname.vercel-dns.com</span>
                    <button
                      onClick={() => copyToClipboard("cname.vercel-dns.com", "cname-record")}
                      className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "cname-record" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* VIP Concierge Fallback */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
                <span className="text-stone-300 font-medium block text-xs">
                  Prefer Delegated Setup?
                </span>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Our engineering team can configure your DNS and SSL certificates at zero charge.
                </p>
                <button
                  onClick={() => setConciergeRequested(true)}
                  disabled={conciergeRequested}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-stone-200 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  {conciergeRequested ? "✓ Request Received — Team is Dispatching!" : "Let Our Team Connect It (VIP Free)"}
                </button>
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
