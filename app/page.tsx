"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { PhoneCall, Upload, Play, Key, Zap, Check, AlertTriangle, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioAuth, setTwilioAuth] = useState('');
  const [twilioPhone, setTwilioPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const validLeads = results.data.filter((row: any) => row.Phone || row['Phone Number'] || row.phone);
          setLeads(validLeads);
        }
      });
    }
  };

  const handleBlast = async () => {
    if (!leads.length || !audioUrl || !twilioSid || !twilioAuth || !twilioPhone) {
      alert('Please fill out all fields and upload a valid CSV with a Phone column.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twilioSid, twilioAuth, twilioPhone, audioUrl, leads })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* ShipFast-style Minimal Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight">
          <div className="bg-yellow-400 p-1.5 rounded-lg text-black">
            <PhoneCall size={20} className="fill-current" />
          </div>
          GhostDial
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition">How it works</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium hover:text-white transition hidden sm:block">Log in</a>
          <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Get GhostDial
          </button>
        </div>
      </nav>

      {/* Hero Section - Marc Lou Brutalist/Clean Style */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-semibold mb-8">
          <Zap size={16} className="fill-current" />
          <span>The #1 AI Agency Cheat Code</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
          Drop 1,000 voicemails. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
            Without dialing once.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Upload your leads. Record a 30-second pitch. GhostDial bypasses the gatekeeper and drops your audio straight into their voicemail inbox.
        </p>

        <div className="flex flex-col items-center justify-center gap-6">
          <button 
            onClick={() => document.getElementById('app-dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-extrabold hover:bg-yellow-300 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            Launch Your First Campaign
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* ShipFast Social Proof */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-[#0B0F19]" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} className="fill-current" />)}
            </div>
            <p className="text-sm text-slate-400 font-medium">Loved by <strong className="text-white">500+</strong> agency owners</p>
          </div>
        </div>
      </main>

      {/* The Actual Tool - Mac Window Style */}
      <section id="app-dashboard" className="max-w-5xl mx-auto px-6 pb-32">
        <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Window Header */}
          <div className="bg-[#1F2937] border-b border-slate-800 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-xs font-medium text-slate-400 tracking-wide uppercase">Campaign Dashboard</div>
          </div>

          {/* App Body */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Left Column */}
              <div className="space-y-8">
                
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold">1</span>
                    <h3 className="text-white font-bold text-lg">Upload Leads</h3>
                  </div>
                  <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 hover:bg-slate-800 hover:border-yellow-400/50 transition cursor-pointer">
                    <Upload className="text-slate-400 group-hover:text-yellow-400 transition mb-2" size={24} />
                    <span className="text-sm font-medium text-slate-300">Drop your CSV here</span>
                    <span className="text-xs text-slate-500 mt-1">Must include "Phone" column</span>
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {leads.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-400 font-medium">
                      <Check size={16} /> Loaded {leads.length} leads successfully
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold">2</span>
                    <h3 className="text-white font-bold text-lg">Your Pitch (Audio URL)</h3>
                  </div>
                  <div className="relative">
                    <Play className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://example.com/pitch.mp3" 
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-8">
                
                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold">3</span>
                    <h3 className="text-white font-bold text-lg">Twilio Configuration</h3>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Account SID</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input type="text" value={twilioSid} onChange={(e) => setTwilioSid(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder:text-slate-600" placeholder="AC..." />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Auth Token</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input type="password" value={twilioAuth} onChange={(e) => setTwilioAuth(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder:text-slate-600" placeholder="••••••••••••••••" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 block">Twilio Phone Number</label>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input type="text" value={twilioPhone} onChange={(e) => setTwilioPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder:text-slate-600" placeholder="+1234567890" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button 
                    onClick={handleBlast}
                    disabled={loading}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                  >
                    {loading ? (
                      <><Zap className="animate-pulse" size={20} /> Executing Drop...</>
                    ) : (
                      <><Zap size={20} className="fill-current" /> Blast Voicemails Now</>
                    )}
                  </button>
                </div>

                {/* Console Output */}
                {result && (
                  <div className={`p-4 rounded-xl border ${result.error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                    {result.error ? (
                      <div className="flex items-start gap-2 text-red-400">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{result.error}</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-green-400 font-bold">
                          <Check size={18} /> {result.message}
                        </div>
                        {result.errors?.length > 0 && (
                          <div className="mt-2 text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                            Failed: {result.errors.length} numbers (Usually unverified trial numbers).
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
