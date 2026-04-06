// src/app/submit/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

const BOSS_SECRET_KEY = "BOSS2026";

type Category = 'Evergreen' | 'News';

const CATEGORIES: { value: Category; label: string; description: string; color: string }[] = [
  {
    value: 'Evergreen',
    label: 'Evergreen Guide',
    description: 'Timeless deep-dive on a Singapore attraction',
    color: 'cyan',
  },
  {
    value: 'News',
    label: 'News Update',
    description: 'Breaking news or timely Singapore update',
    color: 'orange',
  },
];

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [category, setCategory] = useState<Category>('Evergreen');
  const [insiderPrice, setInsiderPrice] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [secretTip, setSecretTip] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const form = e.currentTarget;
    const formData = new FormData(form);

    const secret = formData.get('secretKey');
    if (secret !== BOSS_SECRET_KEY) {
      setMessage({ type: 'error', text: '❌ Invalid Secret Key.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          slug: formData.get('slug'),
          imageUrl: formData.get('imageUrl'),
          description: formData.get('description'),
          excerpt: formData.get('excerpt'),
          category,
          insiderPrice: insiderPrice || null,
          bestTime: bestTime || null,
          secretTip: secretTip || null,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Published successfully! Check the site.' });
        form.reset();
        setInsiderPrice('');
        setBestTime('');
        setSecretTip('');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || '❌ Database error or duplicate slug.' });
      }
    } catch {
      setMessage({ type: 'error', text: '❌ Connection error. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6 relative overflow-hidden`}>
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <p className={`${mono.className} text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-black mb-4`}>
            // CONTENT COMMAND CENTER
          </p>
          <h1 className={`${playfair.className} text-6xl font-black uppercase italic text-white mb-4`}>
            Boss Portal
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Publish Evergreen guides or News updates directly to the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CATEGORY SELECTOR */}
          <div className="space-y-4">
            <label className={`${mono.className} text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 block`}>
              Content Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                    category === cat.value
                      ? cat.color === 'cyan'
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                      : 'bg-black border-white/8 hover:border-white/20'
                  }`}
                >
                  <p className={`font-black text-sm mb-1 ${
                    category === cat.value
                      ? cat.color === 'cyan' ? 'text-cyan-300' : 'text-orange-300'
                      : 'text-white'
                  }`}>
                    {cat.label}
                  </p>
                  <p className="text-gray-500 text-xs">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN FIELDS */}
          <div className="bg-white/3 border border-white/8 rounded-[2.5rem] p-8 space-y-6">
            <p className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]`}>
              Core Fields
            </p>

            <div className="space-y-2">
              <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                Title *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. The Ultimate Guide to Gardens by the Bay"
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                Slug (URL) *
              </label>
              <input
                name="slug"
                required
                placeholder="gardens-by-the-bay-guide"
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                Excerpt (1–2 sentence hook) *
              </label>
              <textarea
                name="excerpt"
                required
                rows={2}
                placeholder="A captivating one-liner that makes readers click..."
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                Hero Image URL *
              </label>
              <input
                name="imageUrl"
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                Main Content (HTML) *
              </label>
              <textarea
                name="description"
                required
                rows={14}
                placeholder="Paste your HTML content here..."
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all leading-relaxed text-sm"
              />
            </div>
          </div>

          {/* INSIDER INTELLIGENCE (EVERGREEN ONLY) */}
          {category === 'Evergreen' && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-6 relative">
              <div className="absolute -top-4 left-8 bg-blue-600 px-4 py-1.5 rounded-full">
                <span className={`${mono.className} text-white text-[9px] font-black uppercase tracking-widest`}>
                  ✦ Insider Intelligence Box
                </span>
              </div>
              <p className="text-gray-500 text-xs pt-2">
                Fills the structured data box shown at the top of the article.
              </p>

              <div className="space-y-2">
                <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                  💰 Admission Price
                </label>
                <input
                  value={insiderPrice}
                  onChange={(e) => setInsiderPrice(e.target.value)}
                  placeholder="e.g. Free / S$28 adult / S$15 child"
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                  🕐 Best Time to Visit
                </label>
                <input
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  placeholder="e.g. Weekday mornings, 9am–11am"
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-gray-500 block`}>
                  🤫 Secret Insider Tip
                </label>
                <textarea
                  value={secretTip}
                  onChange={(e) => setSecretTip(e.target.value)}
                  rows={2}
                  placeholder="The hidden tip only locals know..."
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* SECRET KEY */}
          <div className="space-y-2">
            <label className={`${mono.className} text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 block`}>
              Secret Key *
            </label>
            <input
              name="secretKey"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all text-center font-black tracking-[1em]"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-cyan-400 hover:text-white transition-all disabled:opacity-40 shadow-[0_0_30px_rgba(255,255,255,0.1)] text-sm"
          >
            {loading ? '⏳ Publishing...' : `🚀 Publish ${category} Content`}
          </button>

          {/* MESSAGE */}
          {message.text && (
            <div className={`p-6 rounded-2xl text-center font-bold text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}
        </form>

        <div className="mt-16 text-center">
          <Link href="/guides" className={`${mono.className} text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition`}>
            ← Back to Guides
          </Link>
        </div>
      </div>
    </main>
  );
}
