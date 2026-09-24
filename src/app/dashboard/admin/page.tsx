"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ShieldAlert, Coins, Search, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminCreditTopup() {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState("100");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Security Check: Only you can see this!
  if (user?.primaryEmailAddress?.emailAddress !== "moderntrendz98@gmail.com") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500/50" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p>This is a highly restricted Zyntix Admin area.</p>
      </div>
    );
  }

  const handleTopup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, credits: parseInt(credits) })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: "success", message: `Successfully added ${credits} credits to ${email}. New Balance: ${data.newBalance}` });
        setEmail("");
      } else {
        setStatus({ type: "error", message: data.error || "Failed to add credits." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          Admin Control Center
        </h1>
        <p className="text-slate-400 mt-2">Manage client accounts and inject credits instantly without leaving the app.</p>
      </div>

      <div className="bg-[#050B14] border border-rose-500/30 rounded-3xl p-8 shadow-[0_0_40px_-15px_rgba(244,63,94,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Coins className="w-48 h-48" />
        </div>

        <h3 className="text-xl font-bold text-white mb-6">Inject Client Credits</h3>
        
        <form onSubmit={handleTopup} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Client Email Address</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@agency.com"
                className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Credits to Add</label>
            <div className="relative">
              <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
              <input 
                type="number" 
                required
                min="1"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Coins className="w-5 h-5" />}
            {loading ? "Injecting..." : "Inject Credits Now"}
          </button>

          {status && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
              <p className="font-medium text-sm">{status.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
