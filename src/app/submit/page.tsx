// src/app/submit/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

const BOSS_SECRET_KEY = "SG2026";

type Category = 'Evergreen' | 'News';

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [category, setCategory] = useState<Category>('Evergreen');
  
  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [insiderPrice, setInsiderPrice] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [secretTip, setSecretTip] = useState('');
  const [tripUrl, setTripUrl] = useState('');
  const [klookUrl, setKlookUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  
  const [isExisting, setIsExisting] = useState(false);
  const lastFetchedSlug = useRef('');

  // Auto-Fetch Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug && slug.length > 3 && slug !== lastFetchedSlug.current) {
        fetchExistingPost(slug);
      }
    }, 800); // Debounce fetch

    return () => clearTimeout(timer);
  }, [slug]);

  async function fetchExistingPost(targetSlug: string) {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/submit?slug=${targetSlug}`);
      if (res.ok) {
        const data = await res.json();
        // Load data into fields
        setTitle(data.title || '');
        setExcerpt(data.excerpt || '');
        setImageUrl(data.imageUrl || '');
        setContent(data.content || '');
        setCategory(data.category === 'News' ? 'News' : 'Evergreen');
        setInsiderPrice(data.insiderPrice || '');
        setBestTime(data.bestTime || '');
        setSecretTip(data.secretTip || '');
        setTripUrl(data.tripUrl || '');
        setKlookUrl(data.klookUrl || '');
        setIsExisting(true);
        setMessage({ type: 'success', text: `✨ Found existing post: "${data.title}". Switch to Edit Mode.` });
      } else {
        setIsExisting(false);
        // Don't clear fields if post not found, user might be typing a new one
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setFetching(false);
      lastFetchedSlug.current = targetSlug;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (secretKey !== BOSS_SECRET_KEY) {
      setMessage({ type: 'error', text: '❌ Invalid Secret Key.' });
      return;
    }

    if (isExisting) {
      const confirmUpdate = window.confirm(`⚠️ WARNING: A post with the slug "${slug}" already exists. Do you want to OVERWRITE it with this new content? This cannot be undone.`);
      if (!confirmUpdate) return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          slug,
          imageUrl,
          description: content,
          excerpt,
          category,
          insiderPrice: insiderPrice || null,
          bestTime: bestTime || null,
          secretTip: secretTip || null,
          tripUrl: tripUrl || null,
          klookUrl: klookUrl || null,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: isExisting ? '✅ Masterpiece updated successfully!' : '🚀 New masterpiece published!' });
        if (!isExisting) {
          // Reset form only if it was a new post
          setTitle('');
          setSlug('');
          setExcerpt('');
          setImageUrl('');
          setContent('');
          setInsiderPrice('');
          setBestTime('');
          setSecretTip('');
          setTripUrl('');
          setKlookUrl('');
          setIsExisting(false);
        }
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || '❌ Database error.' });
      }
    } catch {
      setMessage({ type: 'error', text: '❌ Connection error. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[#020203] text-white selection:bg-cyan-500/30`}>
      {/* GRID OVERLAY */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen relative">
        
        {/* LEFT SIDEBAR: DASHBOARD NAV */}
        <aside className="lg:col-span-3 border-r border-white/5 p-10 hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="mb-20">
            <h2 className={`${playfair.className} text-4xl font-black italic tracking-tighter mb-2`}>BOSS<span className="text-cyan-500">.</span></h2>
            <p className={`${mono.className} text-[10px] text-gray-600 uppercase tracking-[0.4em]`}>Content Command</p>
          </div>

          <div className="space-y-2 flex-1">
            <div className={`p-4 rounded-xl border transition-all ${isExisting ? 'bg-orange-500/10 border-orange-500/20 shadow-lg' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
              <p className={`${mono.className} text-[9px] font-black uppercase tracking-widest mb-1 ${isExisting ? 'text-orange-400' : 'text-cyan-400'}`}>
                {isExisting ? '✦ Edit Mode Active' : '✦ New Entry Mode'}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isExisting 
                  ? "Smart Update detected a matching slug. Changes will overwrite the previous masterpiece." 
                  : "You are creating a new entry. Ensure the slug is unique and SEO-optimized."}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-white/5">
             <Link href="/guides" className="flex items-center gap-3 text-gray-500 hover:text-white transition group">
                <span className="w-8 h-[1px] bg-gray-800 group-hover:w-12 group-hover:bg-cyan-500 transition-all"></span>
                <span className={`${mono.className} text-[10px] uppercase font-black tracking-widest`}>Exit Portal</span>
             </Link>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9 p-8 md:p-16 lg:p-24">
          
          {/* HEADER */}
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className={`${mono.className} text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-black mb-4`}>
                // SYSTEM INTERFACE v2.0
              </p>
              <h1 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase italic leading-none`}>
                Dashboard
              </h1>
            </div>
            
            <div className="flex gap-2">
              {(['Evergreen', 'News'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                    category === cat 
                      ? 'bg-white text-black border-white shadow-xl scale-105' 
                      : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat} Guide
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            
            {/* CORE METADATA */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-blue-600"></span>
                <h3 className={`${mono.className} text-[11px] text-blue-500 font-black uppercase tracking-[0.4em]`}>Identity & Reach</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Master Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. The Ultimate Guide to Marina Bay Sands"
                    className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex justify-between">
                    Resource Slug
                    {fetching && <span className="text-cyan-500 animate-pulse">FETCHING...</span>}
                  </label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="marina-bay-sands-ultimate-guide"
                    className={`w-full bg-[#0a0a0c] border rounded-2xl px-6 py-5 text-white outline-none transition-all font-mono text-sm shadow-inner ${
                      isExisting ? 'border-orange-500/50 text-orange-400' : 'border-white/5 focus:border-cyan-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Excerpt (The Narrative Hook)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  rows={2}
                  placeholder="A high-conversion hook that captures the essence of the experience..."
                  className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Hero Asset URL</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none transition-all text-sm shadow-inner"
                />
              </div>
            </section>

            {/* DEEP CONTENT */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-purple-600"></span>
                <h3 className={`${mono.className} text-[11px] text-purple-500 font-black uppercase tracking-[0.4em]`}>Deep Intelligence Content</h3>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Main Body (HTML Optimized)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={20}
                  placeholder="Paste professional HTML content here. Use <h2>, <h3>, <p>, and <ul> for premium layout."
                  className="w-full bg-[#0a0a0c] border border-white/5 rounded-3xl px-8 py-8 text-white focus:border-purple-500 outline-none transition-all leading-relaxed text-base font-serif shadow-2xl"
                />
              </div>
            </section>

            {/* AFFILIATE REVENUE CHANNELS */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-emerald-600"></span>
                <h3 className={`${mono.className} text-[11px] text-emerald-500 font-black uppercase tracking-[0.4em]`}>Affiliate Revenue Channels</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Trip.com Deep Link
                  </label>
                  <input
                    value={tripUrl}
                    onChange={(e) => setTripUrl(e.target.value)}
                    placeholder="https://www.trip.com/hotels/..."
                    className="w-full bg-[#080c0a] border border-emerald-500/10 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none transition-all text-sm font-mono shadow-md"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Klook Deep Link
                  </label>
                  <input
                    value={klookUrl}
                    onChange={(e) => setKlookUrl(e.target.value)}
                    placeholder="https://www.klook.com/activity/..."
                    className="w-full bg-[#0c0a08] border border-emerald-500/10 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none transition-all text-sm font-mono shadow-md"
                  />
                </div>
              </div>
            </section>

            {/* EVERGREEN STRUCTURED DATA */}
            {category === 'Evergreen' && (
              <section className="space-y-10 p-10 bg-blue-500/5 rounded-3xl border border-blue-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <span className="w-12 h-[1px] bg-cyan-400"></span>
                  <h3 className={`${mono.className} text-[11px] text-cyan-400 font-black uppercase tracking-[0.4em]`}>Evergreen Intel Box</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Admission Price</label>
                    <input
                      value={insiderPrice}
                      onChange={(e) => setInsiderPrice(e.target.value)}
                      placeholder="e.g. Adult: S$28 / Child: S$15"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all text-sm shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Best Time to Visit</label>
                    <input
                      value={bestTime}
                      onChange={(e) => setBestTime(e.target.value)}
                      placeholder="e.g. Weekdays at 10:00 AM"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all text-sm shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secret Insider Tip</label>
                  <textarea
                    value={secretTip}
                    onChange={(e) => setSecretTip(e.target.value)}
                    rows={3}
                    placeholder="The professional tip that only locals or frequent visitors know..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all text-sm resize-none shadow-inner"
                  />
                </div>
              </section>
            )}

            {/* AUTHORIZATION & ACTION */}
            <section className="pt-20 border-t border-white/5 flex flex-col items-center gap-10">
              <div className="w-full max-w-sm space-y-4">
                <label className={`${mono.className} text-[10px] text-center block font-black uppercase tracking-[0.4em] text-gray-600`}>Authorization Key Required</label>
                <input
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b-2 border-white/10 px-6 py-4 text-white focus:border-cyan-500 outline-none transition-all text-center font-black tracking-[1.5em] text-2xl"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative"
              >
                <div className={`absolute -inset-1 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500 ${isExisting ? 'bg-orange-600' : 'bg-cyan-600'}`}></div>
                <div className={`relative w-full py-8 rounded-2xl font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                  isExisting ? 'bg-orange-600 text-white' : 'bg-white text-black hover:bg-cyan-500 hover:text-white'
                }`}>
                  {loading ? '⏳ PROCESSING...' : isExisting ? '⚡ SMART UPDATE PORT' : `🚀 PUBLISH ${category.toUpperCase()}`}
                  {!loading && <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                </div>
              </button>

              {message.text && (
                <div className={`w-full p-6 rounded-2xl text-center font-black uppercase tracking-widest text-xs border animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}
            </section>
          </form>

          <footer className="mt-32 text-center text-gray-800">
            <p className={`${mono.className} text-[9px] uppercase tracking-[0.5em]`}>
              © 2026 SG EVENTS HUB • INTERNAL CMS v2
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

