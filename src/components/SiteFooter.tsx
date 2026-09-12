import Link from "next/link";
import { ArrowRightIcon, MailIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/Icons';

const footerNavigation = {
  "Guias MEI": [
    { name: "DAS MEI", href: "/mei-das" },
    { name: "Faturamento MEI", href: "/mei-faturamento" },
    { name: "DASN-SIMEI", href: "/dasn-simei" },
    { name: "Nota Fiscal MEI", href: "/nota-fiscal-mei" },
    { name: "Obrigações Mensais", href: "/mei-obrigacoes" },
    { name: "Cadastro MEI", href: "/mei-cadastro" },
  ],
  "Ferramentas": [
    { name: "Calculadora DAS", href: "/ferramentas/calculadora-das" },
    { name: "Verificador Faturamento", href: "/ferramentas/verificador-faturamento" },
    { name: "Checklist Obrigações", href: "/ferramentas/checklist-obrigacoes" },
    { name: "Simulador Contratação", href: "/ferramentas/simulador-contratacao" },
  ],
  "Recursos": [
    { name: "Todos os Guias", href: "/guias" },
    { name: "Todas as Ferramentas", href: "/ferramentas" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Política de Privacidade", href: "/privacidade" },
    { name: "Contato", href: "/contato" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--color-black)] border-t border-[var(--color-border)] py-20 md:py-32 px-6">
      <div className="container-wide">
        {/* Brand Story Section - Editorial First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 mb-16 md:mb-24" data-animate>
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tighter text-[var(--color-text-primary)] italic uppercase hover:text-[var(--color-blue-light)] transition-colors mb-8 inline-block">
              <span className="text-[var(--color-text-primary)]">Brazil</span>
              <span className="text-[var(--color-blue-light)]">MEI</span>
            </Link>
            
            {/* Editorial Manifesto */}
            <div className="space-y-6 max-w-xl">
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Independente.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                MEI-first.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Baseado em fontes oficiais.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Atualizado constantemente.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="mt-10 pt-10 border-t border-[var(--color-border)] max-w-xl">
              <p className="text-[var(--color-text-tertiary)] text-sm leading-relaxed">
                Construímos inteligência prática para Microempreendedores Individuais no Brasil — não para burocratas. 
                Cada guia é pesquisado, verificado em fontes oficiais (Gov.br, Receita Federal, SEBRAE, Contador) 
                e atualizado para que você tome decisões seguras sobre DAS, faturamento, nota fiscal, obrigações e contratação.
              </p>
            </div>

            {/* Social Links - Minimal */}
            <div className="mt-10 flex items-center gap-6">
              <a href="https://twitter.com/brazilmei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/brazilmei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="LinkedIn">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="https://github.com/brazilmei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="mailto:contato@brazilmei.com" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="Email">
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter in Footer - Premium */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-[var(--radius-3xl)] p-8 md:p-10">
              <p className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-4" style={{ fontSize: 'var(--text-xs)' }}>
                Mantenha-se Informado
              </p>
              <h3 className="text-[var(--color-text-primary)] font-black text-xl md:text-2xl mb-4 italic leading-snug">
                Resumo Semanal MEI
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                Novos guias, mudanças na legislação, prazos de DASN e DAS. Sem spam. Cancelamento a qualquer momento.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="input-premium w-full"
                  required
                />
                <button type="submit" className="btn btn-primary btn-md w-full">
                  Inscrever-se
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[var(--color-text-muted)] mt-4" style={{ fontSize: 'var(--text-micro)' }}>
                Ao se inscrever você concorda com nossa Política de Privacidade.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20" data-animate>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Guias MEI
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Guias MEI"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Ferramentas
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Ferramentas"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Recursos
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Recursos"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Fontes Oficiais
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Portal do Empreendedor<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></a></li>
              <li><a href="https://www.receita.fazenda.gov.br/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Receita Federal<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></a></li>
              <li><a href="https://www.sebrae.com.br/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">SEBRAE<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></a></li>
              <li><a href="https://www.gov.br/nfe/pt-br" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Portal NF-e<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></a></li>
              <li><a href="https://www.gov.br/economia/pt-br/assuntos/noticias/2024" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Ministério da Economia<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)] pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <p className="text-[var(--color-text-muted)] uppercase tracking-widest font-medium" style={{ fontSize: 'var(--text-micro)' }}>
              © 2026 Brazil MEI. Todos os direitos reservados.
            </p>
            <p className="text-[var(--color-text-muted)] uppercase tracking-widest font-medium text-center md:text-right" style={{ fontSize: 'var(--text-micro)' }}>
              Plataforma independente de inteligência MEI dedicada a ajudar microempreendedores brasileiros a tomar decisões seguras através de pesquisa confiável, guias práticos e ferramentas interativas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}