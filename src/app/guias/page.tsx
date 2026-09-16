// src/app/guias/page.tsx
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

const categories = [
  { value: 'MEI_DAS', label: 'DAS MEI', icon: 'calculator', count: 4 },
  { value: 'MEI_FATURAMENTO', label: 'Faturamento', icon: 'chart', count: 2 },
  { value: 'DASN_SIMEI', label: 'DASN-SIMEI', icon: 'file', count: 2 },
  { value: 'NOTA_FISCAL', label: 'Nota Fiscal', icon: 'receipt', count: 2 },
  { value: 'MEI_OBRIGACOES', label: 'Obrigações', icon: 'checklist', count: 2 },
  { value: 'MEI_CADASTRO', label: 'Cadastro MEI', icon: 'user', count: 2 },
  { value: 'FERRAMENTAS', label: 'Ferramentas', icon: 'tools', count: 4 },
  { value: 'GUIA_COMPLETO', label: 'Guia Completo', icon: 'book', count: 1 },
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
  
  let posts = [...staticGuides];
  if (category && categories.some(c => c.value === category)) {
    posts = posts.filter(p => p.category === category);
  }
  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const selectedCategory = categories.find(c => c.value === category);
  const categoryCountsMap = new Map(categories.map(c => [c.value, c.count]));

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
                {cat.count && (
                  <span className="bg-[var(--color-white)]/10 px-2 py-0.5 rounded-full text-[10px]">
                    {cat.count}
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
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
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