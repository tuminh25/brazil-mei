'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from 'react';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon, DiamondIcon, HexagonIcon, SparkleIcon } from '@/components/ui/Icons';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initAnimations = async () => {
      const { 
        prefersReducedMotion, 
        fadeInUp, 
        imageReveal, 
        parallax, 
        staggerReveal, 
        hoverLift, 
        hoverImageZoom,
        magneticButton,
        headlineReveal,
        floatingParticles,
        clipReveal,
        initPageAnimations
      } = await import('@/lib/animations');
      
      if (prefersReducedMotion()) return;

      // Hero headline reveal - word by word
      const heroHeadline = document.querySelector('.hero-headline');
      if (heroHeadline) {
        headlineReveal(heroHeadline as HTMLElement, { 
          type: 'words', 
          duration: 1.2, 
          stagger: 0.08,
          delay: 0.3 
        });
      }

      // Hero subtitle fade up
      fadeInUp('.hero-subtitle', { delay: 0.8, stagger: 0.1, duration: 0.8 });
      
      // Hero CTAs
      fadeInUp('.hero-cta', { delay: 1.2, stagger: 0.1, duration: 0.8 });
      
      // Trust indicators
      fadeInUp('.hero-trust', { delay: 1.6, stagger: 0.08, duration: 0.6 });

      // Hero image parallax
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        parallax(heroImage, { yPercent: 20, scrub: 1 });
      }

      // Hero image clip reveal
      clipReveal(heroImage as HTMLElement, { 
        delay: 0.2, 
        duration: 1.5, 
        direction: 'top' 
      });

      // Floating particles in hero
      if (particlesRef.current) {
        floatingParticles(particlesRef.current, { 
          count: 15, 
          color: '#2563eb', 
          size: 2, 
          speed: 30 
        });
      }

      // Magnetic buttons
      const magneticButtons = document.querySelectorAll('[data-magnetic]');
      magneticButtons.forEach(btn => {
        magneticButton(btn as HTMLElement, 0.15);
      });

      // Section reveal animations
      const sections = document.querySelectorAll('section[data-section]');
      sections.forEach((section) => {
        staggerReveal(section as HTMLElement, '[data-animate]', { 
          delay: 0.1, 
          stagger: 0.06, 
          duration: 0.7 
        });
      });

      // Card hover effects
      const cards = document.querySelectorAll('.card, .card-elevated, .card-glass, .premium-card');
      cards.forEach(card => {
        const image = card.querySelector('img');
        if (image) {
          hoverLift(card as HTMLElement, -6);
          hoverImageZoom(image as HTMLElement, 1.03);
        }
      });
    };

    initAnimations();
  }, []);

  return (
    <main className={`${interClass} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] selection:bg-[var(--color-blue)]/30 overflow-x-hidden`}>

      {/* ═════════════════════════════════════════════════════════════════════════════════
         HERO — Cinematic Fullscreen Editorial
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section 
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-[var(--color-border)]"
        data-section
        ref={heroRef}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2400"
            alt="Singapore Marina Bay Skyline at Dusk"
            fill
            priority
            className="hero-image object-cover opacity-20 scale-100"
            sizes="100vw"
          />
        </div>

        {/* Gradient Mesh - Layered Lighting */}
        <div className="absolute inset-0 -z-10 gradient-mesh" />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 -z-10 noise-overlay" />

        {/* Base Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)]/80 via-[var(--color-black)]/90 to-[var(--color-black)] -z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--color-black)]/60 to-transparent -z-10" />

        {/* Floating Particles Container */}
        <div className="absolute inset-0 -z-5 particles-container" ref={particlesRef} />

        {/* Hero Content */}
        <div className="hero-content relative z-10 max-w-7xl mx-auto px-6 text-center py-20">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8" data-animate>
            <span className="w-1.5 h-1.5 bg-[var(--color-green)] rounded-full animate-pulse" />
            <span className={`${monoClass} text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]`}>
              Live Intelligence Platform
            </span>
          </div>
          
          {/* Eyebrow */}
          <p className={`${monoClass} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-6 font-black hero-subtitle`}>
            Singapore Resident Intelligence
          </p>
          
          {/* Headline - Dominant, Editorial */}
          <h1 className={`${playfairClass} hero-headline text-6xl md:text-[9.5rem] lg:text-[11rem] font-black leading-[0.82] tracking-tighter uppercase text-[var(--color-text-primary)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-8 text-balance`}>
            Singapore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-blue)] to-[var(--color-purple)]">
              Unlocked
            </span>
          </h1>
          
          {/* Subtitle - Breathing Room */}
          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light hero-subtitle">
            Practical guides for living in Singapore — housing, transport, money, food, healthcare, and neighborhood intelligence.
          </p>
          
          {/* CTAs - Premium Button System */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-cta">
            <Link
              href="/guides"
              className="btn btn-primary btn-lg data-magnetic"
              data-magnetic
            >
              Browse All Guides
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/neighborhoods"
              className="btn btn-secondary btn-lg"
            >
              Explore Neighborhoods
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Trust Indicators - Editorial Style */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 items-center text-[var(--color-text-tertiary)] hero-trust" data-animate>
            <div className="flex items-center gap-2">
              <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>120+</span>
              <span className="text-sm">Guides Published</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>8</span>
              <span className="text-sm">Categories</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>28</span>
              <span className="text-sm">Neighborhoods</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>Weekly</span>
              <span className="text-sm">Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
         TODAY'S SINGAPORE — Editorial Feature Layout (Asymmetric)
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="section" data-section>
        <div className="container">
          <div className="section-header-left" data-animate>
            <p className="section-eyebrow">Updated Today</p>
            <h2 className="section-title section-title-lg">
              Today's<br />Singapore
            </h2>
            <div className="section-divider" />
          </div>

          {todaysSingapore.length > 0 ? (
            <div className="grid-magazine" data-animate>
              {/* Featured Article - Large */}
              <Link
                key={todaysSingapore[0].id}
                href={`/guides/${todaysSingapore[0].slug}`}
                className="magazine-feature card-elevated group relative overflow-hidden"
              >
                <div className="card-media h-[400px] md:h-[500px] relative">
                  <Image
                    src={todaysSingapore[0].imageUrl || IMAGE_FALLBACK}
                    alt={todaysSingapore[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="badge badge-blue">
                      <span className="badge-dot" />
                      {todaysSingapore[0].category}
                    </span>
                    {todaysSingapore[0].neighborhood && (
                      <span className="badge badge-green">
                        <span className="badge-dot" />
                        {todaysSingapore[0].neighborhood}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="badge badge-cyan">
                      <span className="badge-dot animate-pulse" />
                      Latest
                    </span>
                  </div>
                </div>
                <div className="card-editorial">
                  <h3 className="card-title text-2xl md:text-3xl">
                    {todaysSingapore[0].title}
                  </h3>
                  {todaysSingapore[0].excerpt && todaysSingapore[0].excerpt.trim() !== "" && (
                    <p className="card-excerpt text-base md:text-lg line-clamp-3">
                      {todaysSingapore[0].excerpt}
                    </p>
                  )}
                  <div className="card-footer">
                    <div className="card-author">
                      {todaysSingapore[0].author?.avatarUrl && (
                        <img src={todaysSingapore[0].author.avatarUrl} className="card-author-avatar" alt={todaysSingapore[0].author.name} />
                      )}
                      <span className="card-author-name">
                        {todaysSingapore[0].author?.name || 'Editorial Team'}
                      </span>
                    </div>
                    <span className="card-action">Read →</span>
                  </div>
                </div>
              </Link>

              {/* Secondary Articles - Grid */}
              <div className="magazine-sidebar grid grid-cols-1 gap-4">
                {todaysSingapore.slice(1, 4).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/guides/${post.slug}`}
                    className="card group overflow-hidden"
                  >
                    <div className="card-media h-48 md:h-56 relative">
                      <Image
                        src={post.imageUrl || IMAGE_FALLBACK}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                        <span className="badge badge-blue">
                          <span className="badge-dot" />
                          {post.category}
                        </span>
                        {post.neighborhood && (
                          <span className="badge badge-green">
                            <span className="badge-dot" />
                            {post.neighborhood}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="card-editorial p-5">
                      <h3 className="card-title text-lg">
                        {post.title}
                      </h3>
                      <div className="card-footer">
                        <span className="card-author-name">
                          {post.author?.name || 'Editorial Team'}
                        </span>
                        <span className="card-action">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Additional Articles - Standard Grid */}
              {todaysSingapore.length > 4 && (
                <div className="magazine-half grid grid-cols-1 md:grid-cols-2 gap-4" style={{ gridColumn: 'span 6 / span 6' }}>
                  {todaysSingapore.slice(4, 8).map((post) => (
                    <Link
                      key={post.id}
                      href={`/guides/${post.slug}`}
                      className="card group overflow-hidden"
                    >
                      <div className="card-media h-48 relative">
                        <Image
                          src={post.imageUrl || IMAGE_FALLBACK}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                          <span className="badge badge-blue">
                            <span className="badge-dot" />
                            {post.category}
                          </span>
                          {post.neighborhood && (
                            <span className="badge badge-green">
                              <span className="badge-dot" />
                              {post.neighborhood}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-editorial p-5">
                        <h3 className="card-title text-lg">
                          {post.title}
                        </h3>
                        <div className="card-footer">
                          <span className="card-author-name">
                            {post.author?.name || 'Editorial Team'}
                          </span>
                          <span className="card-action">Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)]" data-animate>
              <p className="text-[var(--color-text-tertiary)] font-bold uppercase tracking-widest text-xl mb-4">No resident guides yet</p>
              <p className="text-[var(--color-text-muted)] max-w-md mx-auto">Publish your first guide to see it here.</p>
            </div>
          )}

          {/* View All Link */}
          <div className="mt-12 text-center" data-animate>
            <Link
              href="/latest"
              className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
            >
              View All Latest
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
         NEIGHBORHOODS — Research Highlight Style
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
        <div className="container">
          <div className="section-header-left" data-animate>
            <p className="section-eyebrow" style={{ color: 'var(--color-blue-light)' }}>Where You Live</p>
            <h2 className="section-title section-title-lg">Neighborhoods</h2>
            <div className="section-divider" />
            <p className="section-description text-base max-w-none">
              Every neighborhood has its rhythm. Discover transport links, housing trends, food scenes, and local secrets for where you live — or where you're moving next.
            </p>
          </div>

          <div className="grid-editorial-5" data-animate>
            {neighborhoodsWithCounts.map((hood) => (
              <Link
                key={hood.slug}
                href={`/neighborhoods/${hood.slug}`}
                className="card-elevated group p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-${hood.color}-500)` }} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={`${monoClass} font-black uppercase tracking-widest`} style={{ color: `var(--color-${hood.color}-400)`, fontSize: 'var(--text-micro)' }}>
                    {hood.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2">
                  {hood.name}
                </h3>
                <p className={`${monoClass} font-black uppercase tracking-[0.2em] mb-2`} style={{ color: `var(--color-${hood.color}-400)`, fontSize: 'var(--text-micro)' }}>
                  {hood.articleCount} Guides
                </p>
                <span className={`${monoClass} text-[var(--color-text-tertiary)] uppercase tracking-widest inline-flex items-center gap-1`} style={{ fontSize: 'var(--text-micro)' }}>
                  Explore
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center" data-animate>
            <Link
              href="/neighborhoods"
              className="btn btn-secondary btn-md"
            >
              All Neighborhoods
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
         BROWSE BY TOPIC — Magazine Layout (Icon Grid)
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="section" data-section>
        <div className="container">
          <div className="section-header" data-animate>
            <p className="section-eyebrow">What You Need</p>
            <h2 className="section-title">Browse by Topic</h2>
            <div className="section-divider" />
            <p className="section-description">
              Every guide is categorized so you can find exactly what matters to your daily life.
            </p>
          </div>

          <div className="grid-editorial-8" data-animate>
            {topicsWithCounts.map((topic) => (
              <Link
                key={topic.value}
                href={topic.href}
                className="card group p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                  <TopicIcon name={topic.icon} className="w-7 h-7" style={{ color: 'var(--color-blue-light)' }} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2">
                  {topic.label}
                </h3>
                <p className={`${monoClass} font-black uppercase tracking-[0.2em]`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                  {topic.count} Guides
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════
         FEATURED GUIDES — Planning Intelligence (Research Cards)
         ═══════════════════════════════════════════════════════════════════════════════ */}
      {featuredGuides.length > 0 && (
        <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
          <div className="container">
            <div className="section-header-left" data-animate>
              <p className="section-eyebrow" style={{ color: 'var(--color-cyan-light)' }}>Planning Intelligence</p>
              <h2 className="section-title section-title-lg">Featured<br />Guides</h2>
              <div className="section-divider" />
              <p className="section-description text-base max-w-none">
                High-impact guides with insider pricing, optimal timing, and local secrets. Built from extensive research and regular updates.
              </p>
            </div>

            <div className="grid-editorial-4" data-animate>
              {featuredGuides.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="card-elevated group overflow-hidden"
                >
                  <div className="card-media h-64 relative">
                    <Image
                      src={post.imageUrl || IMAGE_FALLBACK}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="badge badge-cyan">
                        <span className="badge-dot" />
                        {post.category}
                      </span>
                      {post.neighborhood && (
                        <span className="badge badge-green">
                          <span className="badge-dot" />
                          {post.neighborhood}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="badge badge-cyan">
                        <span className="badge-dot animate-pulse" />
                        Planning Report
                      </span>
                    </div>
                  </div>
                  <div className="card-editorial">
                    <h3 className="card-title">
                      {post.title}
                    </h3>
                    <p className="card-excerpt line-clamp-2">
                      {post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="card-footer">
                      <span className="card-author-name">
                        {post.author?.name || 'Editorial Team'}
                      </span>
                      <span className="card-action" style={{ color: 'var(--color-cyan-light)' }}>Read Report →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center" data-animate>
              <Link
                href="/guides"
                className="btn btn-secondary btn-md"
              >
                All Guides
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════════════
         TOOLS & CALCULATORS — Tool Highlight Cards
         ════════════════════════════════════════════════════════════════════════════════ */}
      <section className="section" data-section>
        <div className="container">
          <div className="section-header" data-animate>
            <p className="section-eyebrow">Resident Utilities</p>
            <h2 className="section-title">Tools & Calculators</h2>
            <div className="section-divider" />
            <p className="section-description">
              Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices.
            </p>
          </div>

          <div className="grid-editorial-4" data-animate>
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="card group p-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                    <TopicIcon name={tool.icon} className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
                  </div>
                  <div>
                    <span className={`${monoClass} font-black uppercase tracking-widest mb-1 block`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                      {tool.category}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors leading-tight">
                      {tool.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <span className={`${monoClass} font-black uppercase tracking-widest`} style={{ 
                    color: tool.status === 'Live' ? 'var(--color-green-light)' : 'var(--color-text-tertiary)', 
                    fontSize: 'var(--text-micro)' 
                  }}>
                    {tool.status}
                  </span>
                  <span className={`${monoClass} font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                    Open Tool
                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center" data-animate>
            <Link
              href="/tools"
              className="btn btn-secondary btn-md"
            >
              View All Tools
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════════════
         LATEST UPDATES — Timeline Style (News Only)
         ═══════════════════════════════════════════════════════════════════════════════ */}
      {latestUpdates.length > 0 && (
        <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
          <div className="container">
            <div className="section-header-left" data-animate>
              <p className="section-eyebrow" style={{ color: 'var(--color-orange-light)' }}>Breaking & New</p>
              <h2 className="section-title section-title-lg">Latest<br />Updates</h2>
              <div className="section-divider" />
            </div>

            <div className="grid-editorial-3" data-animate>
              {latestUpdates.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="card group flex gap-5 p-5"
                >
                  <div className="w-20 h-20 rounded-[var(--radius-xl)] overflow-hidden flex-shrink-0 bg-[var(--color-gray-800)] relative">
                    <Image
                      src={post.imageUrl || IMAGE_FALLBACK}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`${monoClass} flex items-center gap-2 mb-2`} style={{ fontSize: 'var(--text-micro)' }}>
                      <span className="w-1.5 h-1.5 bg-[var(--color-orange)] rounded-full" />
                      <span style={{ color: 'var(--color-orange-light)' }}>New</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-[var(--color-orange-light)] transition-colors">
                      {post.title}
                    </h3>
                    <p className={`${monoClass} uppercase tracking-widest mt-2`} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-micro)' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center" data-animate>
              <Link
                href="/latest"
                className="btn btn-secondary btn-md"
              >
                All Updates
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
         NEWSLETTER — Premium Subscription Experience
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="section border-t border-[var(--color-border)]" data-section>
        <div className="container">
          <div className="relative glass-strong rounded-[var(--radius-3xl)] p-12 md:p-20 text-center overflow-hidden" data-animate>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)]/5 via-transparent to-[var(--color-purple)]/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-blue)]/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-purple)]/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
            
            <p className={`${monoClass} font-black uppercase tracking-[0.4em] mb-4 relative z-10`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-xs)' }}>
              Stay Informed
            </p>
            <h2 className={`${playfairClass} text-4xl md:text-6xl font-black mb-6 tracking-tighter italic relative z-10`}>
              Get Singapore Intelligence in Your Inbox
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed relative z-10">
              Weekly digest of new guides, policy changes, and neighborhood insights. No spam. Unsubscribe anytime.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-premium flex-1"
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-md whitespace-nowrap"
              >
                Subscribe
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
            <p className={`${monoClass} uppercase tracking-[0.3em] relative z-10 mt-6`} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-micro)' }}>
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
         TRUST BANNER — Editorial Values
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="section border-t border-[var(--color-border)]" data-section>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden" data-animate>
            <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
                <DiamondIcon className="w-8 h-8" style={{ color: 'var(--color-cyan-light)' }} />
              </div>
              <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Research-Driven Guides</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Built from extensive source research and regular updates.</p>
            </div>
            <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
                <HexagonIcon className="w-8 h-8" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Resident-First</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Built for people living in Singapore, not tourists passing through.</p>
            </div>
            <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
                <SparkleIcon className="w-8 h-8" style={{ color: 'var(--color-purple-light)' }} />
              </div>
              <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Partner Rates</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Integrated with Trip.com and Klook for the best booking rates available.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}