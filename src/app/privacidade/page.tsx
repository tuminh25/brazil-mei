import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: "Política de Privacidade | Brazil MEI",
  description: "Política de Privacidade do Brazil MEI, em conformidade com a LGPD (Lei Geral de Proteção de Dados) e boas práticas de proteção de dados.",
};

export default function PrivacyPolicy() {
  const lastUpdated = "12 de Setembro de 2026";

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] selection:bg-[var(--color-blue)]/30 overflow-x-hidden pt-20`}>
      <section className="max-w-4xl mx-auto px-6 py-32">
        <div className="mb-24 text-center">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Conformidade & Legal
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic`}>
            Política de Privacidade
          </h1>
          <p className="text-[var(--color-text-muted)] font-bold uppercase tracking-[0.3em] text-[9px] border-y border-[var(--color-border)] inline-block py-2">
            Última Atualização: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-16 text-[var(--color-text-secondary)] leading-relaxed">
          {/* INTRODUCTION */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">1. Introdução</h2>
            <p>
              Bem-vindo ao Brazil MEI ("nós", "nosso" ou "nos"). Estamos comprometidos em proteger seus dados pessoais e sua privacidade de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> do Brasil. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você visita nosso site.
            </p>
          </section>

          {/* INFORMATION COLLECTION */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">2. Coleta de Informações</h2>
            <p className="mb-6">
              Coletamos informações que você nos fornece voluntariamente, como quando entra em contato por e-mail ou se inscreve em nossa newsletter. Isso pode incluir:
            </p>
            <ul className="list-disc pl-6 space-y-4 marker:text-[var(--color-blue)]">
              <li>Nome e informações de contato (endereço de e-mail).</li>
              <li>Preferências de comunicação.</li>
              <li>Qualquer informação fornecida através de formulários de contato ou consultas diretas.</li>
            </ul>
            <p className="mt-6">
              Também coletamos automaticamente dados técnicos, incluindo endereços IP, tipos de navegador e padrões de uso, através de cookies e tecnologias similares.
            </p>
          </section>

          {/* COOKIES & ANALYTICS */}
          <section className="p-10 bg-[var(--color-black-elevated)] border border-[var(--color-border)] rounded-[2rem]">
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-cyan)] pl-6">3. Cookies e Análise</h2>
            <p className="mb-6">
              Usamos cookies para melhorar sua experiência, analisar tráfego e oferecer conteúdo relevante.
            </p>
            <div className="space-y-6">
              <h3 className="text-[var(--color-text-primary)] font-bold text-lg uppercase tracking-tight">Google Analytics / Vercel Analytics</h3>
              <p>
                Utilizamos o <strong>Vercel Analytics</strong> e/ou <strong>Google Analytics</strong> para entender como os visitantes interagem com nosso site. Esses serviços coletam dados anonimizados como páginas visitadas, tempo de permanência, dispositivo e localização aproximada.
              </p>
              <p>
                Você pode desativar o rastreamento do Google Analytics instalando o <a href="https://tools.google.com/dlpage/gaoptout" className="text-[var(--color-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Complemento do navegador para desativação do Google Analytics</a>.
              </p>
            </div>
          </section>

          {/* USE OF DATA */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">4. Uso dos Seus Dados</h2>
            <p className="mb-6">Seus dados são usados para:</p>
            <ul className="list-disc pl-6 space-y-4 marker:text-[var(--color-blue)]">
              <li>Fornecer e manter nossos conteúdos e serviços.</li>
              <li>Otimizar o desempenho do site e a experiência do usuário.</li>
              <li>Comunicar-nos com você sobre atualizações, newsletters ou consultas.</li>
              <li>Garantir conformidade com obrigações legais no Brasil.</li>
            </ul>
          </section>

          {/* DATA SECURITY */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança padrão da indústria para proteger seus dados pessoais contra acesso não autorizado, divulgação ou destruição. No entanto, observe que nenhum método de transmissão eletrônica é 100% seguro.
            </p>
          </section>

          {/* YOUR RIGHTS - LGPD */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">6. Seus Direitos (LGPD)</h2>
            <p>
              De acordo com a LGPD (Art. 18), você tem direitos sobre seus dados pessoais, incluindo o direito de confirmar a existência de tratamento, acessar os dados, corrigir dados incompletos/inexatos/desatualizados, anonimizar/bloquear/eliminar dados desnecessários/excessivos, solicitar portabilidade, eliminar dados tratados com consentimento, obter informação sobre compartilhamento, revogar consentimento e opor-se ao tratamento. Para exercer esses direitos, entre em contato conosco no e-mail abaixo.
            </p>
          </section>

          {/* DATA RETENTION */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">7. Retenção de Dados</h2>
            <p className="mb-4">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, salvo se houver exigência legal para retenção por prazo maior.
            </p>
            <p>
              Dados de analytics: retidos conforme políticas do provedor (Vercel/Google).
              Dados de contato/newsletter: retidos até solicitação de exclusão ou cancelamento de inscrição.
            </p>
          </section>

          {/* THIRD PARTY */}
          <section>
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-[var(--color-blue)] pl-6">8. Compartilhamento com Terceiros</h2>
            <p className="mb-4">
              Não vendemos seus dados pessoais. Podemos compartilhar dados com:
            </p>
            <ul className="list-disc pl-6 space-y-4 marker:text-[var(--color-blue)]">
              <li><strong>Provedores de analytics:</strong> Vercel Analytics, Google Analytics (dados anonimizados/agregados).</li>
              <li><strong>Provedores de infraestrutura:</strong> Vercel (hospedagem), provedores de e-mail transacional (se aplicável).</li>
              <li><strong>Autoridades legais:</strong> Quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          {/* CONTACT INFO */}
          <section className="pt-16 border-t border-[var(--color-border)]">
            <h2 className="text-[var(--color-text-primary)] font-black uppercase tracking-tight text-2xl mb-8">9. Contato</h2>
            <p className="mb-8">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos como titular de dados, entre em contato com nosso Encarregado de Dados (DPO):
            </p>
            <div className="p-12 bg-gradient-to-br from-[var(--color-black-elevated)] to-[var(--color-black)] rounded-[3rem] border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-blue)]/5 rounded-full blur-3xl" />
              <p className="text-[var(--color-text-primary)] text-xl font-black mb-2 uppercase">Brazil MEI - Encarregado de Dados</p>
              <p className="text-[var(--color-blue)] font-bold mb-4 italic">privacidade@brazilmei.com</p>
              <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-widest font-black">Assunto: LGPD / Direitos do Titular</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}