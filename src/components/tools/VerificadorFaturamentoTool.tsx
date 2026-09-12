'use client';

import { useState } from 'react';
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

const LIMITE_ANUAL = 81000;
const LIMITE_MENSAL_MEDIA = LIMITE_ANUAL / 12;

export default function VerificadorFaturamentoTool() {
  const [faturamentoMensal, setFaturamentoMensal] = useState<number[]>(Array(12).fill(0));
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());

  const totalAcumulado = faturamentoMensal.reduce((a, b) => a + b, 0);
  const percentualUsado = (totalAcumulado / LIMITE_ANUAL) * 100;
  const mesesRestantes = 12 - mesAtual - 1;
  const mediaMensal = mesAtual >= 0 ? totalAcumulado / (mesAtual + 1) : 0;
  const projetadoAnual = mediaMensal * 12;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusColor = (perc: number) => {
    if (perc >= 100) return 'var(--color-red)';
    if (perc >= 80) return 'var(--color-orange)';
    if (perc >= 60) return 'var(--color-yellow)';
    return 'var(--color-green)';
  };

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/ferramentas" className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-6`}>
            ← Voltar às Ferramentas
          </Link>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Calculadora MEI
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic`}>
            Verificador de Faturamento
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Acompanhe seu faturamento mensal vs limite anual de R$ 81.000.
          </p>
        </div>

        {/* STATUS CARD */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Status Atual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Acumulado no Ano
              </span>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-text-primary)]`}>
                {formatCurrency(totalAcumulado)}
              </div>
            </div>

            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Limite Anual
              </span>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-blue-light)]`}>
                {formatCurrency(LIMITE_ANUAL)}
              </div>
            </div>

            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Utilizado
              </span>
              <div className={`${playfair.className} text-3xl font-black`} style={{ color: getStatusColor(percentualUsado) }}>
                {percentualUsado.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--color-text-tertiary)]">0%</span>
              <span className="text-[var(--color-text-tertiary)]">100%</span>
            </div>
            <div className="h-4 bg-[var(--color-black)] rounded-full border border-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(percentualUsado, 100)}%`,
                  backgroundColor: getStatusColor(percentualUsado),
                }}
              />
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-2 text-center">
              {percentualUsado >= 100
                ? '⚠️ Limite ultrapassado! Risco de desenquadramento.'
                : percentualUsado >= 80
                ? '⚠️ Atenção: acima de 80% do limite. Planeje seus próximos meses.'
                : '✅ Dentro do limite seguro.'}
            </p>
          </div>

          {/* PROJECTION */}
          <div className="p-6 bg-[var(--color-blue)]/5 border border-[var(--color-blue)]/20 rounded-[var(--radius-xl)]">
            <h3 className="font-bold text-[var(--color-blue-light)] mb-4 flex items-center gap-2">
              <TopicIcon name="chart" className="w-5 h-5" />
              Projeção Anual (baseada na média atual)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-1`}>
                  Média Mensal
                </span>
                <div className={`${playfair.className} text-2xl font-black text-[var(--color-text-primary)]`}>
                  {formatCurrency(mediaMensal)}
                </div>
              </div>
              <div>
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-1`}>
                  Projetado Anual
                </span>
                <div className={`${playfair.className} text-2xl font-black`} style={{ color: projetadoAnual > LIMITE_ANUAL ? 'var(--color-red)' : 'var(--color-green-light)' }}>
                  {formatCurrency(projetadoAnual)}
                </div>
              </div>
              <div>
                <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-1`}>
                  Margem Restante
                </span>
                <div className={`${playfair.className} text-2xl font-black`} style={{ color: totalAcumulado > LIMITE_ANUAL ? 'var(--color-red)' : 'var(--color-green-light)' }}>
                  {formatCurrency(Math.max(0, LIMITE_ANUAL - totalAcumulado))}
                </div>
              </div>
            </div>
            {projetadoAnual > LIMITE_ANUAL && (
              <p className="text-[var(--color-red)] text-sm mt-4 text-center">
                ⚠️ Sua média projeta ultrapassagem do limite. Considere reduzir faturamento ou planejar desenquadramento para ME.
              </p>
            )}
          </div>
        </section>

        {/* INPUT FORM */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Lançar Faturamento Mensal
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {meses.map((mes, index) => (
              <div key={mes} className={`p-4 rounded-[var(--radius-lg)] border-2 transition-all ${
                index <= mesAtual
                  ? 'border-[var(--color-border)] bg-[var(--color-black)]'
                  : 'border-[var(--color-border)]/30 bg-[var(--color-black)]/50 opacity-50'
              }`}>
                <label className="block text-center mb-2">
                  <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                    {mes}
                  </span>
                </label>
                <input
                  type="number"
                  value={faturamentoMensal[index]}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    const newArr = [...faturamentoMensal];
                    newArr[index] = val;
                    setFaturamentoMensal(newArr);
                  }}
                  min="0"
                  step="0.01"
                  disabled={index > mesAtual}
                  className="w-full input-premium text-center text-lg font-bold"
                  placeholder="0,00"
                />
                {index <= mesAtual && faturamentoMensal[index] > 0 && (
                  <span className={`${mono.className} text-[10px] text-[var(--color-green-light)] text-center block mt-1`}>
                    {formatCurrency(faturamentoMensal[index])}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <label className="block mb-4">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                Mês de Referência Atual
              </span>
              <select
                value={mesAtual}
                onChange={(e) => setMesAtual(Number(e.target.value))}
                className="mt-2 w-full md:w-48 input-premium"
              >
                {meses.map((mes, index) => (
                  <option key={mes} value={index}>{mes}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* TOLERANCE INFO */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Regra de Tolerância (20%)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-xl)]">
              <h3 className="font-bold text-[var(--color-green-light)] mb-3 flex items-center gap-2">
                <TopicIcon name="check" className="w-5 h-5" />
                Até 20% acima do limite
              </h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                <li className="flex items-start gap-2">• Faturamento até <strong>R$ 97.200</strong> (R$ 81.000 + 20%)</li>
                <li className="flex items-start gap-2">• Permanece como MEI no ano corrente</li>
                <li className="flex items-start gap-2">• Deve desenquadrar no ano seguinte</li>
                <li className="flex items-start gap-2">• Pagamento de DAS complementar sobre o excedente</li>
              </ul>
            </div>

            <div className="p-6 bg-[var(--color-red)]/5 border border-[var(--color-red)]/20 rounded-[var(--radius-xl)]">
              <h3 className="font-bold text-[var(--color-red-light)] mb-3 flex items-center gap-2">
                <TopicIcon name="alert" className="w-5 h-5" />
                Acima de 20% do limite
              </h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                <li className="flex items-start gap-2">• Faturamento acima de <strong>R$ 97.200</strong></li>
                <li className="flex items-start gap-2">• Desenquadramento <strong>retroativo a janeiro</strong> do ano corrente</li>
                <li className="flex items-start gap-2">• Recolhimento de todos os tributos como ME (Simples Nacional)</li>
                <li className="flex items-start gap-2">• Multas e juros sobre diferenças</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-[var(--color-border)]">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em]`}>
            Ferramenta de apoio ao controle gerencial. Não substitui escrituração contábil oficial.
            Consulte seu contador para apuração formal.
          </p>
        </div>
      </div>
    </div>
  );
}