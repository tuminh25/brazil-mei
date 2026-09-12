// src/app/ferramentas/[slug]/page.tsx
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const toolComponents: Record<string, React.ComponentType<any>> = {
  'calculadora-das': dynamic(() => import('@/components/tools/CalculadoraDasTool')),
  'verificador-faturamento': dynamic(() => import('@/components/tools/VerificadorFaturamentoTool')),
  'checklist-obrigacoes': dynamic(() => import('@/components/tools/ChecklistObrigacoesTool')),
  'simulador-contratacao': dynamic(() => import('@/components/tools/SimuladorContratacaoTool')),
};

const toolMeta: Record<string, { title: string; description: string }> = {
  'calculadora-das': {
    title: 'Calculadora DAS MEI 2026',
    description: 'Calcule o valor exato do seu DAS mensal: INSS 5% salário-mínimo + ICMS (comércio/indústria) ou ISS (serviços).',
  },
  'verificador-faturamento': {
    title: 'Verificador de Faturamento MEI',
    description: 'Acompanhe seu faturamento mensal vs limite anual de R$ 81.000. Alertas automáticos.',
  },
  'checklist-obrigacoes': {
    title: 'Checklist Obrigações Mensais MEI',
    description: 'Lista completa do que fazer todo mês: pagar DAS, emitir notas, guardar documentos, controlar faturamento.',
  },
  'simulador-contratacao': {
    title: 'Simulador de Contratação MEI',
    description: 'Simule o custo total de contratar 1 funcionário: salário + INSS + FGTS + férias + 13º + seguro acidente.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = toolMeta[slug];
  if (!meta) return { title: 'Ferramenta Não Encontrada | Brazil MEI' };
  return {
    title: `${meta.title} | Brazil MEI`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Brazil MEI`,
      description: meta.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Tool = toolComponents[slug];
  if (!Tool) redirect("/ferramentas");
  return <Tool />;
}