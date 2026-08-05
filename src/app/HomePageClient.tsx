'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from 'react';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { DiamondIcon, HexagonIcon, SparkleIcon } from '@/components/ui/Icons';

interface HomePageClientProps {
  playfairClass: string;
  monoClass: string;
  interClass: string;
  IMAGE_FALLBACK: string;
  topicCategories: Array<{ value: string; label: string; icon: string; href: string }>;
  neighborhoodData: Array<{ slug: string; name: string; tag: string; color: string }>;
  tools: Array<{ name: string; category: string; icon: string; status: string }>;
  todaysSingapore: any[];
  neighborhoodsWithCounts: any[];
  topicsWithCounts: any[];
  featuredGuides: any[];
  latestUpdates: any[];
}

export default function HomePageClient({
  playfairClass,
  monoClass,
  interClass,
  IMAGE_FALLBACK,
  topicCategories,
  neighborhoodData,
  tools,
  todaysSingapore,
  neighborhoodsWithCounts,
  topicsWithCounts,
  featuredGuides,
  latestUpdates,
}: HomePageClientProps) {
  // Initialize GSAP animations on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initAnimations = async () => {
      const { prefersReducedMotion, fadeInUp, imageReveal, parallax, staggerReveal, hoverLift, hoverImageZoom } = await import('@/lib/animations');
      
      if (prefersReducedMotion()) return;

      // Hero content animation
      fadeInUp('.hero-content > *', { delay: 0.2, stagger: 0.1, duration: 0.7 });
      
      // Hero image parallax
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        parallax(heroImage, { yPercent: 15, scrub: 1 });
      }

      // Section reveal animations
      const sections = document.querySelectorAll('section[data-section]');
      sections.forEach((section, index) => {
        staggerReveal(section as HTMLElement, '[data-animate]', { 
          delay: index * 0.1, 
          stagger: 0.08, 
          duration: 0.6 
        });
      });

      // Card hover effects
      const cards = document.querySelectorAll('.premium-card');
      cards.forEach(card => {
        const image = card.querySelector('img');
        if (image) {
          hoverLift(card as HTMLElement, -6);
          hoverImageZoom(image as HTMLElement, 1.04);
        }
      });
    };

    initAnimations();
  }, []);

  return (
    <main className={`${interClass} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5" data-section>
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?q=80&w=2000"
            alt="Singapore Skyline Night"
            fill
            priority
            className="hero-image object-cover opacity-40 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black -z-10" />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[140px] -z-10 mix-blend-screen animate-pulse' />

        <div className="hero-content relative z-10 max-w-7xl mx-auto px-6 text-center" data-animate>
          <p className={`${monoClass} text-blue-400 text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Singapore Resident Intelligence
          </p>
          <h1 className={`${playfairClass} text-6xl md:text-[9.5rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-8`}>
            Singapore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Unlocked
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Practical guides for living in Singapore — housing, transport, money, food, healthcare, and neighborhood intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/guides"
              className="premium-btn bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Browse All Guides
              <ArrowRightIcon className="ml-2 inline-block" />
            </Link>
            <Link
              href="/neighborhoods"
              className="premium-btn bg-transparent text-white border border-white/20 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Explore Neighborhoods
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TODAY'S SINGAPORE — 8 NEWEST RESIDENT ARTICLES */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" data-section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" data-animate>
          <div>
            <p className={`${monoClass} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
              Updated Today
            </p>
            <h2 className={`${playfairClass} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
              Today's<br />Singapore
            </h2>
          </div>
          <Link
            href="/latest"
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-all border-b border-gray-800 pb-1"
          >
            View All Latest →
          </Link>
        </div>

        {todaysSingapore.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-animate>
            {todaysSingapore.map((post, i) => (
              <Link
                key={post.id}
                href={`/guides/${post.slug}`}
                className={`premium-card group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className={`overflow-hidden relative ${i === 0 ? 'h-[400px]' : 'h-64'}`}>
                  <img
                    src={post.imageUrl || IMAGE_FALLBACK}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={post.title}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-blue-600 text-white rounded-full">
                      {post.category}
                    </span>
                    {post.neighborhood && (
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-600/80 text-white rounded-full">
                        {post.neighborhood}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className={`font-black mb-3 text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight ${i === 0 ? 'text-3xl' : 'text-xl'}`}>
                    {post.title}
                  </h3>
                  {post.excerpt && post.excerpt.trim() !== "" && (
                    <p className={`text-gray-500 text-sm leading-relaxed mb-6 flex-1 ${i === 0 ? 'line-clamp-3' : 'line-clamp-2'}`}>
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.author?.avatarUrl && (
                        <img src={post.author.avatarUrl} className="w-6 h-6 rounded-full border border-white/10" alt={post.author.name} />
                      )}
                      <span className={`${monoClass} text-[9px] text-gray-500 uppercase tracking-widest`}>
                        {post.author?.name || 'Editor'}
                      </span>
                    </div>
                    <span className={`${monoClass} text-blue-500 text-[9px] font-black uppercase tracking-widest`}>
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl" data-animate>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xl mb-4">No resident guides yet</p>
            <p className="text-gray-600 max-w-md mx-auto">Publish your first guide to see it here.</p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* NEIGHBORHOODS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-[#050505]" data-section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" data-animate>
            <div>
              <p className={`${monoClass} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                Where You Live
              </p>
              <h2 className={`${playfairClass} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                Neighborhoods
              </h2>
            </div>
            <Link
              href="/neighborhoods"
              className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-all border-b border-gray-800 pb-1"
            >
              All Neighborhoods →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" data-animate>
            {neighborhoodsWithCounts.map((hood) => (
              <Link
                key={hood.slug}
                href={`/neighborhoods/${hood.slug}`}
                className="premium-card group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-2 h-2 rounded-full bg-${hood.color}-500`} />
                  <span className={`${monoClass} text-${hood.color}-400 text-[9px] font-black uppercase tracking-widest`}>
                    {hood.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">
                  {hood.name}
                </h3>
                <p className={`${monoClass} text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2`}>
                  {hood.articleCount} Guides
                </p>
                <span className={`${monoClass} text-gray-500 text-[9px] uppercase tracking-widest`}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* BROWSE BY TOPIC */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" data-section>
        <div className="text-center mb-16" data-animate>
          <p className={`${monoClass} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            What You Need
          </p>
          <h2 className={`${playfairClass} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Browse by Topic
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Every guide is categorized so you can find exactly what matters to your daily life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-animate>
          {topicsWithCounts.map((topic) => (
            <Link
              key={topic.value}
              href={topic.href}
              className="premium-card group p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 text-center"
            >
              <TopicIcon name={topic.icon} className="w-10 h-10 mx-auto mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {topic.label}
              </h3>
              <p className={`${monoClass} text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]`}>
                {topic.count} Guides
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURED GUIDES — HIGH QUALITY EVERGREEN */}
      {/* ═══════════════════════════════════════════════ */}
      {featuredGuides.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-[#050505]" data-section>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" data-animate>
              <div>
                <p className={`${monoClass} text-cyan-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                  Planning Intelligence
                </p>
                <h2 className={`${playfairClass} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                  Featured<br />Guides
                </h2>
              </div>
              <Link
                href="/guides"
                className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-400 transition-all border-b border-gray-800 pb-1"
              >
                All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-animate>
              {featuredGuides.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="premium-card group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.imageUrl || IMAGE_FALLBACK}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-cyan-600 text-white rounded-full">
                        {post.category}
                      </span>
                      {post.neighborhood && (
                        <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-600/80 text-white rounded-full">
                          {post.neighborhood}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className={`${monoClass} flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/30 inline-flex`}>
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em]">Planning Report</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className={`${monoClass} text-[9px] text-gray-500 uppercase tracking-widest`}>
                        {post.author?.name || 'Editor'}
                      </span>
                      <span className={`${monoClass} text-cyan-500 text-[9px] font-black uppercase tracking-widest`}>
                        Read Report →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* USEFUL TOOLS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24" data-section>
        <div className="text-center mb-16" data-animate>
          <p className={`${monoClass} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Utilities
          </p>
          <h2 className={`${playfairClass} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Tools & Calculators
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-animate>
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="premium-card group p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="flex items-start gap-3 mb-4">
                <TopicIcon name={tool.icon} className="w-8 h-8 mt-1 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                <div>
                  <span className={`${monoClass} text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1 block`}>
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className={`${monoClass} text-[9px] font-bold uppercase tracking-widest text-gray-500`}>
                  {tool.status}
                </span>
                <span className={`${monoClass} text-blue-500 text-[9px] font-black uppercase tracking-widest`}>
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center" data-animate>
          <Link
            href="/tools"
            className="premium-btn inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-xs text-white transition-all hover:border-blue-500 hover:text-blue-400"
          >
            View All Tools →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* LATEST UPDATES — NEWS ONLY */}
      {/* ═══════════════════════════════════════════════ */}
      {latestUpdates.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-[#050505]" data-section>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6" data-animate>
              <div>
                <p className={`${monoClass} text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                  Breaking & New
                </p>
                <h2 className={`${playfairClass} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                  Latest<br />Updates
                </h2>
              </div>
              <Link
                href="/latest"
                className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-orange-400 transition-all border-b border-gray-800 pb-1"
              >
                All Updates →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-animate>
              {latestUpdates.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="premium-card group flex gap-5 p-6 bg-[#0d0d0d] border border-white/5 rounded-[1.5rem] hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-[1rem] overflow-hidden flex-shrink-0 bg-white/5 relative">
                    <img
                      src={post.imageUrl || IMAGE_FALLBACK}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`${monoClass} flex items-center gap-2 mb-2`}>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <span className="text-orange-400 text-[8px] font-black uppercase tracking-widest">New</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className={`${monoClass} text-gray-600 text-[9px] mt-2 uppercase tracking-widest`}>
                      {new Date(post.createdAt).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* NEWSLETTER CTA */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-black" data-section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center" data-animate>
            <p className={`${monoClass} text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4`}>
              Stay Informed
            </p>
            <h2 className={`${playfairClass} text-4xl md:text-6xl font-black mb-6 tracking-tighter italic`}>
              Get Singapore Intelligence in Your Inbox
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Weekly digest of new guides, policy changes, and neighborhood insights. No spam. Unsubscribe anytime.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-black border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="premium-btn bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg whitespace-nowrap"
              >
                Subscribe
                <ArrowRightIcon className="ml-2 inline-block" />
              </button>
            </form>
            <p className={`${monoClass} text-[10px] text-gray-600 mt-6 uppercase tracking-[0.3em]`}>
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TRUST BANNER */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 border-t border-white/5 bg-black" data-section>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 border border-white/8 rounded-[3.5rem] overflow-hidden" data-animate>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <DiamondIcon className="w-8 h-8 text-cyan-400 mb-6" />
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Research-Driven Guides</h3>
            <p className="text-gray-500 leading-relaxed">Built from extensive source research and regular updates.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <HexagonIcon className="w-8 h-8 text-blue-400 mb-6" />
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Resident-First</h3>
            <p className="text-gray-500 leading-relaxed">Built for people living in Singapore, not tourists passing through.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <SparkleIcon className="w-8 h-8 text-purple-400 mb-6" />
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Partner Rates</h3>
            <p className="text-gray-500 leading-relaxed">Integrated with Trip.com and Klook for the best booking rates available.</p>
          </div>
        </div>
      </section>

    </main>
  );
}