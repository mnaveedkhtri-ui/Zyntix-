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
  FileText, 
  Globe,
  Check
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
  const [activeTab, setActiveTab] = useState<"writer" | "editor" | "essays" | "domain">("writer");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Salam! Main Zyntix Studio Editor hoon. Aap kis topic ya niche par ek authentic, clean, human publication launch ya edit karna chahte hain? (e.g. Minimalist Tech, Architecture, Coffee & Craft, Local Carpentry, Health & Mind)?"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

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
      }
    } catch (err) {
      console.error("Failed to load sites", err);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsProcessing(true);

    try {
      const lower = userMsg.toLowerCase();
      let updatedSite: SiteConfig = currentSite ? JSON.parse(JSON.stringify(currentSite)) : {
        id: "site-" + Date.now(),
        subdomain: "journal",
        name: "The Journal",
        tagline: "Notes on craft and deliberate living.",
        description: "A calm space for thoughtful articles.",
        niche: "Essays & Work",
        location: "Global",
        author: {
          name: "The Author",
          bio: "Independent thinker and craftsman.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        },
        navigation: [{ label: "Essays", href: "/" }],
        posts: [],
        contact: { email: "editor@journal.com" }
      };

      let botReply = "";

      // 1. Author Name / Bio update
      if (lower.includes("author") || lower.includes("name") || lower.includes("naam")) {
        const parts = userMsg.split(":");
        const newName = parts.length > 1 ? parts[1].trim() : userMsg.replace(/(change|author|name|naam|mera|to|rakho)/gi, "").trim();
        if (newName) {
          updatedSite.author.name = newName;
          botReply = `Author name update kar diya gaya hai: "${newName}". Publication colophon refresh ho gaya hai.`;
        }
      }
      // 2. Add New Essay / Article
      else if (lower.includes("post") || lower.includes("article") || lower.includes("essay") || lower.includes("likho") || lower.includes("add")) {
        const title = userMsg.replace(/(add|post|article|essay|likho|write|new)/gi, "").trim() || "Observations on Timeless Quality";
        const newPost: BlogPost = {
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: title.charAt(0).toUpperCase() + title.slice(1),
          excerpt: "A deeply considered examination of genuine craftsmanship versus modern artificial shortcuts.",
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          readTime: "5 min read",
          category: "Craftsmanship",
          author: {
            name: updatedSite.author.name,
            avatar: updatedSite.author.avatar,
            role: "Author"
          },
          coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
          content: [
            "True mastery is never in a hurry. When you look at buildings that have stood for centuries, they weren't constructed in twenty minutes using shortcuts; they were built stone by stone with patient intention.",
            "In modern digital discourse, we often mistake velocity for value. But the writings and works that endure are those grounded in lived human observation, unvarnished truth, and simple beauty."
          ]
        };
        updatedSite.posts.unshift(newPost);
        botReply = `Naya human-crafted essay publication me shamil kar diya gaya hai: "${newPost.title}". Live preview me pehla story ban gaya hai!`;
      }
      // 3. Create fresh brand/niche publication
      else {
        const words = userMsg.split(" ").filter(w => w.length > 2);
        const nicheName = words[0] || "Architecture & Living";
        const sub = nicheName.toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + Math.floor(100 + Math.random() * 900);
        
        updatedSite = {
          ...updatedSite,
          id: "site-" + Date.now(),
          subdomain: sub,
          name: `The ${nicheName.charAt(0).toUpperCase() + nicheName.slice(1)} Chronicle`,
          tagline: `Unvarnished perspectives on ${nicheName} and modern craftsmanship.`,
          description: `A quiet human publication chronicling practical observations, studio work, and timeless principles.`,
          niche: nicheName,
          posts: [
            {
              slug: "first-principles",
              title: `Returning to First Principles in ${nicheName}`,
              excerpt: "Why the simplest methods, honest materials, and patient observation always produce the most durable results.",
              date: "October 11, 2026",
              readTime: "7 min read",
              category: "First Principles",
              author: {
                name: updatedSite.author.name || "Naveed Khatri",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                role: "Author"
              },
              coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
              content: [
                "Everything of genuine quality begins with a quiet respect for the fundamentals. When we remove unnecessary complexity, what remains is durable, honest, and immediately recognizable as human work.",
                "This publication is our ongoing log of what works, what fails, and what endures."
              ]
            }
          ]
        };
        botReply = `Aapka minimalist, human-authored publication create ho gaya: **${sub}.zyntix.app**! Real paper-tone aesthetic aur clean typography live preview me loaded hai.`;
      }

      // Persist to database
      const saveRes = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSite)
      });
      const resData = await saveRes.json();

      if (resData.success) {
        setCurrentSite(resData.site);
        setIframeKey(k => k + 1);
        await fetchSites();
      }

      setChatLog(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setChatLog(prev => [...prev, { sender: "bot", text: "Error: " + String(err) }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const previewUrl = currentSite ? `/site/${currentSite.subdomain}` : "/site/demo";

  return (
    <div className="h-screen w-screen bg-[#18181b] text-zinc-100 flex flex-col overflow-hidden font-sans antialiased">
      {/* Editorial Studio Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/90 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-stone-100 text-zinc-900 flex items-center justify-center font-serif font-bold text-base shadow-sm">
              Z
            </div>
            <div>
              <span className="font-serif tracking-tight text-base font-semibold text-stone-100">
                Zyntix <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-zinc-400 ml-1">Studio</span>
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          {/* Publication Selector */}
          <select 
            value={currentSite?.subdomain || ""}
            onChange={(e) => {
              const selected = sites.find(s => s.subdomain === e.target.value);
              if (selected) {
                setCurrentSite(selected);
                setIframeKey(k => k + 1);
              }
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-md text-xs px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-500 font-serif"
          >
            {sites.map(s => (
              <option key={s.id} value={s.subdomain}>
                {s.name} ({s.subdomain}.zyntix.app)
              </option>
            ))}
          </select>
        </div>

        {/* Viewport & Live Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-100 text-zinc-900 hover:bg-stone-200 text-xs font-medium transition"
          >
            <span>Open Publication</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editorial Co-Pilot & Colophon Controls */}
        <div className="w-[430px] border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
          <div className="flex border-b border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("writer")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "writer" ? "border-stone-200 text-stone-100 bg-zinc-900" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>AI Co-Pilot</span>
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "editor" ? "border-stone-200 text-stone-100 bg-zinc-900" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Publication</span>
            </button>
            <button
              onClick={() => setActiveTab("domain")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition ${activeTab === "domain" ? "border-stone-200 text-stone-100 bg-zinc-900" : "border-transparent text-zinc-400 hover:text-white"}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Domains</span>
            </button>
          </div>

          {/* Tab 1: AI Co-Pilot Dialogue */}
          {activeTab === "writer" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {chatLog.map((chat, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        chat.sender === "user"
                          ? "bg-zinc-800 text-stone-100 border border-zinc-700"
                          : "bg-zinc-900 text-zinc-300 border border-zinc-800 font-serif"
                      }`}
                    >
                      {chat.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-serif italic">
                    <RefreshCw className="w-3 h-3 animate-spin text-stone-300" />
                    <span>Writing thoughtful revisions...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-zinc-800 bg-zinc-900/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Write an essay on carpentry, change author to Naveed..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-serif"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !prompt.trim()}
                    className="p-2.5 bg-stone-100 text-zinc-950 rounded-md hover:bg-stone-200 transition disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Publication & Author Details */}
          {activeTab === "editor" && currentSite && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs font-sans">
              <div>
                <label className="text-zinc-400 font-medium block mb-1.5 uppercase text-[10px] tracking-wider">
                  Publication Name
                </label>
                <input
                  type="text"
                  value={currentSite.name}
                  onChange={(e) => setCurrentSite({ ...currentSite, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white font-serif text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-medium block mb-1.5 uppercase text-[10px] tracking-wider">
                  Tagline / Masthead
                </label>
                <textarea
                  rows={2}
                  value={currentSite.tagline}
                  onChange={(e) => setCurrentSite({ ...currentSite, tagline: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white font-serif"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-medium block mb-1.5 uppercase text-[10px] tracking-wider">
                  Author Name & Bio
                </label>
                <input
                  type="text"
                  value={currentSite.author.name}
                  onChange={(e) => setCurrentSite({
                    ...currentSite,
                    author: { ...currentSite.author, name: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white mb-2"
                />
                <textarea
                  rows={3}
                  value={currentSite.author.bio}
                  onChange={(e) => setCurrentSite({
                    ...currentSite,
                    author: { ...currentSite.author, bio: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                onClick={async () => {
                  await fetch("/api/sites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(currentSite)
                  });
                  setIframeKey(k => k + 1);
                  fetchSites();
                }}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-zinc-900 rounded-md text-xs font-medium transition"
              >
                Save Publication Details
              </button>
            </div>
          )}

          {/* Tab 3: Domains */}
          {activeTab === "domain" && currentSite && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <span className="text-[11px] font-medium text-stone-300 uppercase tracking-wider block mb-1">
                  Subdomain Address
                </span>
                <p className="text-zinc-400 text-xs mb-3">Live on Vercel multi-tenant edge:</p>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2.5 font-mono text-stone-200 flex items-center justify-between">
                  <span>{currentSite.subdomain}.zyntix.app</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <span className="text-[11px] font-medium text-stone-300 uppercase tracking-wider block mb-1">
                  Connect Custom Domain
                </span>
                <p className="text-zinc-400 text-xs mb-3">
                  Map your own editorial domain (e.g. <code>naveedkhatri.com</code>):
                </p>
                <div className="space-y-2 mb-4 font-mono">
                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block font-sans">A Record</span>
                    <span className="text-stone-300">@ &rarr; 76.76.21.21</span>
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block font-sans">CNAME Record</span>
                    <span className="text-stone-300">www &rarr; cname.vercel-dns.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Realistic Browser Frame */}
        <div className="flex-1 bg-zinc-900/60 flex flex-col items-center justify-center p-5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#faf8f5] shadow-2xl ${
              viewport === "desktop" ? "w-full" : "w-[390px] max-h-[844px] border-4 border-zinc-700 rounded-[36px]"
            }`}
          >
            {/* Minimalist Browser Navigation Chrome */}
            <div className="h-10 bg-[#f4f0eb] border-b border-stone-200 px-4 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-white rounded px-3 py-1 text-[11px] text-stone-600 flex items-center justify-center gap-1 font-mono border border-stone-200">
                <span className="text-stone-400">https://</span>
                <span className="text-stone-800">{currentSite?.subdomain || "demo"}.zyntix.app</span>
              </div>
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
      </div>
    </div>
  );
}
