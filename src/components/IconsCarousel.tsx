// src/components/IconsCarousel.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export default function IconsCarousel({ events }: { events: any[] }) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 2; 

  const next = () => {
    if (startIndex + itemsPerPage < events.length) {
      setStartIndex(startIndex + 1); // Trượt từng cái một cho mượt
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Logic hiển thị: Lấy danh sách cắt từ vị trí hiện tại
  // Nếu chỉ còn 1 bài cuối, vẫn giữ khung
  const visibleEvents = events.slice(startIndex, startIndex + itemsPerPage);
  
  const canPrev = startIndex > 0;
  const canNext = startIndex + itemsPerPage < events.length;

  if (!events || events.length === 0) return null;

  return (
    <div className="relative group">
      
      {/* NÚT TRÁI (CHỈ HIỆN KHI CÓ THỂ BACK) */}
      {canPrev && (
        <button 
          onClick={prev} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-black/50 hover:bg-blue-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-300 -ml-4 hover:scale-110 shadow-2xl"
          aria-label="Previous"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 duration-500 ease-in-out">
        {visibleEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="relative h-[450px] rounded-[3rem] overflow-hidden group/card cursor-pointer border border-white/10 hover:border-blue-500/50 transition-all">
              <img 
                src={event.imageUrl || ''} 
                className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 opacity-60 group-hover/card:opacity-80" 
                alt={event.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-10">
                <div className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-widest mb-3 opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-500`}>
                   Must Visit
                </div>
                <h3 className={`${playfair.className} text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tighter leading-[0.9]`}>
                  {event.name}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-8 max-w-lg font-sans opacity-80">
                  {event.aiSummary}
                </p>
                <span className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest group-hover/card:bg-blue-600 group-hover/card:text-white transition-all">
                    Read Planning Guide
                </span>
              </div>
          </Link>
        ))}
      </div>

      {/* NÚT PHẢI (CHỈ HIỆN KHI CÒN BÀI) */}
      {canNext && (
        <button 
          onClick={next} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-black/50 hover:bg-blue-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all duration-300 -mr-4 hover:scale-110 shadow-2xl"
          aria-label="Next"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* THANH TIẾN TRÌNH */}
      <div className="mt-8 flex justify-center gap-2">
         {Array.from({ length: Math.ceil(events.length / 2) }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${Math.floor(startIndex / 2) === idx ? 'w-12 bg-blue-600' : 'w-4 bg-white/20'}`}
            ></div>
         ))}
      </div>
      
    </div>
  );
}