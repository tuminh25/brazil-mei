import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: "Contato | Brazil MEI",
  description: "Entre em contato com o Brazil MEI para sugestões de guias, correções, parcerias ou dúvidas gerais sobre MEI.",
  openGraph: {
    title: "Contato | Brazil MEI",
    description: "Entre em contato com o Brazil MEI para sugestões de guias, correções, parcerias ou dúvidas gerais sobre MEI.",
  }
};

export default function ContactPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-3xl mx-auto text-center">
        <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-4 font-black`}>
          Fale Conosco
        </p>
        <h1 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8`}>
          Contato
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Brazil MEI é uma plataforma independente de inteligência para Microempreendedores Individuais. 
          Não somos órgão governamental, contabilidade ou serviço de abertura de MEI.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 bg-[var(--color-black-elevated)] rounded-[var(--radius-3xl)] border border-[var(--color-border)]">
            <h3 className="text-[var(--color-blue-light)] font-black uppercase tracking-widest mb-4">Sugestões e Correções</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Encontrou informação desatualizada? Tem sugestão de novo guia ou ferramenta? 
              Queremos ouvir você.
            </p>
            <a href="mailto:contato@brazilmei.com" className="text-[var(--color-text-primary)] font-bold underline decoration-[var(--color-blue)] hover:text-[var(--color-blue-light)] transition-colors">
              contato@brazilmei.com
            </a>
          </div>
          <div className="p-8 bg-[var(--color-black-elevated)] rounded-[var(--radius-3xl)] border border-[var(--color-border)]">
            <h3 className="text-[var(--color-green-light)] font-black uppercase tracking-widest mb-4">Parcerias</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Para propostas de parceria, colaboração de conteúdo ou divulgação institucional.
            </p>
            <a href="mailto:parcerias@brazilmei.com" className="text-[var(--color-text-primary)] font-bold underline decoration-[var(--color-green)] hover:text-[var(--color-green-light)] transition-colors">
              parcerias@brazilmei.com
            </a>
          </div>
        </div>

        <div className="mt-16 p-8 bg-[var(--color-black-elevated)] rounded-[var(--radius-3xl)] border border-[var(--color-border)] text-left">
          <h3 className="text-[var(--color-text-tertiary)] font-black uppercase tracking-widest mb-4">Antes de escrever:</h3>
          <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
            <li>• Dúvidas específicas sobre seu CNPJ/MEI: consulte seu contador ou o <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-blue-light)] underline">Portal do Empreendedor</a></li>
            <li>• Questões tributárias complexas: procure um contador de confiança</li>
            <li>• Denúncias ou reclamações formais: use os canais oficiais da Receita Federal ou SEBRAE</li>
          </ul>
        </div>
      </div>
    </main>
  );
}