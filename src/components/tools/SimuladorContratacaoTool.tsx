'use client';

import { useState } from 'react';
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import { TopicIcon } from '@/components/ui/TopicIcon';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

// 2026 Values
const SALARIO_MINIMO_2026 = 1518;
const INSS_PATRONAL_ALIQUOTA = 0.08; // 8%
const FGTS_ALIQUOTA = 0.08; // 8%
const FERIAS_PROVISAO = 1/12; // 1/12 do salário (8.33%)
const DECIMAO_TERCEIRO_PROVISAO = 1/12; // 1/12 do salário (8.33%)
const RAT_ALIQUOTA = 0.01; // 1% (risco ambiental do trabalho - varia, usamos 1% base)
const SEGURO_ACIDENTE = 0; // Separado, obrigatório para MEI com funcionário

export default function SimuladorContratacaoTool() {
  const [salarioBase, setSalarioBase] = useState(SALARIO_MINIMO_2026);
  const [usarSalarioMinimo, setUsarSalarioMinimo] = useState(true);
  const [incluirFerias, setIncluirFerias] = useState(true);
  const [incluirDecimoTerceiro, setIncluirDecimoTerceiro] = useState(true);
  const [incluirRat, setIncluirRat] = useState(true);
  const [mesesTrabalhados, setMesesTrabalhados] = useState(12);

  const inssPatronal = salarioBase * INSS_PATRONAL_ALIQUOTA;
  const fgts = salarioBase * FGTS_ALIQUOTA;
  const ferias = incluirFerias ? salarioBase * FERIAS_PROVISAO : 0;
  const decimoTerceiro = incluirDecimoTerceiro ? salarioBase * DECIMAO_TERCEIRO_PROVISAO : 0;
  const rat = incluirRat ? salarioBase * RAT_ALIQUOTA : 0;
  
  const custoMensal = salarioBase + inssPatronal + fgts + ferias + decimoTerceiro + rat;
  const custoAnual = custoMensal * 12;
  const custoPrimeiroAno = custoAnual; // Simplificação

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);
  };

  return (
    <div className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/ferramentas" className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-6`}>
            ← Voltar às Ferramentas
          </Link>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Simulador MEI
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic`}>
            Simulador de Contratação
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Simule o custo total de contratar 1 funcionário CLT pelo MEI.
            Inclui encargos obrigatórios e provisões.
          </p>
        </div>

        {/* INPUT SECTION */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Parâmetros da Contratação
          </h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={usarSalarioMinimo}
                  onChange={(e) => setUsarSalarioMinimo(e.target.checked)}
                  className="w-5 h-5 accent-[var(--color-blue)]"
                />
                <span className="font-bold text-[var(--color-text-primary)]">
                  Usar Salário-Mínimo 2026 ({formatCurrency(SALARIO_MINIMO_2026)})
                </span>
              </label>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${usarSalarioMinimo ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block mb-2">
                  <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                    Salário Base Mensal
                  </span>
                </label>
                <input
                  type="number"
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(Math.max(SALARIO_MINIMO_2026, Number(e.target.value) || SALARIO_MINIMO_2026))}
                  min={SALARIO_MINIMO_2026}
                  max={20000}
                  step="100"
                  disabled={usarSalarioMinimo}
                  className="w-full input-premium text-lg font-bold"
                />
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                  Mínimo: {formatCurrency(SALARIO_MINIMO_2026)} (salário-mínimo ou piso da categoria)
                </p>
              </div>

              <div>
                <label className="block mb-2">
                  <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]`}>
                    Meses no Ano (para provisões)
                  </span>
                </label>
                <select
                  value={mesesTrabalhados}
                  onChange={(e) => setMesesTrabalhados(Number(e.target.value))}
                  className="w-full input-premium"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                    <option key={m} value={m}>{m} mês{m > 1 ? 'es' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--color-border)]">
              <h3 className={`${mono.className} text-[10px] font-black uppercase tracking-widest mb-4 text-[var(--color-text-tertiary)]`}>
                Provisões e Encargos Incluídos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:bg-[var(--color-blue)]/5 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={incluirFerias}
                    onChange={(e) => setIncluirFerias(e.target.checked)}
                    className="w-5 h-5 accent-[var(--color-green)]"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    <strong>Férias + 1/3</strong> (provisão 1/12 do salário/mês)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:bg-[var(--color-blue)]/5 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={incluirDecimoTerceiro}
                    onChange={(e) => setIncluirDecimoTerceiro(e.target.checked)}
                    className="w-5 h-5 accent-[var(--color-green)]"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    <strong>13º Salário</strong> (provisão 1/12 do salário/mês)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:bg-[var(--color-blue)]/5 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={incluirRat}
                    onChange={(e) => setIncluirRat(e.target.checked)}
                    className="w-5 h-5 accent-[var(--color-green)]"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    <strong>RAT/SAT</strong> (1% - risco ambiental do trabalho)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-orange)]/5 border-[var(--color-orange)]/30 cursor-pointer transition-colors">
                  <span className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[var(--color-orange-light)] text-sm">
                    <strong>Seguro Acidente Pessoal</strong> (obrigatório, cotação à parte)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Custo Total Estimado
          </h2>

          {/* MONTHLY BREAKDOWN */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] pb-3`}>
                    Componente
                  </th>
                  <th className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] pb-3 text-right`}>
                    Mensal
                  </th>
                  <th className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] pb-3 text-right`}>
                    Anual (12 meses)
                  </th>
                  <th className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] pb-3 text-right`}>
                    % do Salário
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50">
                <tr className="py-3">
                  <td className="font-bold text-[var(--color-text-primary)]">Salário Base</td>
                  <td className="text-right text-[var(--color-text-primary)]">{formatCurrency(salarioBase)}</td>
                  <td className="text-right text-[var(--color-text-primary)]">{formatCurrency(salarioBase * 12)}</td>
                  <td className="text-right text-[var(--color-text-tertiary)]">100%</td>
                </tr>
                <tr className="py-3">
                  <td className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <TopicIcon name="user" className="w-4 h-4" style={{ color: 'var(--color-blue-light)' }} />
                    INSS Patronal (8%)
                  </td>
                  <td className="text-right text-[var(--color-blue-light)]">{formatCurrency(inssPatronal)}</td>
                  <td className="text-right text-[var(--color-blue-light)]">{formatCurrency(inssPatronal * 12)}</td>
                  <td className="text-right text-[var(--color-text-tertiary)]">8.0%</td>
                </tr>
                <tr className="py-3">
                  <td className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <TopicIcon name="bank" className="w-4 h-4" style={{ color: 'var(--color-green-light)' }} />
                    FGTS (8%)
                  </td>
                  <td className="text-right text-[var(--color-green-light)]">{formatCurrency(fgts)}</td>
                  <td className="text-right text-[var(--color-green-light)]">{formatCurrency(fgts * 12)}</td>
                  <td className="text-right text-[var(--color-text-tertiary)]">8.0%</td>
                </tr>
                {incluirFerias && (
                  <tr className="py-3">
                    <td className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <TopicIcon name="calendar" className="w-4 h-4" style={{ color: 'var(--color-orange-light)' }} />
                      Férias + 1/3 (1/12)
                    </td>
                    <td className="text-right text-[var(--color-orange-light)]">{formatCurrency(ferias)}</td>
                    <td className="text-right text-[var(--color-orange-light)]">{formatCurrency(ferias * 12)}</td>
                    <td className="text-right text-[var(--color-text-tertiary)]">8.3%</td>
                  </tr>
                )}
                {incluirDecimoTerceiro && (
                  <tr className="py-3">
                    <td className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <TopicIcon name="gift" className="w-4 h-4" style={{ color: 'var(--color-purple-light)' }} />
                      13º Salário (1/12)
                    </td>
                    <td className="text-right text-[var(--color-purple-light)]">{formatCurrency(decimoTerceiro)}</td>
                    <td className="text-right text-[var(--color-purple-light)]">{formatCurrency(decimoTerceiro * 12)}</td>
                    <td className="text-right text-[var(--color-text-tertiary)]">8.3%</td>
                  </tr>
                )}
                {incluirRat && (
                  <tr className="py-3">
                    <td className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <TopicIcon name="alert" className="w-4 h-4" style={{ color: 'var(--color-red-light)' }} />
                      RAT/SAT (1%)
                    </td>
                    <td className="text-right text-[var(--color-red-light)]">{formatCurrency(rat)}</td>
                    <td className="text-right text-[var(--color-red-light)]">{formatCurrency(rat * 12)}</td>
                    <td className="text-right text-[var(--color-text-tertiary)]">1.0%</td>
                  </tr>
                )}
                <tr className="py-3 bg-[var(--color-black)]">
                  <td className="font-bold text-[var(--color-text-primary)]">Total Encargos Mensais</td>
                  <td className="text-right font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(inssPatronal + fgts + ferias + decimoTerceiro + rat)}
                  </td>
                  <td className="text-right font-bold text-[var(--color-text-primary)]">
                    {formatCurrency((inssPatronal + fgts + ferias + decimoTerceiro + rat) * 12)}
                  </td>
                  <td className="text-right font-bold text-[var(--color-text-tertiary)]">
                    {formatPercent((inssPatronal + fgts + ferias + decimoTerceiro + rat) / salarioBase)}
                  </td>
                </tr>
                <tr className="py-3 bg-gradient-to-r from-[var(--color-blue)]/10 to-[var(--color-purple)]/10">
                  <td className={`${playfair.className} font-black text-[var(--color-text-primary)]`}>CUSTO TOTAL MENSAL</td>
                  <td className="text-right">
                    <span className={`${playfair.className} text-2xl font-black text-[var(--color-text-primary)]`}>
                      {formatCurrency(custoMensal)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`${playfair.className} text-xl font-black text-[var(--color-text-primary)]`}>
                      {formatCurrency(custoAnual)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`${playfair.className} font-black`} style={{ color: 'var(--color-green-light)' }}>
                      {formatPercent(custoMensal / salarioBase)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Custo Mensal
              </span>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-text-primary)]`}>
                {formatCurrency(custoMensal)}
              </div>
              <p className="text-[var(--color-text-tertiary)] text-sm mt-1">
                {formatPercent(custoMensal / salarioBase)} do salário
              </p>
            </div>

            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Custo Anual (12 meses)
              </span>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-blue-light)]`}>
                {formatCurrency(custoAnual)}
              </div>
            </div>

            <div className="p-6 bg-[var(--color-black)] rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center">
              <span className={`${mono.className} text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] block mb-2`}>
                Encargos / Salário
              </span>
              <div className={`${playfair.className} text-3xl font-black text-[var(--color-green-light)]`}>
                {formatPercent((custoMensal - salarioBase) / salarioBase)}
              </div>
              <p className="text-[var(--color-text-tertiary)] text-sm mt-1">
                A cada R$ 1 de salário, ~R$ {(custoMensal / salarioBase).toFixed(2)} de custo total
              </p>
            </div>
          </div>

          {/* CAIXA NECESSÁRIO */}
          <div className="p-6 bg-[var(--color-orange)]/5 border border-[var(--color-orange)]/20 rounded-[var(--radius-xl)]">
            <h3 className="font-bold text-[var(--color-orange-light)] mb-4 flex items-center gap-2">
              <TopicIcon name="alert" className="w-5 h-5" />
              Caixa Necessário no Primeiro Mês
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Salário do 1º mês</span>
                  <span className="font-bold">{formatCurrency(salarioBase)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Encargos do 1º mês</span>
                  <span className="font-bold">{formatCurrency(inssPatronal + fgts + ferias + decimoTerceiro + rat)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Exame Admissional (estimado)</span>
                  <span className="font-bold">~R$ 100-200</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Seguro Acidente (cotação)</span>
                  <span className="font-bold">~R$ 50-150/mês</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex justify-between border-t border-[var(--color-orange)]/30 pt-3">
                  <span className="font-bold text-[var(--color-orange-light)]">Total Estimado Inicial</span>
                  <span className="font-bold text-[var(--color-orange-light)] text-lg">
                    {formatCurrency(custoMensal + 150 + 100)}
                  </span>
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  Valores aproximados. Consulte contador para valores exatos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INFO */}
        <section className="card-elevated p-8 mb-8" data-animate>
          <h2 className={`${playfair.className} text-2xl font-black uppercase italic mb-6`}>
            Regras Importantes para MEI Contratar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-xl)]">
              <h3 className="font-bold text-[var(--color-green-light)] mb-4 flex items-center gap-2">
                <TopicIcon name="check" className="w-5 h-5" />
                O que é Permitido
              </h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                <li className="flex items-start gap-2">• <strong>1 (um) funcionário</strong> com carteira assinada</li>
                <li className="flex items-start gap-2">• Salário = <strong>1 salário-mínimo</strong> ou piso da categoria</li>
                <li className="flex items-start gap-2">• Registro no <strong>eSocial</strong> obrigatório</li>
                <li className="flex items-start gap-2">• Jornada: 44h semanais (8h/dia + 4h sábado) ou 12x36</li>
              </ul>
            </div>

            <div className="p-6 bg-[var(--color-red)]/5 border border-[var(--color-red)]/20 rounded-[var(--radius-xl)]">
              <h3 className="font-bold text-[var(--color-red-light)] mb-4 flex items-center gap-2">
                <TopicIcon name="x" className="w-5 h-5" />
                O que NÃO é Permitido
              </h3>
              <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                <li className="flex items-start gap-2">• Contratar <strong>mais de 1 funcionário</strong></li>
                <li className="flex items-start gap-2">• Pagar <strong>acima do piso</strong> da categoria</li>
                <li className="flex items-start gap-2">• Contratar <strong>menor aprendiz</strong> ou estagiário</li>
                <li className="flex items-start gap-2">• Funcionário <strong>sócio de outra empresa</strong></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-6 bg-[var(--color-blue)]/5 border border-[var(--color-blue)]/20 rounded-[var(--radius-xl)]">
            <h3 className="font-bold text-[var(--color-blue-light)] mb-4 flex items-center gap-2">
              <TopicIcon name="info" className="w-5 h-5" />
              Obrigações Extras ao Contratar
            </h3>
            <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
              <li>• <strong>eSocial:</strong> Cadastrar admissão, folha, férias, 13º, demissão</li>
              <li>• <strong>GFIP/SEFIP:</strong> Recolhimento FGTS mensal (guia GRRF/GRDE)</li>
              <li>• <strong>DIRF:</strong> Declaração de IR retido na fonte (anual)</li>
              <li>• <strong>CAGED:</strong> Comunicação de admissão/demissão (via eSocial)</li>
              <li>• <strong>Exames:</strong> Admissional, periódico, demissional (PCMSO)</li>
              <li>• <strong>Seguro Acidente:</strong> Obrigatório (Lei 8.213/91) - contratar seguradora</li>
            </ul>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-[var(--color-border)]">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em]`}>
            Simulador baseado na legislação trabalhista e previdenciária vigente (CLT, LC 123/2006).
            Valores de 2026. Não substitui assessoria contábil/trabalhista especializada.
          </p>
        </div>
      </div>
    </div>
  );
}