import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: "About Us | SG Events Hub - Singapore's Independent Digital Authority",
  description: "Decoding Singapore's cultural pulse. Learn about our mission, our expert team, and our commitment to verified insider intelligence.",
};

export default function AboutPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-40 px-6 border-b border-white/5 overflow-hidden">
        {/* AMBIENT GLOW */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px] -z-10 mix-blend-screen animate-pulse' />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className={`${mono.className} text-blue-400 text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Independent Media Platform
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12`}>
            The Culture <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Architects
            </span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
            "Decoding Singapore's cultural pulse for residents and travelers."
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* IDENTITY STATEMENT & MISSION */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div>
            <h2 className={`${playfair.className} text-4xl md:text-6xl font-black uppercase italic mb-10 tracking-tighter`}>
              Our Identity
            </h2>
            <div className="space-y-8 text-gray-400 text-lg leading-relaxed">
              <p className="border-l-2 border-blue-500 pl-8 py-2 bg-blue-500/5 text-white font-medium">
                SG Events Hub is an independent digital media platform based in Singapore. We are not affiliated with any physical event planning agencies.
              </p>
              <p>
                Founded in 2026, we emerged from a need for unfiltered, high-fidelity intelligence on the Singapore living experience. We don't just list events; we curate the soul of the city.
              </p>
              <p>
                Our mission is to provide "Verified Insider Intelligence." Every guide, every recommendation, and every update is scrutinized by our team of local experts to ensure it meets the "Masterpiece" standard.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-[#0a0a0a]">
              <Image 
                src="https://images.unsplash.com/photo-1518005020251-58296d84138e?q=80&w=1600" 
                alt="Singapore Night Architecture" 
                fill 
                className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className={`${mono.className} text-cyan-400 text-[10px] uppercase tracking-[0.3em] mb-4`}>Core Directive</div>
                <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter">Verified Insider Intelligence</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* EEAT: THE PERSONAS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <p className={`${mono.className} text-purple-500 text-[10px] uppercase tracking-[0.5em] mb-6 font-black text-center lg:text-left`}>
              The Intelligence Unit
            </p>
            <h2 className={`${playfair.className} text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-center lg:text-left`}>
              The Experts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* DESMOND */}
            <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] hover:border-blue-500/30 transition-all group">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" alt="Desmond" className="w-full h-full object-cover opacity-80" />
              </div>
              <h4 className="text-white font-black text-2xl mb-2 uppercase tracking-tight">Desmond</h4>
              <p className={`${mono.className} text-blue-500 text-[10px] uppercase tracking-widest mb-6`}>Founder & Chief Editor</p>
              <p className="text-gray-500 leading-relaxed text-sm">
                A 20-year Singapore resident and former cultural consultant. Desmond oversees the editorial integrity of every "Masterpiece" guide.
              </p>
            </div>

            {/* SARAH */}
            <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 transition-all group">
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform overflow-hidden">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400" alt="Sarah" className="w-full h-full object-cover opacity-80" />
              </div>
              <h4 className="text-white font-black text-2xl mb-2 uppercase tracking-tight">Sarah</h4>
              <p className={`${mono.className} text-purple-500 text-[10px] uppercase tracking-widest mb-6`}>Head of Cultural Research</p>
              <p className="text-gray-500 leading-relaxed text-sm">
                With a background in heritage conservation, Sarah ensures our guides respect the historical weight of Singapore's landmarks.
              </p>
            </div>

            {/* JAX */}
            <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] hover:border-cyan-500/30 transition-all group">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" alt="Jax" className="w-full h-full object-cover opacity-80" />
              </div>
              <h4 className="text-white font-black text-2xl mb-2 uppercase tracking-tight">Jax</h4>
              <p className={`${mono.className} text-cyan-500 text-[10px] uppercase tracking-widest mb-6`}>Intelligence Analyst</p>
              <p className="text-gray-500 leading-relaxed text-sm">
                Our trend scout. Jax monitors the city's pulse 24/7, identifying the "next big thing" before it hits the mainstream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CALL */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-48 text-center px-6 border-t border-white/5 relative overflow-hidden">
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10' />
        
        <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase italic mb-12 tracking-tighter`}>
          Experience the <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Masterpiece</span>
        </h2>
        <div className="flex justify-center">
          <div className={`${mono.className} text-gray-700 text-[10px] uppercase tracking-[0.5em] font-black`}>
            EST. 2026 // SG EVENTS HUB // ALL RIGHTS RESERVED
          </div>
        </div>
      </section>
    </main>
  );
}
