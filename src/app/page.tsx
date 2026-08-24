import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import HomePageClient from './HomePageClient';
import Link from "next/link";
import { ArrowRightIcon } from '@/components/ui/Icons';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { getVersionedImageUrl } from '@/lib/image-utils';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const dynamic = 'force-static';
export const revalidate = 3600;

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1525625239513-39bc131f9979?q=80&w=1600&auto=format&fit=crop";

const topicCategories = [
  { value: 'HOUSING', label: 'Housing', icon: 'housing', href: '/guides?category=HOUSING' },
  { value: 'TRANSPORT', label: 'Transport', icon: 'transport', href: '/guides?category=TRANSPORT' },
  { value: 'MONEY', label: 'Money', icon: 'money', href: '/guides?category=MONEY' },
  { value: 'FOOD', label: 'Food', icon: 'food', href: '/guides?category=FOOD' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: 'healthcare', href: '/guides?category=HEALTHCARE' },
  { value: 'STUDY', label: 'Study', icon: 'study', href: '/guides?category=STUDY' },
  { value: 'LIFESTYLE', label: 'Lifestyle', icon: 'lifestyle', href: '/guides?category=LIFESTYLE' },
  { value: 'WORK', label: 'Work', icon: 'work', href: '/guides?category=WORK' },
];

const neighborhoodData = [
  { slug: 'woodlands', name: 'Woodlands', tag: 'North', color: 'blue' },
  { slug: 'tengah', name: 'Tengah', tag: 'West', color: 'green' },
  { slug: 'jurong', name: 'Jurong', tag: 'West', color: 'orange' },
  { slug: 'punggol', name: 'Punggol', tag: 'North-East', color: 'cyan' },
  { slug: 'tampines', name: 'Tampines', tag: 'East', color: 'purple' },
];

const tools = [
  { name: 'HDB Affordability Calculator', category: 'Housing', icon: 'calculator', status: 'Coming Soon' },
  { name: 'CPF Retirement Planner', category: 'Money', icon: 'planner', status: 'Coming Soon' },
  { name: 'Transport Cost Calculator', category: 'Transport', icon: 'transportCost', status: 'Coming Soon' },
  { name: 'School Distance Checker', category: 'Study', icon: 'school', status: 'Coming Soon' },
  { name: 'Hawker Price Tracker', category: 'Food', icon: 'hawker', status: 'Coming Soon' },
  { name: 'Clinic & Hospital Finder', category: 'Healthcare', icon: 'clinic', status: 'Coming Soon' },
  { name: 'Salary Benchmark Tool', category: 'Work', icon: 'salary', status: 'Coming Soon' },
  { name: 'Neighborhood Comparison', category: 'Neighborhood', icon: 'map', status: 'Coming Soon' },
];

function HeroSection({ playfairClass, monoClass, interClass }: { playfairClass: string; monoClass: string; interClass: string }) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2400"
          alt="Singapore Marina Bay Skyline at Dusk"
          className="hero-image object-cover opacity-20 scale-100 w-full h-full"
        />
      </div>
      <div className="absolute inset-0 -z-10 gradient-mesh" />
      <div className="absolute inset-0 -z-10 noise-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)]/80 via-[var(--color-black)]/90 to-[var(--color-black)] -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--color-black)]/60 to-transparent -z-10" />

      {/* Floating Particles Container - initialized by client component */}
      <div className="absolute inset-0 -z-5 particles-container" />

      <div className="hero-content relative z-10 max-w-7xl mx-auto px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
          <span className="w-1.5 h-1.5 bg-[var(--color-green)] rounded-full animate-pulse" />
          <span className={`${monoClass} text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]`}>
            Live Intelligence Platform
          </span>
        </div>

        <p className={`${monoClass} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-6 font-black`}>
          Singapore Resident Intelligence
        </p>

        <h1 className={`${playfairClass} hero-headline text-6xl md:text-[9.5rem] lg:text-[11rem] font-black leading-[0.82] tracking-tighter uppercase text-[var(--color-text-primary)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-8 text-balance`}>
          Singapore{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-blue)] to-[var(--color-purple)]">
            Unlocked
          </span>
        </h1>

        <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Practical guides for living in Singapore — housing, transport, money, food, healthcare, and neighborhood intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/guides"
            className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
          >
            Browse All Guides
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
          <Link
            href="/neighborhoods"
            className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
          >
            Explore Neighborhoods
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 items-center text-[var(--color-text-tertiary)]">
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
  );
}

function TodaysSingaporeSection({ todaysSingapore, monoClass, playfairClass, interClass, IMAGE_FALLBACK }: { todaysSingapore: any[]; monoClass: string; playfairClass: string; interClass: string; IMAGE_FALLBACK: string }) {
  if (todaysSingapore.length === 0) {
    return (
      <section className="section" data-section>
        <div className="container">
          <div className="section-header-left">
            <p className="section-eyebrow">Updated Today</p>
            <h2 className="section-title section-title-lg">
              Today's<br />Singapore
            </h2>
            <div className="section-divider" />
          </div>
          <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)]">
            <p className="text-[var(--color-text-tertiary)] font-bold uppercase tracking-widest text-xl mb-4">No resident guides yet</p>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto">Publish your first guide to see it here.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow">Updated Today</p>
          <h2 className="section-title section-title-lg">
            Today's<br />Singapore
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid-magazine">
          <Link
            href={`/guides/${todaysSingapore[0].slug}`}
            className="magazine-feature card-elevated group relative overflow-hidden"
          >
            <div className="card-media h-[400px] md:h-[500px] relative">
              <img
                src={getVersionedImageUrl(todaysSingapore[0].imageUrl, todaysSingapore[0].updatedAt) || IMAGE_FALLBACK}
                alt={todaysSingapore[0].title}
                className="absolute inset-0 object-cover"
                sizes="(max-width: 1280px) 100vw, 66vw"
                loading="eager"
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

          <div className="magazine-sidebar grid grid-cols-1 gap-4">
            {todaysSingapore.slice(1, 4).map((post, i) => (
              <Link
                key={post.id}
                href={`/guides/${post.slug}`}
                className="card group overflow-hidden"
              >
                <div className="card-media h-48 md:h-56 relative">
                  <img
                    src={getVersionedImageUrl(post.imageUrl, post.updatedAt) || IMAGE_FALLBACK}
                    alt={post.title}
                    className="absolute inset-0 object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                    loading="lazy"
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

          {todaysSingapore.length > 4 && (
            <div className="magazine-half grid grid-cols-1 md:grid-cols-2 gap-4" style={{ gridColumn: 'span 6 / span 6' }}>
              {todaysSingapore.slice(4, 8).map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="card group overflow-hidden"
                >
                  <div className="card-media h-48 relative">
                    <img
                      src={getVersionedImageUrl(post.imageUrl, post.updatedAt) || IMAGE_FALLBACK}
                      alt={post.title}
                      className="absolute inset-0 object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
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

        <div className="mt-12 text-center">
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
  );
}

function NeighborhoodsSection({ neighborhoodsWithCounts, monoClass, playfairClass, interClass }: { neighborhoodsWithCounts: any[]; monoClass: string; playfairClass: string; interClass: string }) {
  return (
    <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow" style={{ color: 'var(--color-blue-light)' }}>Where You Live</p>
          <h2 className="section-title section-title-lg">Neighborhoods</h2>
          <div className="section-divider" />
          <p className="section-description text-base max-w-none">
            Every neighborhood has its rhythm. Discover transport links, housing trends, food scenes, and local secrets for where you live — or where you're moving next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoodsWithCounts.map((hood) => (
            <Link
              key={hood.slug}
              href={`/neighborhoods/${hood.slug}`}
              className="card-elevated group p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-${hood.color}-500)` }} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${monoClass} font-black uppercase tracking-widest`} style={{ color: `var(--color-${hood.color}-400)`, fontSize: 'var(--text-micro)' }}>
                      {hood.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1 leading-tight">
                    {hood.name}
                  </h3>
                  <p className={`${monoClass} font-black uppercase tracking-[0.2em] mb-2`} style={{ color: `var(--color-${hood.color}-400)`, fontSize: 'var(--text-micro)' }}>
                    {hood.articleCount} Guides
                  </p>
                  <span className={`${monoClass} text-[var(--color-text-tertiary)] uppercase tracking-widest inline-flex items-center gap-1`} style={{ fontSize: 'var(--text-micro)' }}>
                    Explore
                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
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
  );
}

function TopicsSection({ topicsWithCounts, monoClass, playfairClass, interClass }: { topicsWithCounts: any[]; monoClass: string; playfairClass: string; interClass: string }) {
  return (
    <section className="section" data-section>
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">What You Need</p>
          <h2 className="section-title">Browse by Topic</h2>
          <div className="section-divider" />
          <p className="section-description">
            Every guide is categorized so you can find exactly what matters to your daily life.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {topicsWithCounts.map((topic) => (
            <Link
              key={topic.value}
              href={topic.href}
              className="card group p-5 text-center h-full"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name={topic.icon} className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1 leading-tight">
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
  );
}

function FeaturedGuidesSection({ featuredGuides, monoClass, playfairClass, interClass, IMAGE_FALLBACK }: { featuredGuides: any[]; monoClass: string; playfairClass: string; interClass: string; IMAGE_FALLBACK: string }) {
  if (featuredGuides.length === 0) return null;

  return (
    <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow" style={{ color: 'var(--color-cyan-light)' }}>Planning Intelligence</p>
          <h2 className="section-title section-title-lg">Featured<br />Guides</h2>
          <div className="section-divider" />
          <p className="section-description text-base max-w-none">
            High-impact guides with insider pricing, optimal timing, and local secrets. Built from extensive research and regular updates.
          </p>
        </div>

        <div className="grid-editorial-4">
          {featuredGuides.map((post) => (
            <Link
              key={post.id}
              href={`/guides/${post.slug}`}
              className="card-elevated group overflow-hidden"
            >
              <div className="card-media h-64 relative">
                <img
                  src={getVersionedImageUrl(post.imageUrl, post.updatedAt) || IMAGE_FALLBACK}
                  alt={post.title}
                  className="absolute inset-0 object-cover"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                  loading="lazy"
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

        <div className="mt-12 text-center">
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
  );
}

function ToolsSection({ tools, monoClass, playfairClass, interClass }: { tools: any[]; monoClass: string; playfairClass: string; interClass: string }) {
  return (
    <section className="section" data-section>
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Resident Utilities</p>
          <h2 className="section-title">Tools & Calculators</h2>
          <div className="section-divider" />
          <p className="section-description">
            Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices.
          </p>
        </div>

        <div className="grid-editorial-4">
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
                  color: 'var(--color-green-light)', 
                  fontSize: 'var(--text-micro)' 
                }}>
                  Available
                </span>
                <span className={`${monoClass} font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                  Open Tool
                  <ArrowRightIcon className="w-3 h-3 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
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
  );
}

function LatestUpdatesSection({ latestUpdates, monoClass, playfairClass, interClass, IMAGE_FALLBACK }: { latestUpdates: any[]; monoClass: string; playfairClass: string; interClass: string; IMAGE_FALLBACK: string }) {
  if (latestUpdates.length === 0) return null;

  return (
    <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow" style={{ color: 'var(--color-orange-light)' }}>Breaking & New</p>
          <h2 className="section-title section-title-lg">Latest<br />Updates</h2>
          <div className="section-divider" />
        </div>

        <div className="grid-editorial-3">
          {latestUpdates.map((post) => (
            <Link
              key={post.id}
              href={`/guides/${post.slug}`}
              className="card group flex gap-5 p-5"
            >
              <div className="w-20 h-20 rounded-[var(--radius-xl)] overflow-hidden flex-shrink-0 bg-[var(--color-gray-800)] relative">
                <img
                  src={getVersionedImageUrl(post.imageUrl, post.updatedAt) || IMAGE_FALLBACK}
                  alt=""
                  className="absolute inset-0 object-cover"
                  sizes="80px"
                  loading="lazy"
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

        <div className="mt-12 text-center">
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
  );
}

function NewsletterSection({ playfairClass, monoClass, interClass }: { playfairClass: string; monoClass: string; interClass: string }) {
  return (
    <section className="section border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="relative glass-strong rounded-[var(--radius-3xl)] p-12 md:p-20 text-center overflow-hidden">
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
  );
}

function TrustBannerSection({ playfairClass, monoClass, interClass }: { playfairClass: string; monoClass: string; interClass: string }) {
  return (
    <section className="section border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden">
          <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
              <svg className="w-8 h-8" style={{ color: 'var(--color-cyan-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Research-Driven Guides</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Built from extensive source research and regular updates.</p>
          </div>
          <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
              <svg className="w-8 h-8" style={{ color: 'var(--color-blue-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Resident-First</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Built for people living in Singapore, not tourists passing through.</p>
          </div>
          <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
              <svg className="w-8 h-8" style={{ color: 'var(--color-purple-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Partner Rates</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Integrated with Trip.com and Klook for the best booking rates available.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  // 1. TODAY'S SINGAPORE: 8 newest resident articles (non-travel, non-newsjack)
  let todaysSingapore: any[] = [];
  try {
    todaysSingapore = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' as any },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (todaysSingapore):", error);
  }

  // 2. NEIGHBORHOODS: with article counts
  let neighborhoodsWithCounts: any[] = [];
  try {
    neighborhoodsWithCounts = await Promise.all(
      neighborhoodData.map(async (n) => {
        const count = await prisma.post.count({
          where: { neighborhood: n.name, status: 'PUBLISHED' },
        });
        return { ...n, articleCount: count };
      })
    );
  } catch (error) {
    console.error("HomePage DB Error (neighborhoods):", error);
    neighborhoodsWithCounts = neighborhoodData.map(n => ({ ...n, articleCount: 0 }));
  }

  // 3. TOPIC CATEGORIES: with article counts
  let topicsWithCounts: any[] = [];
  try {
    const categoryCounts = await prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED', category: { not: 'TRAVEL_GUIDE' as any } },
      _count: { category: true },
    });
    const countsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: countsMap.get(t.value as any) || 0 }));
  } catch (error) {
    console.error("HomePage DB Error (topics):", error);
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: 0 }));
  }

  // 4. FEATURED GUIDES: High-quality evergreen (non-newsjack, non-travel, with insider data)
  let featuredGuides: any[] = [];
  try {
    featuredGuides = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' },
        OR: [
          { insiderPrice: { not: null } },
          { bestTime: { not: null } },
          { secretTip: { not: null } },
        ],
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (featured):", error);
  }

  // 5. LATEST UPDATES: Newsjacked or travel guides only (3 items)
  let latestUpdates: any[] = [];
  try {
    latestUpdates = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { isNewsjack: true },
          { category: 'TRAVEL_GUIDE' },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (latestUpdates):", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] selection:bg-[var(--color-blue)]/30 overflow-x-hidden`}>
      <HeroSection playfairClass={playfair.className} monoClass={mono.className} interClass={inter.className} />
      <TodaysSingaporeSection 
        todaysSingapore={todaysSingapore} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
        IMAGE_FALLBACK={IMAGE_FALLBACK} 
      />
      <NeighborhoodsSection 
        neighborhoodsWithCounts={neighborhoodsWithCounts} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
      />
      <TopicsSection 
        topicsWithCounts={topicsWithCounts} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
      />
      <FeaturedGuidesSection 
        featuredGuides={featuredGuides} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
        IMAGE_FALLBACK={IMAGE_FALLBACK} 
      />
      <ToolsSection 
        tools={tools} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
      />
      <LatestUpdatesSection 
        latestUpdates={latestUpdates} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
        IMAGE_FALLBACK={IMAGE_FALLBACK} 
      />
      <NewsletterSection 
        playfairClass={playfair.className} 
        monoClass={mono.className} 
        interClass={inter.className} 
      />
      <TrustBannerSection 
        playfairClass={playfair.className} 
        monoClass={mono.className} 
        interClass={inter.className} 
      />
      <HomePageClient />
    </main>
  );
}