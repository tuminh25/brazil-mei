// src/app/attractions/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

export default async function AttractionsPage() {
  const attractions = await prisma.event.findMany({
    where: { 
      status: 'PUBLISHED',
      category: 'Attraction' // CHỈ LẤY ATTRACTION
    },
    orderBy: { hotnessScore: 'desc' }
  });

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`${playfair.className} text-6xl font-black mb-6 uppercase tracking-tighter`}>Singapore Icons</h1>
        <p className="text-xl text-gray-400 mb-20 max-w-2xl">The world-class destinations that define the city. Must-visit experiences for every traveler.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {attractions.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 cursor-pointer">
               <img src={event.imageUrl || ''} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               <div className="absolute bottom-0 left-0 w-full p-12">
                  <h3 className={`${playfair.className} text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tighter leading-[0.9]`}>{event.name}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-8 max-w-lg">{event.aiSummary}</p>
                  <span className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">Read Insider Guide</span>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}