import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: "Sobre Nós | Brazil MEI",
  description: "Conheça a missão do Brazil MEI: inteligência prática para Microempreendedores Individuais no Brasil. Guias baseados em fontes oficiais, atualizados constantemente.",
};

export default function AboutPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] selection:bg-[var(--color-blue)]/30 overflow-x-hidden`}>
      {/* HERO SECTION */}
      <section className="relative py-40 px-6 border-b border-[var(--color-border)] overflow-hidden">
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-blue)]/10 rounded-full blur-[140px] -z-10 mix-blend-screen animate-pulse' />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Plataforma de Inteligência MEI
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12`}>
            MEI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-green)] via-[var(--color-blue)] to-[var(--color-purple)]">
              Descomplicado
            </span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
            "Inteligência prática para Microempreendedores Individuais no Brasil — baseada em fontes oficiais, sem burocracia."
          </p>
        </div>
      </section>

      {/* IDENTITY STATEMENT & MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-b border-[var(--color-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div>
            <h2 className={`${playfair.className} text-4xl md:text-6xl font-black uppercase italic mb-10 tracking-tighter`}>
              Nossa Missão
            </h2>
            <div className="space-y-8 text-[var(--color-text-secondary)] text-lg leading-relaxed">
              <p className="border-l-2 border-[var(--color-blue)] pl-8 py-2 bg-[var(--color-blue)]/5 text-[var(--color-text-primary)] font-medium">
                Brazil MEI é uma plataforma independente de inteligência para Microempreendedores Individuais no Brasil. Não temos vínculo com órgãos governamentais, contabilidades ou empresas de abertura de CNPJ.
              </p>
              <p>
                Nasceu em 2026 da necessidade de informações claras, práticas e baseadas em fontes oficiais para quem empreende como MEI. Não apenas listamos regras; traduzimos a burocracia para decisões do dia a dia.
              </p>
              <p>
                Nosso compromisso é com a "Inteligência Prática MEI". Cada guia, calculadora e checklist é pesquisado em fontes oficiais (Gov.br, Receita Federal, SEBRAE, legislação vigente) e atualizado para que você tome decisões seguras sobre DAS, faturamento, nota fiscal, obrigações e contratação.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-blue)]/20 to-[var(--color-purple)]/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-[var(--color-border)] bg-[var(--color-black-elevated)]">
              <Image 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600" 
                alt="Empreendedor brasileiro trabalhando" 
                fill 
                className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className={`${mono.className} text-[var(--color-green-light)] text-[10px] uppercase tracking-[0.3em] mb-4`}>Diretriz Principal</div>
                <h3 className="text-[var(--color-text-primary)] text-3xl font-black uppercase italic tracking-tighter">Inteligência Prática MEI</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-32 bg-[var(--color-black-soft)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <p className={`${mono.className} text-[var(--color-green-light)] text-[10px] uppercase tracking-[0.5em] mb-6 font-black text-center`}>
              Nossos Princípios
            </p>
            <h2 className={`${playfair.className} text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-center`}>
              O Que Nos Guia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FONTES OFICIAIS */}
            <div className="p-10 bg-[var(--color-black)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-blue)]/30 transition-all group">
              <div className="w-20 h-20 bg-[var(--color-blue)]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" style={{ color: 'var(--color-blue-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-[var(--color-text-primary)] font-black text-2xl mb-2 uppercase tracking-tight">Fontes Oficiais</h4>
              <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] uppercase tracking-widest mb-6`}>Princípio #1</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                Toda informação vem de Gov.br, Receita Federal, SEBRAE, Diário Oficial e legislação vigente. Citamos fontes para você conferir.
              </p>
            </div>

            {/* MEI-FIRST */}
            <div className="p-10 bg-[var(--color-black)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-green)]/30 transition-all group">
              <div className="w-20 h-20 bg-[var(--color-green)]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" style={{ color: 'var(--color-green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="text-[var(--color-text-primary)] font-black text-2xl mb-2 uppercase tracking-tight">MEI-First</h4>
              <p className={`${mono.className} text-[var(--color-green-light)] text-[10px] uppercase tracking-widest mb-6`}>Princípio #2</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                Escrevemos para o microempreendedor que acorda cedo, trabalha duro e precisa de respostas rápidas. Não para contadores ou advogados.
              </p>
            </div>

            {/* ATUALIZAÇÃO CONSTANTE */}
            <div className="p-10 bg-[var(--color-black)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-purple)]/30 transition-all group">
              <div className="w-20 h-20 bg-[var(--color-purple)]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" style={{ color: 'var(--color-purple-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 className="text-[var(--color-text-primary)] font-black text-2xl mb-2 uppercase tracking-tight">Sempre Atualizado</h4>
              <p className={`${mono.className} text-[var(--color-purple-light)] text-[10px] uppercase tracking-widest mb-6`}>Princípio #3</p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                Acompanhamos mudanças na lei, prazos, valores de DAS, limite de faturamento e regras de nota fiscal. O que você lê aqui reflete a realidade de 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-48 text-center px-6 border-t border-[var(--color-border)] relative overflow-hidden">
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-blue)]/10 rounded-full blur-[100px] -z-10' />
        
        <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase italic mb-12 tracking-tighter`}>
          Comece Agora <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-green)] to-[var(--color-blue)]">Seus Guias</span>
        </h2>
        <div className="flex justify-center gap-4">
          <a href="/guias" className="btn btn-primary btn-md">
            Ver Todos os Guias
          </a>
          <a href="/ferramentas" className="btn btn-secondary btn-md">
            Acessar Ferramentas
          </a>
        </div>
        <div className="mt-16">
          <div className={`${mono.className} text-[var(--color-text-muted)] text-[10px] uppercase tracking-[0.5em] font-black`}>
            © 2026 Brazil MEI • Todos os direitos reservados
          </div>
        </div>
      </section>
    </main>
  );
}