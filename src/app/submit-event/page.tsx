// src/app/submit-event/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

// MÃ BẢO MẬT (Sếp có thể đổi ở đây)
const BOSS_SECRET_KEY = "BOSS2026";

export default function SubmitEventPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [category, setCategory] = useState('Event');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const secret = formData.get('secretKey');
    if (secret !== BOSS_SECRET_KEY) {
      setMessage({ type: 'error', text: '❌ Sai Secret Key! Bạn không có quyền up bài.' });
      setLoading(false);
      return;
    }

    // Gửi dữ liệu qua API Route (Tôi sẽ viết nội dung API ở bước sau hoặc dùng Server Action trực tiếp)
    // Để đơn giản nhất, tôi gọi một function xử lý ngay trong Next.js
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          slug: formData.get('slug'),
          imageUrl: formData.get('imageUrl'),
          description: formData.get('description'),
          category: category,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ ĐÃ LÊN SÓNG THÀNH CÔNG! Check web ngay Sếp.' });
        (document.getElementById('submit-form') as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: '❌ Lỗi Database hoặc trùng đường dẫn (Slug).' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Lỗi kết nối hệ thống.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className={`${playfair.className} text-5xl font-black uppercase italic text-white mb-2`}>
            Boss Portal
          </h1>
          <p className={`${mono.className} text-blue-500 text-xs tracking-[0.4em]`}>
            // QUICK CONTENT SUBMISSION
          </p>
        </div>

        <form id="submit-form" action={handleSubmit} className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-xl">
          
          {/* TÊN BÀI */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Title / Event Name *</label>
            <input name="name" required placeholder="Ví dụ: Blackpink World Tour 2026" 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all" />
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Slug (URL) *</label>
            <input name="slug" required placeholder="blackpink-tour-singapore" 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-mono text-sm" />
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Select Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Event', 'Attraction', 'Expert Guide', 'Trending'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                    category === cat ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-black border-white/10 text-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* IMAGE URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Feature Image URL *</label>
            <input name="imageUrl" required placeholder="https://images.unsplash.com/..." 
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-sm" />
          </div>

          {/* CONTENT HTML */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Main Content (HTML Allowed) *</label>
            <textarea name="description" required rows={12} placeholder="Paste your HTML from Perplexity here..." 
              className="w-full bg-black border border-white/10 rounded-3xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all leading-relaxed" />
          </div>

          {/* SECRET KEY */}
          <div className="pt-8 border-t border-white/5 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">Secret Key *</label>
            <input name="secretKey" type="password" required placeholder="Enter Secret Key to Publish" 
              className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-center font-black tracking-[1em]" />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 shadow-2xl"
          >
            {loading ? 'Processing...' : 'Publish Content Now'}
          </button>

          {/* MESSAGE */}
          {message.text && (
            <div className={`mt-6 p-6 rounded-2xl text-center font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}
        </form>

        <div className="mt-12 text-center">
          <Link href="/events" className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-white transition">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    </main>
  );
}