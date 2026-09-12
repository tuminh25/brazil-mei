// src/app/nota-fiscal-mei/page.tsx
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Link from "next/link";
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Nota Fiscal MEI 2026: Obrigatoriedade e Emissão Gratuita | Brazil MEI",
  description: "Quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e grátis, diferença entre elas, erros comuns e penalidades por não emitir.",
  openGraph: {
    title: "Nota Fiscal MEI 2026: Obrigatoriedade e Emissão Gratuita | Brazil MEI",
    description: "Quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e grátis, diferença entre elas, erros comuns e penalidades.",
  }
};

const topicInfo = {
  value: 'NOTA_FISCAL',
  label: 'Nota Fiscal MEI',
  icon: 'receipt',
  description: 'MEI deve emitir nota fiscal nas vendas para outras empresas (PJ). NF-e para comércio/indústria (estadual), NFS-e para serviços (municipal). Emissão gratuita nos portais oficiais. Não emitir para consumidor final (PF) é opcional, mas recomendado.',
  color: 'purple',
};

export default async function NotaFiscalMeiPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      category: 'NOTA_FISCAL' as any,
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const count = posts.length;

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className={`${mono.className} text-[var(--color-purple-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Tema Principal
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            {topicInfo.label}
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            {topicInfo.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass">
            <span className="w-1.5 h-1.5 bg-[var(--color-green)] rounded-full animate-pulse" />
            <span className={`${mono.className} text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]`}>
              {count} Guia{count !== 1 ? 's' : ''} Publicado{count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16" data-animate>
          <Link href="/guias?category=NOTA_FISCAL" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-purple)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="help" className="w-6 h-6" style={{ color: 'var(--color-purple-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-light)] transition-colors mb-1">Quando Emitir</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Venda para PJ = obrigatório</p>
          </Link>
          <Link href="/guias?category=NOTA_FISCAL" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="file" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1">NF-e vs NFS-e</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Estadual vs Municipal</p>
          </Link>
          <Link href="/guias?category=NOTA_FISCAL" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-green)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="shield" className="w-6 h-6" style={{ color: 'var(--color-green-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors mb-1">Emissão Gratuita</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Portais oficiais (SEFAZ/Prefeitura)</p>
          </Link>
          <Link href="/guias?category=NOTA_FISCAL" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-red)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="alert" className="w-6 h-6" style={{ color: 'var(--color-red-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-red-light)] transition-colors mb-1">Erros & Multas</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Evite problemas fiscais</p>
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
              Guias sobre Nota Fiscal
            </h2>
            <Link
              href="/guias?category=NOTA_FISCAL"
              className={`${mono.className} text-[var(--color-purple-light)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-purple)] transition flex items-center gap-1`}
            >
              Ver Todos →
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/guias/${post.slug}`}
                  className="group flex flex-col bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden hover:border-[var(--color-purple)]/50 transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-purple)] text-white rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 -mt-10 relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-light)] transition-colors leading-tight">
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
                      <span className={`${mono.className} text-[var(--color-purple-light)] text-[10px] font-black uppercase tracking-widest`}>
                        Ler Guia →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)]">
              <p className="text-[var(--color-text-tertiary)] font-bold uppercase tracking-widest text-xl mb-4">
                Nenhum guia específico ainda
              </p>
              <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-6">
                Estamos preparando guias detalhados sobre Nota Fiscal MEI. Volte em breve.
              </p>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-border)] rounded-full font-black uppercase tracking-[0.3em] text-xs text-[var(--color-text-primary)] transition-all hover:border-[var(--color-purple)] hover:text-[var(--color-purple-light)]"
              >
                Ver Todos os Guias →
              </Link>
            </div>
          )}
        </div>

        <div className="pt-12 border-t border-[var(--color-border)]" data-animate>
          <h3 className={`${mono.className} text-[var(--color-text-tertiary)] text-xs font-black uppercase tracking-[0.4em] mb-8 text-center`}>
            Temas Relacionados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/mei-obrigacoes" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-orange)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="checklist" className="w-6 h-6" style={{ color: 'var(--color-orange-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-light)] transition-colors mb-2">Obrigações Mensais</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Emissão de notas é obrigação</p>
            </Link>
            <Link href="/mei-das" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="calculator" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2">DAS MEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Tributos recolhidos na guia única</p>
            </Link>
            <Link href="/mei-cadastro" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-green)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="user" className="w-6 h-6" style={{ color: 'var(--color-green-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors mb-2">Cadastro MEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">CNAEs e inscrição estadual/municipal</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}