"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { PhoneCall, Upload, PlayCircle, Key, Rocket, CheckCircle, AlertCircle } from 'lucide-react';

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
        body: JSON.stringify({
          twilioSid,
          twilioAuth,
          twilioPhone,
          audioUrl,
          leads
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-extrabold tracking-tight">GhostDial.ai</span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Drop 1,000 Voicemails.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Without Dialing Once.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload your lead list, drop your Twilio keys, and paste your audio pitch URL. Our system detects answering machines and drops your pitch directly into their inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                <h2 className="text-xl font-bold">Upload Leads (CSV)</h2>
              </div>
              <label className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mb-3" />
                <span className="text-sm font-medium text-gray-300">Click or drag CSV file</span>
                <span className="text-xs text-gray-500 mt-1">Must contain 'Phone' column</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
              {leads.length > 0 && (
                <div className="mt-4 flex items-center text-sm text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Successfully loaded {leads.length} leads
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
                <h2 className="text-xl font-bold">Audio Pitch URL</h2>
              </div>
              <div className="relative">
                <PlayCircle className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://your-server.com/pitch.mp3" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Provide a publicly accessible URL to your .mp3 file.</p>
            </div>

          </div>

          {/* Right Column: BYOK & Execution */}
          <div className="space-y-6">
            
            {/* Step 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">3</div>
                <h2 className="text-xl font-bold">Twilio BYOK (Bring Your Own Key)</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Account SID</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input type="text" value={twilioSid} onChange={(e) => setTwilioSid(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:border-pink-500 outline-none" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Auth Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input type="password" value={twilioAuth} onChange={(e) => setTwilioAuth(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:border-pink-500 outline-none" placeholder="••••••••••••••••••••••••••••••••" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">From Number</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input type="text" value={twilioPhone} onChange={(e) => setTwilioPhone(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:border-pink-500 outline-none" placeholder="+1234567890" />
                  </div>
                </div>
              </div>
            </div>

            {/* Execute */}
            <button 
              onClick={handleBlast}
              disabled={loading}
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="animate-pulse flex items-center"><Rocket className="w-6 h-6 mr-2 animate-bounce" /> Initiating Blast...</span>
              ) : (
                <span className="flex items-center"><Rocket className="w-6 h-6 mr-2" /> Launch Campaign</span>
              )}
            </button>

            {/* Results Console */}
            {result && (
              <div className={`p-4 rounded-xl border ${result.error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                {result.error ? (
                  <div className="flex items-start text-red-400">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{result.error}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center text-green-400 font-bold mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {result.message}
                    </div>
                    {result.errors?.length > 0 && (
                      <p className="text-xs text-red-400 mt-2">Note: {result.errors.length} calls failed (Check Twilio balance or unverified numbers).</p>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
