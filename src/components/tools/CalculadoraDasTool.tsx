'use client';

import { useState } from 'react';
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

// 2026 Values (official)
const SALARIO_MINIMO_2026 = 1518;
const INSS_ALIQUOTA = 0.05; // 5% sobre salário-mínimo
const ICMS_ALIQUOTA = 1; // R$ 1,00 fixo para comércio/indústria
const ISS_ALIQUOTA = 5; // R$ 5,00 fixo para serviços

type Atividade = 'comercio' | 'industria' | 'servicos' | 'comercio_servicos' | 'industria_servicos';

const atividadeLabels: Record<Atividade, { label: string; descricao: string; icms: number; iss: number }> = {
  comercio: { label: 'Comércio', descricao: 'Revenda de mercadorias', icms: ICMS_ALIQUOTA, iss: 0 },
  industria: { label: 'Indústria', descricao: 'Fabricação/produção', icms: ICMS_ALIQUOTA, iss: 0 },
  servicos: { label: 'Serviços', descricao: 'Prestação de serviços', icms: 0, iss: ISS_ALIQUOTA },
  comercio_servicos: { label: 'Comércio e Serviços', descricao: 'Atividades mistas', icms: ICMS_ALIQUOTA, iss: ISS_ALIQUOTA },
  industria_servicos: { label: 'Indústria e Serviços', descricao: 'Atividades mistas', icms: ICMS_ALIQUOTA, iss: ISS_ALIQUOTA },
};

export default function CalculadoraDasTool() {
  const [atividade, setAtividade] = useState<Atividade>('servicos');
  const [salarioMinimo, setSalarioMinimo] = useState(SALARIO_MINIMO_2026);

  const inss = salarioMinimo * INSS_ALIQUOTA;
  const icms = atividadeLabels[atividade].icms;
  const iss = atividadeLabels[atividade].iss;
  const total = inss + icms + iss;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <Link href="/ferramentas" className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-6`}>
            ← Voltar às Ferramentas
          </Link>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Calculadora MEI
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic`}>
            Calculadora DAS MEI 2026
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Calcule o valor exato do seu Documento de Arrecadação do Simples Nacional.
            Valores baseados na legislação vigente para 2026.
          </p>
        </div>

        {/* INPUT SECTION */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Sua Atividade
          </h2>
          
          <div className="space-y-4">
            {Object.entries(atividadeLabels).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center gap-4 p-4 rounded-[var(--radius-xl)] border-2 transition-all cursor-pointer ${
                  atividade === key
                    ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-blue)]/30'
                }`}
              >
                <input
                  type="radio"
                  name="atividade"
                  value={key}
                  checked={atividade === key}
                  onChange={() => setAtividade(key as Atividade)}
                  className="w-5 h-5 accent-[var(--color-blue)]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--color-text-primary)]">{value.label}</span>
                    <span className={`${mono.className} text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest`}>
                      {value.descricao}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-secondary)]">
                    {value.icms > 0 && (
                      <span className="flex items-center gap-1">
                        <TopicIcon name="tag" className="w-4 h-4" style={{ color: 'var(--color-green-light)' }} />
                        ICMS: {formatCurrency(value.icms)}
                      </span>
                    )}
                    {value.iss > 0 && (
                      <span className="flex items-center gap-1">
                        <TopicIcon name="file" className="w-4 h-4" style={{ color: 'var(--color-purple-light)' }} />
                        ISS: {formatCurrency(value.iss)}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <h3 className={`${mono.className} text-[10px] font-black uppercase tracking-widest mb-4 text-[var(--color-text-tertiary)]`}>
              Salário-Mínimo de Referência (2026)
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={salarioMinimo}
                onChange={(e) => setSalarioMinimo(Number(e.target.value) || SALARIO_MINIMO_2026)}
                min="1000"
                max="5000"
                className="w-48 input-premium text-center text-lg font-bold"
              />
              <span className="text-[var(--color-text-tertiary)]">
                (Oficial 2026: {formatCurrency(SALARIO_MINIMO_2026)})
              </span>
            </div>
          </div>
        </section>

        {/* RESULT SECTION */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Resultado
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <TopicIcon name="user" className="w-5 h-5" style={{ color: 'var(--color-blue-light)' }} />
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                  INSS (5% salário-mínimo)
                </span>
              </div>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-blue-light)]`}>
                {formatCurrency(inss)}
              </div>
            </div>

            {icms > 0 && (
              <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <TopicIcon name="tag" className="w-5 h-5" style={{ color: 'var(--color-green-light)' }} />
                  <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                    ICMS (Comércio/Indústria)
                  </span>
                </div>
                <div className={`${playfair.className} text-3xl font-black text-[var(--color-green-light)]`}>
                  {formatCurrency(icms)}
                </div>
              </div>
            )}

            {iss > 0 && (
              <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <TopicIcon name="file" className="w-5 h-5" style={{ color: 'var(--color-purple-light)' }} />
                  <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                    ISS (Serviços)
                  </span>
                </div>
                <div className={`${playfair.className} text-3xl font-black text-[var(--color-purple-light)]`}>
                  {formatCurrency(iss)}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-gradient-to-r from-[var(--color-blue)]/10 to-[var(--color-purple)]/10 rounded-[var(--radius-xl)] border border-[var(--color-blue)]/20">
            <div className="flex items-center justify-between">
              <div>
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                  Total DAS Mensal
                </span>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                  Vencimento todo dia 20 • Pagamento via PIX, boleto ou débito automático
                </p>
              </div>
              <div className={`${playfair.className} text-4xl md:text-5xl font-black text-[var(--color-text-primary)]`}>
                {formatCurrency(total)}
              </div>
            </div>
          </div>
        </section>

        {/* INFO SECTION */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Informações Importantes
          </h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-[var(--color-blue)]/5 border border-[var(--color-blue)]/20 rounded-[var(--radius-lg)]">
              <h3 className="font-bold text-[var(--color-blue-light)] mb-2 flex items-center gap-2">
                <TopicIcon name="calendar" className="w-5 h-5" />
                Vencimento e Pagamento
              </h3>
              <ul className="space-y-1 text-[var(--color-text-secondary)] text-sm">
                <li>• Vencimento: <strong>dia 20 de cada mês</strong> (próximo dia útil se feriado/fim de semana)</li>
                <li>• Pagamento: <strong>PIX, boleto bancário ou débito automático</strong></li>
                <li>• Emissão: <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-blue)] underline hover:text-[var(--color-blue-light)]">Portal do Empreendedor</a> ou app MEI</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--color-orange)]/5 border border-[var(--color-orange)]/20 rounded-[var(--radius-lg)]">
              <h3 className="font-bold text-[var(--color-orange-light)] mb-2 flex items-center gap-2">
                <TopicIcon name="alert" className="w-5 h-5" />
                Atraso e Multa
              </h3>
              <ul className="space-y-1 text-[var(--color-text-secondary)] text-sm">
                <li>• Multa: <strong>0,33% ao dia</strong> (máx. 20%) + juros Selic</li>
                <li>• Mínimo: <strong>R$ 10,00</strong> (mesmo se DAS for menor)</li>
                <li>• Após 90 dias: inscrição em Dívida Ativa da União</li>
                <li>• Regularize quanto antes para evitar juros maiores</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-lg)]">
              <h3 className="font-bold text-[var(--color-green-light)] mb-2 flex items-center gap-2">
                <TopicIcon name="check" className="w-5 h-5" />
                Benefícios do Pagamento em Dia
              </h3>
              <ul className="space-y-1 text-[var(--color-text-secondary)] text-sm">
                <li>• Cobertura previdenciária (aposentadoria, auxílio-doença, salário-maternidade)</li>
                <li>• Manutenção da regularidade do CNPJ</li>
                <li>• Acesso a linhas de crédito diferenciadas (BNDES, Pronampe)</li>
                <li>• Evita bloqueio de emissão de nota fiscal</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="text-center pt-8 border-t border-[var(--color-border)]">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em]`}>
            Calculadora baseada na legislação vigente (LC 123/2006, Resolução CGSN). Valores de referência para 2026.
            Sempre confira no <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer" className="text-[var(--color-blue)] underline hover:text-[var(--color-blue-light)]">Portal do Empreendedor</a> ou com seu contador.
          </p>
        </div>
      </div>
    </div>
  );
}