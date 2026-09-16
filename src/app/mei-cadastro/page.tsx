// src/app/mei-cadastro/page.tsx
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Link from "next/link";
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Como Abrir MEI 2026: Passo a Passo Gratuito no Gov.br | Brazil MEI",
  description: "Guia completo para formalizar seu MEI grátis pelo Portal do Empreendedor: documentos, CNAEs permitidos, tempo de aprovação e primeiros passos depois do CNPJ.",
  openGraph: {
    title: "Como Abrir MEI 2026: Passo a Passo Gratuito | Brazil MEI",
    description: "Como abrir MEI grátis em 2026: passo a passo no Portal do Empreendedor, documentos necessários, CNAEs permitidos, tempo de aprovação.",
  }
};

const topicInfo = {
  value: 'MEI_CADASTRO',
  label: 'Cadastro MEI',
  icon: 'user',
  description: 'Formalização 100% digital e gratuita pelo Portal do Empreendedor (gov.br/empresas-e-negocios). Precisa: CPF, título de eleitor, comprovante de endereço, dados da atividade (CNAE). Sai CNPJ na hora. Após: inscrição estadual/municipal se necessário, alvará, conta bancária PJ.',
  color: 'green',
};

const staticGuides = [
  {
    id: 6,
    slug: 'como-abrir-mei-2026-passo-a-passo',
    title: 'Como abrir MEI em 2026: Passo a passo gratuito no Gov.br',
    excerpt: 'Guia completo para formalizar seu MEI grátis pelo Portal do Empreendedor: documentos, CNAEs permitidos, tempo de aprovação e primeiros passos depois do CNPJ.',
    category: 'MEI_CADASTRO',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-20',
  },
];

const posts = staticGuides.filter(p => p.category === 'MEI_CADASTRO');
const count = posts.length;

export default function MeiCadastroPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className={`${mono.className} text-[var(--color-green-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
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
          <Link href="/guias?category=MEI_CADASTRO" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-green)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="list" className="w-6 h-6" style={{ color: 'var(--color-green-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors mb-1">Passo a Passo</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Portal do Empreendedor (Gov.br)</p>
          </Link>
          <Link href="/guias?category=MEI_CADASTRO" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="file" className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-1">Documentos</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">CPF, título eleitor, endereço</p>
          </Link>
          <Link href="/guias?category=MEI_CADASTRO" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-purple)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="tag" className="w-6 h-6" style={{ color: 'var(--color-purple-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-light)] transition-colors mb-1">CNAEs Permitidos</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Verifique sua atividade</p>
          </Link>
          <Link href="/guias?category=MEI_CADASTRO" className="card group p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-black)] flex items-center justify-center group-hover:bg-[var(--color-orange)]/10 transition-colors border border-[var(--color-border)]">
              <TopicIcon name="arrow-right" className="w-6 h-6" style={{ color: 'var(--color-orange-light)' }} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-light)] transition-colors mb-1">Depois do CNPJ</h3>
            <p className="text-[var(--color-text-tertiary)] text-sm">Inscrições, alvará, conta PJ</p>
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
              Guias sobre Cadastro MEI
            </h2>
            <Link
              href="/guias?category=MEI_CADASTRO"
              className={`${mono.className} text-[var(--color-green-light)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-green)] transition flex items-center gap-1`}
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
                  className="group flex flex-col bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-[var(--radius-3xl)] overflow-hidden hover:border-[var(--color-green)]/50 transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-green)] text-white rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 -mt-10 relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-green-light)] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-sm italic mb-8 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-widest`}>
                          {post.author?.name || 'Equipe Editorial'}
                        </span>
                      </div>
                      <span className={`${mono.className} text-[var(--color-green-light)] text-[10px] font-black uppercase tracking-widest`}>
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
                Estamos preparando guias detalhados sobre cadastro MEI. Volte em breve.
              </p>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-border)] rounded-full font-black uppercase tracking-[0.3em] text-xs text-[var(--color-text-primary)] transition-all hover:border-[var(--color-green)] hover:text-[var(--color-green-light)]"
              >
                Ver Todos os Guias →
              </Link>
            </div>
          )}
        </div>

        {/* QUICK START GUIDE */}
        <section className="mb-12 p-8 bg-[var(--color-black-elevated)] rounded-[var(--radius-3xl)] border border-[var(--color-border)]" data-animate>
          <h3 className={`${playfair.className} text-2xl md:text-3xl font-black uppercase italic mb-6`}>
            Resumo Rápido: Como Abrir MEI em 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Pré-requisitos</h4>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-green)]/20 flex items-center justify-center flex-shrink-0 text-[var(--color-green-light)] text-sm font-black">1</span>
                  <span><strong>Ser maior de 18 anos</strong> (ou 16-18 emancipado)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-green)]/20 flex items-center justify-center flex-shrink-0 text-[var(--color-green-light)] text-sm font-black">2</span>
                  <span><strong>Não ser sócio/admin</strong> de outra empresa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-green)]/20 flex items-center justify-center flex-shrink-0 text-[var(--color-green-light)] text-sm font-black">3</span>
                  <span><strong>Atividade permitida</strong> na lista de CNAEs do MEI</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-green)]/20 flex items-center justify-center flex-shrink-0 text-[var(--color-green-light)] text-sm font-black">4</span>
                  <span><strong>Faturamento</strong> dentro do limite (R$ 81.000/ano)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Documentos Necessários</h4>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 text-[var(--color-blue-light)]">📄</span>
                  <span><strong>CPF</strong> (seu)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 text-[var(--color-blue-light)]">🗳️</span>
                  <span><strong>Título de Eleitor</strong> (número)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 text-[var(--color-blue-light)]">🏠</span>
                  <span><strong>Comprovante de Endereço</strong> (residencial)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 text-[var(--color-blue-light)]">📱</span>
                  <span><strong>Celular e E-mail</strong> para cadastro Gov.br</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 p-6 bg-[var(--color-blue)]/5 rounded-[var(--radius-xl)] border border-[var(--color-blue)]/20">
            <h4 className="text-lg font-bold text-[var(--color-blue-light)] mb-3">⚡ Processo 100% Online e Gratuito</h4>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Acesse <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-blue)] underline hover:text-[var(--color-blue-light)]">gov.br/empresas-e-negocios</a> → "Formalize-se" → Login Gov.br → Preencha dados → Receba CNPJ na hora.
            </p>
            <p className="text-[var(--color-text-tertiary)] text-sm">
              <strong>Cuidado:</strong> Não pague por "abertura de MEI" em sites terceiros. O processo oficial é <strong>gratuito</strong>.
            </p>
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
              <p className="text-[var(--color-text-secondary)] text-sm">Primeiro pagamento após abrir</p>
            </Link>
            <Link href="/nota-fiscal-mei" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-purple)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="receipt" className="w-6 h-6" style={{ color: 'var(--color-purple-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-light)] transition-colors mb-2">Nota Fiscal MEI</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Inscrição estadual/municipal</p>
            </Link>
            <Link href="/mei-obrigacoes" className="card-elevated group p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-orange)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name="checklist" className="w-6 h-6" style={{ color: 'var(--color-orange-light)' }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-orange-light)] transition-colors mb-2">Obrigações Mensais</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">O que fazer todo mês após abrir</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}