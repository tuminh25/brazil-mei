// src/app/mei-obrigacoes/page.tsx
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Link from "next/link";
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Obrigações Mensais MEI 2026: Checklist Completo | Brazil MEI",
  description: "Checklist completo das obrigações mensais do MEI: pagamento DAS, emissão de notas, controle de faturamento, guarda de documentos e declarações anuais.",
  openGraph: {
    title: "Obrigações Mensais MEI 2026: Checklist Completo | Brazil MEI",
    description: "Checklist completo das obrigações mensais do MEI: pagamento DAS, emissão de notas, controle de faturamento, guarda de documentos.",
  }
};

const topicInfo = {
  value: 'MEI_OBRIGACOES',
  label: 'Obrigações MEI',
  icon: 'checklist',
  description: 'Todo mês o MEI deve: pagar DAS até dia 20, emitir notas fiscais (quando vender para PJ), controlar faturamento (não passar de R$ 6.750/mês média), guardar documentos por 5 anos. Anualmente: DASN-SIMEI até 31/05.',
  color: 'orange',
};

export default async function MeiObrigacoesPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      category: 'MEI_OBRIGACOES' as any,
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  const count = posts.length;

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className={`${mono.className} text-[var(--color-orange-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
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
          <Link href="/ferramentas/checklist-obrigacoes" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-green)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="checklist" className="w-6 h-6" style={{ color: 'var(--color-green-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors mb-1">Checklist Mensal</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Marque tarefas concluídas</p>
          </Link>
          <Link href="/mei-das" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="calculator" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1">Pagar DAS</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Até dia 20 todo mês</p>
          </Link>
          <Link href="/nota-fiscal-mei" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-purple)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="receipt" className="w-6 h-6" style={{ color: 'var(--color-purple-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-light)] transition-colors mb-1">Emitir Notas</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Quando vender para PJ</p>
          </Link>
          <Link href="#contratacao" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="user" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1">Contratar Funcionário</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">1 funcionário, eSocial, encargos</p>
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
              Guias sobre Obrigações
            </h2>
            <Link
              href="/guias?category=MEI_OBRIGACOES"
              className={`${mono.className} text-[var(--color-orange-light)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-orange)] transition flex items-center gap-1`}
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
                  className="group flex flex-col bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden hover:border-[var(--color-orange)]/50 transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-orange)] text-white rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 -mt-10 relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-light)] transition-colors leading-tight">
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
                      <span className={`${mono.className} text-[var(--color-orange-light)] text-[10px] font-black uppercase tracking-widest`}>
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
                Estamos preparando guias detalhados sobre obrigações MEI. Volte em breve.
              </p>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-border)] rounded-full font-black uppercase tracking-[0.3em] text-xs text-[var(--color-text-primary)] transition-all hover:border-[var(--color-orange)] hover:text-[var(--color-orange-light)]"
              >
                Ver Todos os Guias →
              </Link>
            </div>
          )}
        </div>

        {/* CONTRATAÇÃO SECTION */}
        <section id="contratacao" className="mb-12 p-8 bg-[var(--color-black-elevated)] rounded-[var(--radius-3xl)] border border-[var(--color-border)]" data-animate>
          <h3 className={`${playfair.className} text-2xl md:text-3xl font-black uppercase italic mb-6`}>
            Contratação de Funcionário pelo MEI
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Regras Básicas</h4>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 text-[var(--color-green-light)]">✓</span>
                  <span>MEI pode contratar <strong>1 (um) funcionário</strong> com carteira assinada</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 text-[var(--color-green-light)]">✓</span>
                  <span>Salário: <strong>1 salário-mínimo</strong> ou piso da categoria</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 text-[var(--color-green-light)]">✓</span>
                  <span>Registro no <strong>eSocial</strong> obrigatório</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 text-[var(--color-green-light)]">✓</span>
                  <span>Não pode contratar menor aprendiz ou estagiário</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Custos Mensais (estimativa 2026)</h4>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex justify-between">
                  <span>Salário-mínimo (base)</span>
                  <span className="font-bold">~R$ 1.518</span>
                </li>
                <li className="flex justify-between">
                  <span>INSS Patronal (8%)</span>
                  <span className="font-bold">~R$ 121</span>
                </li>
                <li className="flex justify-between">
                  <span>FGTS (8%)</span>
                  <span className="font-bold">~R$ 121</span>
                </li>
                <li className="flex justify-between border-t border-[var(--color-border)] pt-3">
                  <span className="font-bold">Total aproximado/mês</span>
                  <span className="font-bold text-[var(--color-green-light)]">~R$ 1.760</span>
                </li>
                <li className="text-[var(--color-text-tertiary)] text-sm italic">
                  + férias (1/3), 13º salário, seguro acidente (RAT), exames admissionais
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/ferramentas/simulador-contratacao" className="btn btn-secondary btn-md">
              Simulador de Contratação (Em breve)
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="pt-12 border-t border-[var(--color-border)]" data-animate>
          <h3 className={`${mono.className} text-[var(--color-text-tertiary)] text-xs font-black uppercase tracking-[0.4em] mb-8 text-center`}>
            Temas Relacionados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/mei-das" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="calculator" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2">DAS MEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Pagamento mensal obrigatório</p>
            </Link>
            <Link href="/mei-faturamento" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-green)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="chart" className="w-6 h-6" style={{ color: 'var(--color-green-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors mb-2">Faturamento MEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Controle mensal obrigatório</p>
            </Link>
            <Link href="/dasn-simei" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="file" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2">DASN-SIMEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Declaração anual até 31/05</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}