// src/app/guias/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Link from "next/link";
import Image from 'next/image';
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  
  if (!post) return { title: 'Guia Não Encontrado | Brazil MEI' };
  
  return {
    title: post.metaTitle || `${post.title} | Brazil MEI`,
    description: post.metaDescription || post.excerpt || 'Guia prático para MEIs no Brasil.',
    openGraph: {
      title: post.metaTitle || `${post.title} | Brazil MEI`,
      description: post.metaDescription || post.excerpt || 'Guia prático para MEIs no Brasil.',
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) notFound();

  const categoryLabels: Record<string, string> = {
    'MEI_DAS': 'DAS MEI',
    'MEI_FATURAMENTO': 'Faturamento',
    'DASN_SIMEI': 'DASN-SIMEI',
    'NOTA_FISCAL': 'Nota Fiscal',
    'MEI_OBRIGACOES': 'Obrigações',
    'MEI_CADASTRO': 'Cadastro MEI',
    'FERRAMENTAS': 'Ferramentas',
    'GUIA_COMPLETO': 'Guia Completo',
  };

  const categoryColors: Record<string, string> = {
    'MEI_DAS': 'blue',
    'MEI_FATURAMENTO': 'green',
    'DASN_SIMEI': 'blue',
    'NOTA_FISCAL': 'purple',
    'MEI_OBRIGACOES': 'orange',
    'MEI_CADASTRO': 'green',
    'FERRAMENTAS': 'cyan',
    'GUIA_COMPLETO': 'purple',
  };

  const categoryColor = categoryColors[post.category] || 'blue';
  const categoryLabel = categoryLabels[post.category] || post.category;

  return (
    <article className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)]`}>
      {/* HERO */}
      <header className="relative border-b border-[var(--color-border)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt=""
              fill
              className="object-cover opacity-15"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)] via-[var(--color-black)]/80 to-[var(--color-black)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32">
          <div className="mb-8">
            <Link
              href="/guias"
              className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-4`}
            >
              ← Voltar aos Guias
            </Link>
            <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-${categoryColor})] text-white rounded-full`}>
              {categoryLabel}
            </span>
          </div>

          <h1 className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 italic`}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl leading-relaxed font-light mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-tertiary)]">
            <div className="flex items-center gap-2">
              {post.author?.avatarUrl && (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-[var(--color-border)]"
                />
              )}
              <span className={`${mono.className} text-[10px] font-medium uppercase tracking-widest`}>
                {post.author?.name || 'Equipe Editorial'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-px h-4 bg-[var(--color-border)]" />
              <time className={`${mono.className} text-[10px] uppercase tracking-widest`}>
                {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </time>
            </div>
            {post.updatedAt !== post.createdAt && (
              <div className="flex items-center gap-2">
                <span className="w-px h-4 bg-[var(--color-border)]" />
                <span className={`${mono.className} text-[10px] uppercase tracking-widest`}>
                  Atualizado em {new Date(post.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
            <h3 className={`${mono.className} text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[var(--color-text-tertiary)]`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-black)] border border-[var(--color-border)] rounded-full text-[var(--color-text-tertiary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AUTHOR BIO */}
        {post.author && (
          <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
            <div className="flex items-start gap-6">
              {post.author.avatarUrl && (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full border border-[var(--color-border)] flex-shrink-0"
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                  {post.author.name}
                </h3>
                {post.author.role && (
                  <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] uppercase tracking-widest mb-3`}>
                    {post.author.role}
                  </p>
                )}
                {post.author.bio && (
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RELATED GUIDES */}
        <section className="mt-16">
          <h2 className={`${playfair.className} text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-8`}>
            Guias Relacionados
          </h2>
          <RelatedGuides category={post.category} currentSlug={slug} />
        </section>
      </main>
    </article>
  );
}

async function RelatedGuides({ category, currentSlug }: { category: string; currentSlug: string }) {
  const related = await prisma.post.findMany({
    where: {
      category: category as any,
      status: 'PUBLISHED',
      slug: { not: currentSlug },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  if (related.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((post) => (
        <Link
          key={post.id}
          href={`/guias/${post.slug}`}
          className="card-elevated group overflow-hidden"
        >
          <div className="card-media h-48 relative">
            <Image
              src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
              <span className="badge badge-blue">
                <span className="badge-dot" />
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="card-title text-lg font-bold mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors leading-tight flex-1">
              {post.title}
            </h3>
            <div className="card-footer flex items-center justify-between">
              <span className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-widest`}>
                {post.author?.name || 'Equipe Editorial'}
              </span>
              <span className={`${mono.className} text-[var(--color-blue-light)] text-[9px] font-black uppercase tracking-widest`}>
                Ler →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const categoryLabels: Record<string, string> = {
  'MEI_DAS': 'DAS MEI',
  'MEI_FATURAMENTO': 'Faturamento',
  'DASN_SIMEI': 'DASN-SIMEI',
  'NOTA_FISCAL': 'Nota Fiscal',
  'MEI_OBRIGACOES': 'Obrigações',
  'MEI_CADASTRO': 'Cadastro MEI',
  'FERRAMENTAS': 'Ferramentas',
  'GUIA_COMPLETO': 'Guia Completo',
};