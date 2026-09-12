'use client';

import { useState } from 'react';
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

const obrigacoesMensais = [
  {
    id: 'das',
    titulo: 'Pagar DAS MEI',
    descricao: 'Guia única (INSS + ICMS/ISS) até dia 20 via PIX, boleto ou débito automático',
    categoria: 'Tributário',
    obrigatorio: true,
    frequencia: 'Mensal',
  },
  {
    id: 'notas',
    titulo: 'Emitir Notas Fiscais',
    descricao: 'Obrigatório nas vendas para PJ (NF-e comércio/indústria, NFS-e serviços). Opcional para PF.',
    categoria: 'Fiscal',
    obrigatorio: true,
    frequencia: 'Por venda',
  },
  {
    id: 'faturamento',
    titulo: 'Controlar Faturamento',
    descricao: 'Registrar receitas mensais. Não ultrapassar R$ 6.750/mês (média) ou R$ 81.000/ano.',
    categoria: 'Gerencial',
    obrigatorio: true,
    frequencia: 'Diário/Mensal',
  },
  {
    id: 'documentos',
    titulo: 'Guardar Documentos',
    descricao: 'Notas fiscais emitidas/recebidas, comprovantes de DAS, extratos bancários por 5 anos.',
    categoria: 'Arquivo',
    obrigatorio: true,
    frequencia: 'Contínuo',
  },
  {
    id: 'conta_pj',
    titulo: 'Manter Conta PJ Ativa',
    descricao: 'Separar finanças pessoais da empresa. Movimentar apenas pela conta PJ do MEI.',
    categoria: 'Bancário',
    obrigatorio: true,
    frequencia: 'Contínuo',
  },
];

const obrigacoesAnuais = [
  {
    id: 'dasn',
    titulo: 'DASN-SIMEI',
    descricao: 'Declaração Anual do Simples Nacional do MEI até 31/05. Informar faturamento bruto do ano anterior.',
    categoria: 'Declaração',
    obrigatorio: true,
    prazo: '31 de maio',
  },
  {
    id: 'caged',
    titulo: 'CAGED/eSocial (se tem funcionário)',
    descricao: 'Admissão, demissão, férias, 13º salário, alterações contratuais do funcionário.',
    categoria: 'Trabalhista',
    obrigatorio: false,
    prazo: 'Conforme evento',
  },
];

export default function ChecklistObrigacoesTool() {
  const [concluidasMensais, setConcluidasMensais] = useState<Record<string, boolean>>({});
  const [concluidasAnuais, setConcluidasAnuais] = useState<Record<string, boolean>>({});

  const toggleMensal = (id: string) => {
    setConcluidasMensais(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAnual = (id: string) => {
    setConcluidasAnuais(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalMensais = obrigacoesMensais.filter(o => o.obrigatorio).length;
  const concluidasMensaisCount = obrigacoesMensais.filter(o => o.obrigatorio && concluidasMensais[o.id]).length;
  const totalAnuais = obrigacoesAnuais.filter(o => o.obrigatorio).length;
  const concluidasAnuaisCount = obrigacoesAnuais.filter(o => o.obrigatorio && concluidasAnuais[o.id]).length;

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/ferramentas" className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-6`}>
            ← Voltar às Ferramentas
          </Link>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Checklist MEI
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic`}>
            Checklist Obrigações Mensais
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Marque o que já fez este mês. Salva no navegador (localStorage).
          </p>
        </div>

        {/* PROGRESS SUMMARY */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-4">
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                  Obrigações Mensais
                </span>
                <span className={`${playfair.className} text-2xl font-black text-[var(--color-blue-light)]`}>
                  {concluidasMensaisCount}/{totalMensais}
                </span>
              </div>
              <div className="h-3 bg-[var(--color-black)] rounded-full border border-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-blue)] transition-all duration-500"
                  style={{ width: `${totalMensais > 0 ? (concluidasMensaisCount / totalMensais) * 100 : 0}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-2 text-center">
                {Math.round((concluidasMensaisCount / totalMensais) * 100)}% concluído
              </p>
            </div>

            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-4">
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                  Obrigações Anuais
                </span>
                <span className={`${playfair.className} text-2xl font-black text-[var(--color-green-light)]`}>
                  {concluidasAnuaisCount}/{totalAnuais}
                </span>
              </div>
              <div className="h-3 bg-[var(--color-black)] rounded-full border border-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-green)] transition-all duration-500"
                  style={{ width: `${totalAnuais > 0 ? (concluidasAnuaisCount / totalAnuais) * 100 : 0}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-2 text-center">
                {Math.round((concluidasAnuaisCount / totalAnuais) * 100)}% concluído
              </p>
            </div>
          </div>
        </section>

        {/* MENSAL CHECKLIST */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            ✅ Checklist Mensal
          </h2>

          <div className="space-y-4">
            {obrigacoesMensais.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-4 p-5 rounded-[var(--radius-xl)] border-2 transition-all cursor-pointer ${
                  concluidasMensais[item.id]
                    ? 'border-[var(--color-green)] bg-[var(--color-green)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-blue)]/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={concluidasMensais[item.id] || false}
                  onChange={() => toggleMensal(item.id)}
                  className="w-5 h-5 accent-[var(--color-green)] mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[var(--color-text-primary)]">{item.titulo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.obrigatorio
                        ? 'bg-[var(--color-red)]/20 text-[var(--color-red-light)]'
                        : 'bg-[var(--color-blue)]/20 text-[var(--color-blue-light)]'
                    }`}>
                      {item.obrigatorio ? 'Obrigatório' : 'Opcional'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-gray)]/20 text-[var(--color-text-tertiary)]`}>
                      {item.frequencia}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm">{item.descricao}</p>
                </div>
                {concluidasMensais[item.id] && (
                  <TopicIcon name="check" className="w-6 h-6 text-[var(--color-green-light)] flex-shrink-0" />
                )}
              </label>
            ))}
          </div>
        </section>

        {/* ANUAL CHECKLIST */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            📅 Checklist Anual
          </h2>

          <div className="space-y-4">
            {obrigacoesAnuais.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-4 p-5 rounded-[var(--radius-xl)] border-2 transition-all cursor-pointer ${
                  concluidasAnuais[item.id]
                    ? 'border-[var(--color-green)] bg-[var(--color-green)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-blue)]/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={concluidasAnuais[item.id] || false}
                  onChange={() => toggleAnual(item.id)}
                  className="w-5 h-5 accent-[var(--color-green)] mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[var(--color-text-primary)]">{item.titulo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.obrigatorio
                        ? 'bg-[var(--color-red)]/20 text-[var(--color-red-light)]'
                        : 'bg-[var(--color-blue)]/20 text-[var(--color-blue-light)]'
                    }`}>
                      {item.obrigatorio ? 'Obrigatório' : 'Se aplicável'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-orange)]/20 text-[var(--color-orange-light)]`}>
                      Prazo: {item.prazo}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm">{item.descricao}</p>
                </div>
                {concluidasAnuais[item.id] && (
                  <TopicIcon name="check" className="w-6 h-6 text-[var(--color-green-light)] flex-shrink-0" />
                )}
              </label>
            ))}
          </div>
        </section>

        {/* RESET BUTTON */}
        <div className="text-center pt-8 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              setConcluidasMensais({});
              setConcluidasAnuais({});
            }}
            className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] hover:text-[var(--color-red-light)] transition-colors`}
          >
            Limpar Checklist (Resetar Tudo)
          </button>
        </div>

        <div className="text-center pt-8 border-t border-[var(--color-border)]">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em]`}>
            Checklist salvo localmente no seu navegador. Não substitui controle contábil oficial.
          </p>
        </div>
      </div>
    </div>
  );
}