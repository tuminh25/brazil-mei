import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function NotFound() {
  return (
    <>
      <title>Página Não Encontrada | Brazil MEI</title>
      <meta name="robots" content="noindex" />
      <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] flex items-center justify-center px-6`}>
        <div className="max-w-md mx-auto text-center">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-[0.4em] mb-4`}>
            404 — Não Encontrada
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-black tracking-tighter italic mb-6`}>
            Página Não Encontrada
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed">
            A página que você procura não existe ou foi movida.
          </p>
          <nav className="space-y-4" aria-label="Navegação de recuperação">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-blue)] text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-[var(--color-blue-light)] transition-colors"
            >
              Voltar à Inicial
            </Link>
            <div className="grid grid-cols-2 gap-3 text-left">
              <Link
                href="/guias"
                className="block p-4 bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-blue)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-cyan-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Ver Guias</p>
                <p className="text-sm text-[var(--color-text-secondary)]">DAS, Faturamento, DASN, Nota Fiscal</p>
              </Link>
              <Link
                href="/ferramentas"
                className="block p-4 bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-green)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-green-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Ferramentas</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Calculadora DAS, Verificador, Checklist</p>
              </Link>
              <Link
                href="/sobre"
                className="block p-4 bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-purple)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-purple-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Sobre Nós</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Missão, princípios e equipe</p>
              </Link>
              <Link
                href="/contato"
                className="block p-4 bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-orange)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-orange-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Contato</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Sugestões, correções, parcerias</p>
              </Link>
            </div>
          </nav>
          <p className={`${mono.className} text-[var(--color-text-muted)] text-[10px] uppercase tracking-[0.3em] mt-10`}>
            Brazil MEI \u2014 Inteligência MEI
          </p>
        </div>
      </main>
    </>
  );
}