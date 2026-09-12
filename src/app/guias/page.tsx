// src/app/guias/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

const categories = [
  { value: 'MEI_DAS', label: 'DAS MEI', icon: 'calculator' },
  { value: 'MEI_FATURAMENTO', label: 'Faturamento', icon: 'chart' },
  { value: 'DASN_SIMEI', label: 'DASN-SIMEI', icon: 'file' },
  { value: 'NOTA_FISCAL', label: 'Nota Fiscal', icon: 'receipt' },
  { value: 'MEI_OBRIGACOES', label: 'Obrigações', icon: 'checklist' },
  { value: 'MEI_CADASTRO', label: 'Cadastro MEI', icon: 'user' },
  { value: 'FERRAMENTAS', label: 'Ferramentas', icon: 'tools' },
  { value: 'GUIA_COMPLETO', label: 'Guia Completo', icon: 'book' },
];

export const metadata: Metadata = {
  title: "Guias MEI | Brazil MEI",
  description: "Guias práticos para MEIs no Brasil — DAS, faturamento, DASN-SIMEI, nota fiscal, obrigações, cadastro e ferramentas.",
  openGraph: {
    title: "Guias MEI | Brazil MEI",
    description: "Guias práticos para MEIs no Brasil — DAS, faturamento, DASN-SIMEI, nota fiscal, obrigações, cadastro e ferramentas.",
  }
};

interface GuidesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { category } = await searchParams;
  
  const whereClause: any = { status: 'PUBLISHED' };
  if (category && categories.some(c => c.value === category)) {
    whereClause.category = category as any;
  }

  const [posts, categoryCounts] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true },
    }),
  ]);

  const selectedCategory = categories.find(c => c.value === category);
  const categoryCountsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-16">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Inteligência MEI
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Guias MEI
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            Guias práticos para Microempreendedores Individuais no Brasil — DAS, faturamento, DASN-SIMEI, nota fiscal, obrigações mensais, cadastro e ferramentas de cálculo.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-4">
            <Link
              href="/guias"
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                !category
                  ? 'bg-[var(--color-blue)] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                  : 'bg-[var(--color-white)]/5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-white)]/10 hover:text-[var(--color-text-primary)]'
              }`}
            >
              Todas as Categorias
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/guias?category=${cat.value}`}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  category === cat.value
                    ? 'bg-[var(--color-blue)] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                    : 'bg-[var(--color-white)]/5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-white)]/10 hover:text-[var(--color-text-primary)]'
                }`}
              >
                <TopicIcon name={cat.icon} className="w-4 h-4" />
                <span>{cat.label}</span>
                {categoryCountsMap.get(cat.value as any) && (
                  <span className="bg-[var(--color-white)]/10 px-2 py-0.5 rounded-full text-[10px]">
                    {categoryCountsMap.get(cat.value as any)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-[0.3em] mb-2`}>
              {posts.length} Guia{posts.length !== 1 ? 's' : ''} Encontrado{posts.length !== 1 ? 's' : ''}
            </p>
            {selectedCategory && (
              <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
                {selectedCategory.label}
              </h2>
            )}
          </div>
          {category && (
            <Link
              href="/guias"
              className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue)] transition flex items-center gap-1`}
            >
              Limpar Filtro →
            </Link>
          )}
        </div>

        {/* GUIDES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/guias/${post.slug}`}
              className="group flex flex-col bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden hover:border-[var(--color-blue)]/50 transition-all duration-500 shadow-2xl"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-blue)] text-white rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 -mt-10 relative z-10 flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm italic mb-8 line-clamp-3 flex-1">
                  {post.excerpt || post.content.slice(0, 200).replace(/<[^>]*>/g, '')}
                </p>
                <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.author?.avatarUrl && (
                      <img
                        src={post.author.avatarUrl}
                        className="w-7 h-7 rounded-full border border-[var(--color-border)]"
                        alt={post.author.name}
                      />
                    )}
                    <span className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-widest`}>
                      {post.author?.name || 'Equipe Editorial'}
                    </span>
                  </div>
                  <span className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-widest`}>
                    Ler Guia →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-40 border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)]">
            <p className="text-[var(--color-text-tertiary)] font-bold uppercase tracking-widest text-xl mb-4">
              Nenhum guia encontrado
            </p>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
              {category 
                ? `Nenhum guia em "${selectedCategory?.label}" ainda. Volte em breve!` 
                : 'Nenhum guia corresponde aos seus filtros. Tente ajustar sua seleção.'}
            </p>
            <Link
              href="/guias"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-border)] rounded-full font-black uppercase tracking-[0.3em] text-xs text-[var(--color-text-primary)] transition-all hover:border-[var(--color-blue)] hover:text-[var(--color-blue-light)]"
            >
              Ver Todos os Guias →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}