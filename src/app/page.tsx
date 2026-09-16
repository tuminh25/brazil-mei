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
  { value: 'MEI_DAS', label: 'DAS MEI', icon: 'calculator', href: '/mei-das', count: 2 },
  { value: 'MEI_FATURAMENTO', label: 'Faturamento', icon: 'chart', href: '/mei-faturamento', count: 2 },
  { value: 'DASN_SIMEI', label: 'DASN-SIMEI', icon: 'file', href: '/dasn-simei', count: 2 },
  { value: 'NOTA_FISCAL', label: 'Nota Fiscal', icon: 'receipt', href: '/nota-fiscal-mei', count: 2 },
  { value: 'MEI_OBRIGACOES', label: 'Obrigações', icon: 'checklist', href: '/mei-obrigacoes', count: 2 },
  { value: 'MEI_CADASTRO', label: 'Cadastro MEI', icon: 'user', href: '/mei-cadastro', count: 2 },
  { value: 'FERRAMENTAS', label: 'Ferramentas', icon: 'tools', href: '/ferramentas', count: 4 },
  { value: 'GUIA_COMPLETO', label: 'Guia Completo', icon: 'book', href: '/guias', count: 1 },
];

const tools = [
  { name: 'Calculadora DAS MEI', category: 'Tributos', icon: 'calculator', status: 'Disponível', href: '/ferramentas/calculadora-das' },
  { name: 'Verificador de Faturamento', category: 'Controle', icon: 'chart', status: 'Em breve', href: '/ferramentas/verificador-faturamento' },
  { name: 'Checklist Obrigações Mensais', category: 'Compliance', icon: 'checklist', status: 'Em breve', href: '/ferramentas/checklist-obrigacoes' },
  { name: 'Simulador de Contratação', category: 'RH', icon: 'user', status: 'Em breve', href: '/ferramentas/simulador-contratacao' },
];

const staticGuides = [
  {
    id: 1,
    slug: 'o-que-e-das-mei-como-pagar',
    title: 'O que é DAS MEI e como pagar em 2026',
    excerpt: 'Guia completo sobre o Documento de Arrecadação do Simples Nacional para MEI: valores, vencimentos, formas de pagamento e o que acontece se atrasar.',
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    slug: 'limite-faturamento-mei-2026',
    title: 'Limite de faturamento MEI 2026: R$ 81.000 e o que muda',
    excerpt: 'Entenda o teto de faturamento anual do MEI, como calcular seu faturamento mensal, o que acontece se ultrapassar e as regras de desenquadramento.',
    category: 'MEI_FATURAMENTO',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-10',
  },
  {
    id: 3,
    slug: 'dasn-simei-2026-passo-a-passo',
    title: 'DASN-SIMEI 2026: Passo a passo para declarar',
    excerpt: 'Como fazer a Declaração Anual do Simples Nacional do MEI (DASN-SIMEI): prazo, documentos necessários, como preencher e evitar multa.',
    category: 'DASN_SIMEI',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-05',
  },
  {
    id: 4,
    slug: 'nota-fiscal-mei-obrigatoriedade-como-emitir',
    title: 'Nota Fiscal MEI: Quando é obrigatória e como emitir grátis',
    excerpt: 'Entenda quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e gratuitamente nos portais estaduais/municipais e erros comuns a evitar.',
    category: 'NOTA_FISCAL',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-01',
  },
  {
    id: 5,
    slug: 'obrigacoes-mensais-mei-checklist',
    title: 'Obrigações mensais do MEI: Checklist completo 2026',
    excerpt: 'Tudo que o MEI deve fazer todo mês: pagar DAS, emitir notas, guardar documentos, controlar faturamento. Checklist para não esquecer nada.',
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-28',
  },
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
  {
    id: 7,
    slug: 'mei-pode-contratar-funcionario-regras-2026',
    title: 'MEI pode contratar funcionário? Regras, custos e como fazer em 2026',
    excerpt: 'Sim, MEI pode contratar 1 funcionário. Entenda as regras, custos totais (salário + encargos), como registrar no eSocial e obrigações trabalhistas.',
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-15',
  },
  {
    id: 8,
    slug: 'calculadora-das-mei-2026',
    title: 'Calculadora DAS MEI 2026: Simule seu pagamento mensal',
    excerpt: 'Ferramenta gratuita para calcular o valor exato do seu DAS MEI em 2026: INSS + ICMS/ISS conforme sua atividade. Valores oficiais atualizados.',
    category: 'FERRAMENTAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-10',
  },

  // New articles from batch01.md
  {
    id: 9,
    slug: 'como-pagar-das-mei-2026',
    title: 'Como pagar o DAS do MEI em 2026: passo a passo rápido, canais e cuidados para não atrasar',
    excerpt: 'Todo mês, o MEI precisa gerar e pagar uma guia chamada DAS. Parece simples, mas boa parte das dúvidas não é sobre "o que é o DAS" — é sobre onde emitir a guia, até quando pagar e o que fazer quando o ...',
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 10,
    slug: 'das-mei-atrasado-multa-juros-parcelamento',
    title: 'DAS MEI atrasado: multa, juros, parcelamento e como decidir',
    excerpt: 'Um ou dois meses de DAS atrasados parecem inofensivos. Mas quando o atraso se acumula por muitos meses ou anos, o MEI enfrenta uma duvida concreta: vale mais a pena pagar tudo de uma vez, parcelar ou ...',
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 11,
    slug: 'dasn-simei-declaracao-anual-mei',
    title: 'Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos',
    excerpt: 'Muitos MEIs sabem que precisam pagar o DAS todo mês, mas esquecem de uma segunda obrigaao, anual: a DASN-SIMEI. E um erro muito comum é pensar que, se nao faturou nada no ano, nao precisa declarar nad...',
    category: 'DASN_SIMEI',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 12,
    slug: 'limite-faturamento-mei-2026-desenquadramento',
    title: 'Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar',
    excerpt: 'O MEI cresceu, as vendas aumentaram, e agora surge a pergunta: "sera que ja passei do limite permitido?" Entender esse limite — e o que acontece quando ele é ultrapassado — é essencial para nao ser pe...',
    category: 'MEI_FATURAMENTO',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 13,
    slug: 'nota-fiscal-mei-quando-obrigatoria-como-emitir',
    title: 'Nota fiscal para MEI: quando é obrigatooria e como emitir graatis',
    excerpt: '"Preciso mesmo emitir nota fiscal sendo MEI?" é uma das perguntas mais comuns — e a resposta certa depende de para quem você vendeu, o que vendeu e, em alguns casos, de onde e para onde. Nao existe um...',
    category: 'NOTA_FISCAL',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 14,
    slug: 'mei-pode-contratar-funcionario-esocial',
    title: 'MEI pode contratar funcionario? Veja quanto custa, quais sao as regras e como registrar no eSocial',
    excerpt: 'O negocio cresceu e virou mais trabalho do que uma pessoa consegue dar conta. A pergunta natural é: da para contratar alguem formalmente ainda como MEI, ou isso exige virar outro tipo de empresa? E, s...',
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 15,
    slug: 'abrir-alterar-encerrar-mei-portal-empreendedor',
    title: 'Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor',
    excerpt: 'Formalizar um negocio, mudar de atividade ou fechar o CNPJ sao decisoes que geram duvidas parecidas: onde fazer isso oficialmente, o que é exigido e o que pode dar errado no processo....',
    category: 'MEI_CADASTRO',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
  {
    id: 16,
    slug: 'beneficios-inss-mei-aposentadoria-auxilio',
    title: 'Beneficios do INSS para MEI: aposentadoria, auxilio e como planejar suas contribuiçııes',
    excerpt: 'Pagar o DAS todo mês parece so uma obrigaao fiscal — mas parte desse valor é, na verdade, contribuiçııo previdenciaria. A pergunta que fica é: isso realmente garante algum beneficio no futuro, e o que...',
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
  },
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
                src={getVersionedImageUrl(latestGuides[0].imageUrl, latestGuides[0].createdAt) || IMAGE_FALLBACK}
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
                    src={getVersionedImageUrl(post.imageUrl, post.createdAt) || IMAGE_FALLBACK}
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
                      src={getVersionedImageUrl(post.imageUrl, post.createdAt) || IMAGE_FALLBACK}
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
                  src={getVersionedImageUrl(post.imageUrl, post.createdAt) || IMAGE_FALLBACK}
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
                  {post.excerpt}
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

export default function HomePage() {
  const latestGuides = staticGuides.slice(0, 8);
  const featuredGuides = staticGuides.slice(0, 4);
  const topicsWithCounts = topicCategories;

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
        topicsWithCounts={topicCategories} 
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