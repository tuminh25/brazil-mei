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

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop";

const topicCategories = [
  { value: 'MEI_DAS', label: 'DAS MEI', icon: 'calculator', href: '/mei-das' },
  { value: 'MEI_FATURAMENTO', label: 'Faturamento', icon: 'chart', href: '/mei-faturamento' },
  { value: 'DASN_SIMEI', label: 'DASN-SIMEI', icon: 'file', href: '/dasn-simei' },
  { value: 'NOTA_FISCAL', label: 'Nota Fiscal', icon: 'receipt', href: '/nota-fiscal-mei' },
  { value: 'MEI_OBRIGACOES', label: 'Obrigações', icon: 'checklist', href: '/mei-obrigacoes' },
  { value: 'MEI_CADASTRO', label: 'Cadastro MEI', icon: 'user', href: '/mei-cadastro' },
  { value: 'FERRAMENTAS', label: 'Ferramentas', icon: 'tools', href: '/ferramentas' },
  { value: 'GUIA_COMPLETO', label: 'Guia Completo', icon: 'book', href: '/guias' },
];

const tools = [
  { name: 'Calculadora DAS MEI', category: 'Tributos', icon: 'calculator', status: 'Disponível', href: '/ferramentas/calculadora-das' },
  { name: 'Verificador de Faturamento', category: 'Controle', icon: 'chart', status: 'Em breve', href: '/ferramentas/verificador-faturamento' },
  { name: 'Checklist Obrigações Mensais', category: 'Compliance', icon: 'checklist', status: 'Em breve', href: '/ferramentas/checklist-obrigacoes' },
  { name: 'Simulador de Contratação', category: 'RH', icon: 'user', status: 'Em breve', href: '/ferramentas/simulador-contratacao' },
];

function HeroSection({ playfairClass, monoClass, interClass }: { playfairClass: string; monoClass: string; interClass: string }) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2400"
          alt="Empreendedor brasileiro trabalhando"
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
            Plataforma de Inteligência MEI
          </span>
        </div>

        <p className={`${monoClass} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-6 font-black`}>
          Brasil • Microempreendedor Individual
        </p>

        <h1 className={`${playfairClass} hero-headline text-6xl md:text-[9.5rem] lg:text-[11rem] font-black leading-[0.82] tracking-tighter uppercase text-[var(--color-text-primary)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-8 text-balance`}>
          MEI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-green)] via-[var(--color-blue)] to-[var(--color-purple)]">
            Descomplicado
          </span>
        </h1>

        <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Guias práticos para MEIs no Brasil — DAS, faturamento, DASN-SIMEI, nota fiscal, obrigações mensais, contratação e ferramentas de cálculo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/guias"
            className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
          >
            Ver Todos os Guias
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
          <Link
            href="/ferramentas"
            className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
          >
            Acessar Ferramentas
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 items-center text-[var(--color-text-tertiary)]">
          <div className="flex items-center gap-2">
            <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>8+</span>
            <span className="text-sm">Temas Principais</span>
          </div>
          <div className="w-px h-6 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>2026</span>
            <span className="text-sm">Atualizado</span>
          </div>
          <div className="w-px h-6 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>Oficial</span>
            <span className="text-sm">Fontes Gov.br</span>
          </div>
          <div className="w-px h-6 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span className={`${monoClass} text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]`}>Gratuito</span>
            <span className="text-sm">Acesso Livre</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestGuidesSection({ latestGuides, monoClass, playfairClass, interClass, IMAGE_FALLBACK }: { latestGuides: any[]; monoClass: string; playfairClass: string; interClass: string; IMAGE_FALLBACK: string }) {
  if (latestGuides.length === 0) {
    return (
      <section className="section" data-section>
        <div className="container">
          <div className="section-header-left">
            <p className="section-eyebrow">Publicados Recentemente</p>
            <h2 className="section-title section-title-lg">
              Últimos<br />Guias
            </h2>
            <div className="section-divider" />
          </div>
          <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)]">
            <p className="text-[var(--color-text-tertiary)] font-bold uppercase tracking-widest text-xl mb-4">Nenhum guia publicado ainda</p>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto">Execute o seed para popular o banco com guias iniciais.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow">Publicados Recentemente</p>
          <h2 className="section-title section-title-lg">
            Últimos<br />Guias
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid-magazine">
          <Link
            href={`/guias/${latestGuides[0].slug}`}
            className="magazine-feature card-elevated group relative overflow-hidden"
          >
            <div className="card-media h-[400px] md:h-[500px] relative">
              <img
                src={getVersionedImageUrl(latestGuides[0].imageUrl, latestGuides[0].updatedAt) || IMAGE_FALLBACK}
                alt={latestGuides[0].title}
                className="absolute inset-0 object-cover"
                sizes="(max-width: 1280px) 100vw, 66vw"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
              <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                <span className="badge badge-blue">
                  <span className="badge-dot" />
                  {latestGuides[0].category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="badge badge-cyan">
                  <span className="badge-dot animate-pulse" />
                  Novo
                </span>
              </div>
            </div>
            <div className="card-editorial">
              <h3 className="card-title text-2xl md:text-3xl">
                {latestGuides[0].title}
              </h3>
              {latestGuides[0].excerpt && latestGuides[0].excerpt.trim() !== "" && (
                <p className="card-excerpt text-base md:text-lg line-clamp-3">
                  {latestGuides[0].excerpt}
                </p>
              )}
              <div className="card-footer">
                <div className="card-author">
                  {latestGuides[0].author?.avatarUrl && (
                    <img src={latestGuides[0].author.avatarUrl} className="card-author-avatar" alt={latestGuides[0].author.name} />
                  )}
                  <span className="card-author-name">
                    {latestGuides[0].author?.name || 'Equipe Editorial'}
                  </span>
                </div>
                <span className="card-action">Ler →</span>
              </div>
            </div>
          </Link>

          <div className="magazine-sidebar grid grid-cols-1 gap-4">
            {latestGuides.slice(1, 4).map((post, i) => (
              <Link
                key={post.id}
                href={`/guias/${post.slug}`}
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
                  </div>
                </div>
                <div className="card-editorial p-5">
                  <h3 className="card-title text-lg">
                    {post.title}
                  </h3>
                  <div className="card-footer">
                    <span className="card-author-name">
                      {post.author?.name || 'Equipe Editorial'}
                    </span>
                    <span className="card-action">Ler →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {latestGuides.length > 4 && (
            <div className="magazine-half grid grid-cols-1 md:grid-cols-2 gap-4" style={{ gridColumn: 'span 6 / span 6' }}>
              {latestGuides.slice(4, 8).map((post) => (
                <Link
                  key={post.id}
                  href={`/guias/${post.slug}`}
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
                    </div>
                  </div>
                  <div className="card-editorial p-5">
                    <h3 className="card-title text-lg">
                      {post.title}
                    </h3>
                    <div className="card-footer">
                      <span className="card-author-name">
                        {post.author?.name || 'Equipe Editorial'}
                      </span>
                      <span className="card-action">Ler →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/guias"
            className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors border-b border-[var(--color-gray-800)] pb-1 inline-flex items-center gap-2"
          >
            Ver Todos os Guias
            <ArrowRightIcon className="w-3 h-3" />
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
          <p className="section-eyebrow">O Que Você Precisa</p>
          <h2 className="section-title">Navegar por Tema</h2>
          <div className="section-divider" />
          <p className="section-description">
            Cada guia é categorizado para você encontrar exatamente o que importa para sua rotina como MEI.
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
                {topic.count} Guias
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
          <p className="section-eyebrow" style={{ color: 'var(--color-green-light)' }}>Guias Essenciais</p>
          <h2 className="section-title section-title-lg">Guias<br />Em Destaque</h2>
          <div className="section-divider" />
          <p className="section-description text-base max-w-none">
            Guias de alto impacto com informações oficiais, prazos 2026 e checklists práticos. Baseados em pesquisa extensa e atualizações regulares.
          </p>
        </div>

        <div className="grid-editorial-4">
          {featuredGuides.map((post) => (
            <Link
              key={post.id}
              href={`/guias/${post.slug}`}
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
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="badge badge-green">
                    <span className="badge-dot animate-pulse" />
                    Essencial
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
                    {post.author?.name || 'Equipe Editorial'}
                  </span>
                  <span className="card-action" style={{ color: 'var(--color-green-light)' }}>Ler Guia →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/guias"
            className="btn btn-secondary btn-md"
          >
            Todos os Guias
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
          <p className="section-eyebrow">Utilitários MEI</p>
          <h2 className="section-title">Ferramentas & Calculadoras</h2>
          <div className="section-divider" />
          <p className="section-description">
            Calculadoras práticas para as decisões que importam — DAS mensal, controle de faturamento, checklist de obrigações, simulação de contratação.
          </p>
        </div>

        <div className="grid-editorial-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
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
                  color: tool.status === 'Disponível' ? 'var(--color-green-light)' : 'var(--color-text-tertiary)', 
                  fontSize: 'var(--text-micro)' 
                }}>
                  {tool.status}
                </span>
                <span className={`${monoClass} font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                  Abrir Ferramenta
                  <ArrowRightIcon className="w-3 h-3 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ferramentas"
            className="btn btn-secondary btn-md"
          >
            Ver Todas as Ferramentas
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function KeyTopicsSection({ monoClass, playfairClass, interClass }: { monoClass: string; playfairClass: string; interClass: string }) {
  const keyTopics = [
    { title: 'DAS MEI 2026', description: 'Valor, vencimento, PIX, boleto, débito automático e multa por atraso', href: '/mei-das', icon: 'calculator' },
    { title: 'Limite de Faturamento', description: 'Teto R$ 81.000/ano, controle mensal, desenquadramento e transição para ME', href: '/mei-faturamento', icon: 'chart' },
    { title: 'DASN-SIMEI 2026', description: 'Declaração anual até 31/05, como preencher, retificação e multa', href: '/dasn-simei', icon: 'file' },
    { title: 'Nota Fiscal MEI', description: 'Quando é obrigatória, NF-e vs NFS-e, emissão gratuita, erros comuns', href: '/nota-fiscal-mei', icon: 'receipt' },
    { title: 'Obrigações Mensais', description: 'Checklist completo: DAS, notas, documentos, faturamento, declarações', href: '/mei-obrigacoes', icon: 'checklist' },
    { title: 'Contratar Funcionário', description: 'Regras, custos (salário + encargos), eSocial, obrigações trabalhistas', href: '/mei-obrigacoes#contratacao', icon: 'user' },
  ];

  return (
    <section className="section bg-[var(--color-black-soft)] border-t border-[var(--color-border)]" data-section>
      <div className="container">
        <div className="section-header-left">
          <p className="section-eyebrow" style={{ color: 'var(--color-orange-light)' }}>Temas Mais Buscados</p>
          <h2 className="section-title section-title-lg">Principais<br />Dúvidas MEI</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="card-elevated group p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                <TopicIcon name={topic.icon} className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors mb-2 leading-tight">
                {topic.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
                {topic.description}
              </p>
              <span className={`${monoClass} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2`}>
                Ler Guia
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
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
            Mantenha-se Informado
          </p>
          <h2 className={`${playfairClass} text-4xl md:text-6xl font-black mb-6 tracking-tighter italic relative z-10`}>
            Resumo Semanal MEI na Sua Caixa de Entrada
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed relative z-10">
            Novos guias, mudanças na legislação, prazos de DASN e DAS, ferramentas atualizadas. Sem spam. Cancelamento a qualquer momento.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
            <input
              type="email"
              placeholder="seu@email.com"
              className="input-premium flex-1"
              required
            />
            <button
              type="submit"
              className="btn btn-primary btn-md whitespace-nowrap"
            >
              Inscrever-se
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
          <p className={`${monoClass} uppercase tracking-[0.3em] relative z-10 mt-6`} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-micro)' }}>
            Ao se inscrever você concorda com nossa Política de Privacidade.
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
              <svg className="w-8 h-8" style={{ color: 'var(--color-green-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Baseado em Fontes Oficiais</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Todas as informações vêm de Gov.br, Receita Federal, SEBRAE e legislação vigente.</p>
          </div>
          <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
              <svg className="w-8 h-8" style={{ color: 'var(--color-blue-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">MEI-First</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Construído para microempreendedores brasileiros, não para contadores ou burocratas.</p>
          </div>
          <div className="p-10 md:p-16 bg-[var(--color-black)] hover:bg-[var(--color-black-soft)] transition-all">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-black-elevated)] flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-blue)]/30 transition-colors">
              <svg className="w-8 h-8" style={{ color: 'var(--color-purple-light)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h3 className="text-[var(--color-text-primary)] font-black text-2xl mb-4 uppercase italic">Sempre Atualizado</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">Acompanhamos mudanças na lei, prazos e valores para manter você em dia.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  // 1. LATEST GUIDES: 8 newest published posts
  let latestGuides: any[] = [];
  try {
    latestGuides = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (latestGuides):", error);
  }

  // 2. TOPIC CATEGORIES: with article counts
  let topicsWithCounts: any[] = [];
  try {
    const categoryCounts = await prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true },
    });
    const countsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: countsMap.get(t.value as any) || 0 }));
  } catch (error) {
    console.error("HomePage DB Error (topics):", error);
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: 0 }));
  }

  // 3. FEATURED GUIDES: High-quality evergreen (with insider data markers)
  let featuredGuides: any[] = [];
  try {
    featuredGuides = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (featured):", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] selection:bg-[var(--color-blue)]/30 overflow-x-hidden`}>
      <HeroSection playfairClass={playfair.className} monoClass={mono.className} interClass={inter.className} />
      <LatestGuidesSection 
        latestGuides={latestGuides} 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
        IMAGE_FALLBACK={IMAGE_FALLBACK} 
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
      <KeyTopicsSection 
        monoClass={mono.className} 
        playfairClass={playfair.className} 
        interClass={inter.className} 
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