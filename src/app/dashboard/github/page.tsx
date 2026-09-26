"use client";

import { useState, useRef } from "react";
import { Link2, Target, Loader2, PlayCircle, CheckCircle2, Activity, ExternalLink } from "lucide-react";

export default function GithubStackingPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("en");
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<{time: string, type: string, title: string, message: string}[]>([]);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  
  const cancelRef = useRef(false);

  const addLog = (type: string, title: string, message: string) => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type,
      title,
      message
    }]);
  };

  const handleGenerate = async () => {
    if (!targetUrl || !keyword) {
      addLog('error', 'Validation Failed', 'Please provide both Target URL and Keyword');
      return;
    }

    setIsGenerating(true);
    setLogs([]);
    setGeneratedUrls([]);
    cancelRef.current = false;

    addLog('info', 'Engine Initialized', 'Connecting to GitHub API with Anti-Ban protocols...');

    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, keyword, language, count })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        if (cancelRef.current) {
          addLog('error', 'Operation Cancelled', 'Forced termination by user.');
          break;
        }

        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'info') {
              addLog('info', 'Processing', data.message);
            } else if (data.type === 'success') {
              addLog('success', 'Asset Created', data.message);
              setGeneratedUrls(prev => [...prev, data.url]);
            } else if (data.type === 'done') {
              addLog('success', 'Operation Complete', 'Silo generation finished successfully.');
            }
          } catch (e) {
            console.error('Failed to parse chunk', line);
          }
        }
      }
    } catch (error) {
      addLog('error', 'Execution Failed', 'Failed to communicate with API backend.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-4">
            <Link2 className="w-12 h-12 text-emerald-500" />
            GitHub Silo Engine
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-sm font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest align-middle ml-2">
              DA-100
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Deploy highly optimized AEO/GEO contextual AI content directly to GitHub Gists. 
            Assets are automatically daisy-chained to push maximum authority to your money site.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Target Money Site URL</label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="url" 
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://client-website.com"
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Primary Keyword / Entity</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. Best Plumber in London"
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Content Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-4 text-white appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                    >
                      <option value="English">English (Default)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="French">French (Franais)</option>
                      <option value="Spanish">Spanish (Espaol)</option>
                      <option value="Italian">Italian (Italiano)</option>
                      <option value="Dutch">Dutch (Nederlands)</option>
                      <option value="Urdu">Urdu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Silo Nodes (Articles)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="flex gap-4 w-full mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg py-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
                    {isGenerating ? "Executing Engine..." : "Initiate GitHub Silo"}
                  </button>
                  {isGenerating && (
                    <button
                      onClick={() => cancelRef.current = true}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold px-8 py-5 rounded-xl flex items-center justify-center transition-all border border-rose-500/30"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#050B14] border border-slate-800 rounded-3xl p-6 shadow-2xl h-[400px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-white text-lg">Live Engine Logs</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-sm custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 italic">
                    System standing by. Awaiting execution command...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                      <div className="mt-1">
                        {log.type === 'info' && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                        {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {log.type === 'error' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                      </div>
                      <div>
                        <p className={`font-bold ${log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          [{log.time}] {log.title}
                        </p>
                        <p className="text-slate-500 mt-1">{log.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {generatedUrls.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Live Assets Generated ({generatedUrls.length})
                  </h3>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {generatedUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#020617] p-3 rounded-xl hover:bg-slate-900 border border-slate-800 transition-colors text-sm text-emerald-500 group">
                      <ExternalLink className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
