// src/app/ferramentas/page.tsx
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: "Ferramentas MEI | Brazil MEI",
  description: "Calculadoras práticas para MEIs — DAS mensal, controle de faturamento, checklist de obrigações, simulação de contratação.",
  openGraph: {
    title: "Ferramentas MEI | Brazil MEI",
    description: "Calculadoras práticas para MEIs — DAS mensal, controle de faturamento, checklist de obrigações, simulação de contratação.",
  }
};

const tools = [
  {
    name: "Calculadora DAS MEI",
    description: "Calcule o valor exato do seu DAS mensal em 2026: INSS 5% salário-mínimo + ICMS (comércio/indústria) ou ISS (serviços). Valores oficiais.",
    icon: "calculator",
    href: "/ferramentas/calculadora-das",
    category: "Tributos",
    status: "Disponível",
  },
  {
    name: "Verificador de Faturamento",
    description: "Acompanhe seu faturamento mensal vs limite anual de R$ 81.000. Alertas automáticos quando se aproximar do teto.",
    icon: "chart",
    href: "/ferramentas/verificador-faturamento",
    category: "Controle",
    status: "Em breve",
  },
  {
    name: "Checklist Obrigações Mensais",
    description: "Lista completa do que fazer todo mês: pagar DAS, emitir notas, guardar documentos, controlar faturamento. Marque como concluído.",
    icon: "checklist",
    href: "/ferramentas/checklist-obrigacoes",
    category: "Compliance",
    status: "Em breve",
  },
  {
    name: "Simulador de Contratação",
    description: "Simule o custo total de contratar 1 funcionário: salário + INSS patronal + FGTS + férias + 13º + seguro acidente. Veja o impacto no caixa.",
    icon: "user",
    href: "/ferramentas/simulador-contratacao",
    category: "RH",
    status: "Em breve",
  },
];

export default function ToolsPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="container-wide">
        {/* HERO */}
        <div className="text-center mb-20 md:mb-24" data-animate>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Utilitários MEI
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Ferramentas & Calculadoras
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            Calculadoras práticas para as decisões que importam — DAS mensal, controle de faturamento, checklist de obrigações, simulação de contratação.
          </p>
        </div>

        {/* TOOLS GRID - Tool Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-animate>
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
                  <span className={`${mono.className} font-black uppercase tracking-widest mb-1 block`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <span className={`${mono.className} font-black uppercase tracking-widest`} style={{ 
                  color: tool.status === 'Disponível' ? 'var(--color-green-light)' : 'var(--color-text-tertiary)', 
                  fontSize: 'var(--text-micro)' 
                }}>
                  {tool.status}
                </span>
                <span className={`${mono.className} font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                  Abrir Ferramenta
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 text-center" data-animate>
          <p className={`${mono.className} text-[var(--color-text-tertiary)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Construído para MEIs, por MEIs
          </p>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-black mb-6 tracking-tighter italic`}>
            Tem Ideia de Ferramenta?
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            Estamos construindo ferramentas baseadas no que MEIs brasileiros realmente precisam. Conte-nos qual calculadora ou verificador facilitaria sua vida.
          </p>
          <Link
            href="/contato"
            className="btn btn-primary btn-md"
          >
            Sugerir Ferramenta
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-20 pt-10 border-t border-[var(--color-border)] text-center">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em] max-w-2xl mx-auto`}>
            Todas as calculadoras fornecem estimativas baseadas na legislação vigente. Sempre verifique com fontes oficiais (Gov.br, Receita Federal, SEBRAE, seu contador) antes de tomar decisões financeiras ou fiscais.
          </p>
        </div>
      </div>
    </main>
  );
}