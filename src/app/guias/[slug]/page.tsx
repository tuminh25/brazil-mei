// src/app/guias/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import Link from "next/link";
import Image from 'next/image';
import type { Metadata } from "next";
import { TopicIcon } from '@/components/ui/TopicIcon';
import { ArrowRightIcon } from '@/components/ui/Icons';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

const staticGuides: Record<string, {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: { name: string; avatarUrl: string | null; bio?: string };
  createdAt: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
}> = {
  'o-que-e-das-mei-como-pagar': {
    id: 1,
    slug: 'o-que-e-das-mei-como-pagar',
    title: 'O que é DAS MEI e como pagar em 2026',
    excerpt: 'Guia completo sobre o Documento de Arrecadação do Simples Nacional para MEI: valores, vencimentos, formas de pagamento e o que acontece se atrasar.',
    content: `
      <h2>O que é o DAS MEI</h2>
      <p>O DAS MEI (Documento de Arrecadação do Simples Nacional) é a guia única de pagamento dos tributos do Microempreendedor Individual. Ele reúne em um único boleto:</p>
      <ul>
        <li><strong>INSS (5% do salário-mínimo):</strong> Garante cobertura previdenciária (aposentadoria, auxílio-doença, salário-maternidade)</li>
        <li><strong>ICMS (R$ 1,00):</strong> Para atividades de comércio e indústria</li>
        <li><strong>ISS (R$ 5,00):</strong> Para atividades de serviços</li>
      </ul>
      <h2>Valores 2026</h2>
      <p>Com o salário-mínimo de R$ 1.518,00 em 2026:</p>
      <ul>
        <li>Comércio/Indústria: R$ 76,90 (INSS 5% = R$ 75,90 + ICMS R$ 1,00)</li>
        <li>Serviços: R$ 80,90 (INSS 5% = R$ 75,90 + ISS R$ 5,00)</li>
        <li>Comércio e Serviços: R$ 81,90 (INSS 5% = R$ 75,90 + ICMS R$ 1,00 + ISS R$ 5,00)</li>
      </ul>
      <h2>Vencimento e Pagamento</h2>
      <ul>
        <li>Vencimento: <strong>dia 20 de cada mês</strong> (próximo dia útil se feriado/fim de semana)</li>
        <li>Formas: PIX, boleto bancário ou débito automático</li>
        <li>Emissão: <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank" rel="noopener noreferrer">Portal do Empreendedor</a> ou app MEI</li>
      </ul>
      <h2>Atraso e Multa</h2>
      <ul>
        <li>Multa: 0,33% ao dia (máx. 20%) + juros Selic</li>
        <li>Mínimo: R$ 10,00</li>
        <li>Após 90 dias: inscrição em Dívida Ativa da União</li>
      </ul>
      <h2>Benefícios do Pagamento em Dia</h2>
      <ul>
        <li>Cobertura previdenciária completa</li>
        <li>Manutenção da regularidade do CNPJ</li>
        <li>Acesso a linhas de crédito (BNDES, Pronampe)</li>
        <li>Evita bloqueio de emissão de nota fiscal</li>
      </ul>
    `,
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-15',
    tags: ['DAS', 'pagamento', 'tributos', '2026'],
    metaTitle: 'DAS MEI 2026: Valor, Vencimento e Como Pagar | Brazil MEI',
    metaDescription: 'Guia completo sobre DAS MEI 2026: valores atualizados, data de vencimento, formas de pagamento (PIX, boleto, débito automático) e consequências do atraso.',
  },
  'limite-faturamento-mei-2026': {
    id: 2,
    slug: 'limite-faturamento-mei-2026',
    title: 'Limite de faturamento MEI 2026: R$ 81.000 e o que muda',
    excerpt: 'Entenda o teto de faturamento anual do MEI, como calcular seu faturamento mensal, o que acontece se ultrapassar e as regras de desenquadramento.',
    content: `
      <h2>Limite Anual 2026</h2>
      <p>O limite de faturamento do MEI para 2026 é de <strong>R$ 81.000,00 por ano</strong>.</p>
      <h2>Controle Mensal</h2>
      <p>A média mensal é de <strong>R$ 6.750,00</strong> (81.000 ÷ 12). Porém, não há limite mensal rígido — o controle é anual.</p>
      <h2>Regra de Tolerância (20%)</h2>
      <ul>
        <li>Até R$ 97.200 (R$ 81.000 + 20%): Permanece como MEI no ano corrente, mas deve desenquadrar no ano seguinte</li>
        <li>Acima de R$ 97.200: Desenquadramento retroativo a janeiro do ano corrente</li>
      </ul>
      <h2>Desenquadramento e Transição para ME</h2>
      <p>Se ultrapassar o limite, deve solicitar desenquadramento e migrar para Microempresa (ME) no Simples Nacional.</p>
    `,
    category: 'MEI_FATURAMENTO',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-10',
    tags: ['faturamento', 'limite', 'desenquadramento', '2026'],
    metaTitle: 'Limite Faturamento MEI 2026: R$ 81.000 | Brazil MEI',
    metaDescription: 'Teto de faturamento MEI 2026 é R$ 81.000/ano. Saiba como calcular, o que acontece se ultrapassar, regras de desenquadramento e transição para ME.',
  },
  'dasn-simei-2026-passo-a-passo': {
    id: 3,
    slug: 'dasn-simei-2026-passo-a-passo',
    title: 'DASN-SIMEI 2026: Passo a passo para declarar',
    excerpt: 'Como fazer a Declaração Anual do Simples Nacional do MEI (DASN-SIMEI): prazo, documentos necessários, como preencher e evitar multa.',
    content: `
      <h2>O que é a DASN-SIMEI</h2>
      <p>A DASN-SIMEI é a Declaração Anual do Simples Nacional do MEI. Obrigatória para todos os MEIs ativos.</p>
      <h2>Prazo 2026</h2>
      <p><strong>Até 31 de maio de 2026</strong> (referente ao ano-calendário 2025).</p>
      <h2>Como Declarar</h2>
      <ol>
        <li>Acesse o <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank">Portal do Empreendedor</a></li>
        <li>Clique em "Já sou MEI" → "Declaração Anual de Faturamento"</li>
        <li>Informe o faturamento bruto total do ano anterior</li>
        <li>Confira os dados e transmita</li>
      </ol>
      <h2>Multa por Atraso</h2>
      <ul>
        <li>Mínimo: R$ 50,00</li>
        <li>2% ao mês sobre os tributos declarados (máx. 20%)</li>
      </ol>
      <h2>Retificação</h2>
      <p>Se errou, pode retificar quantas vezes precisar até 5 anos após o prazo original.</p>
    `,
    category: 'DASN_SIMEI',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-05',
    tags: ['DASN-SIMEI', 'declaração anual', 'prazo', '2026'],
    metaTitle: 'DASN-SIMEI 2026: Como Declarar, Prazo e Multa | Brazil MEI',
    metaDescription: 'Guia completo da DASN-SIMEI 2026: passo a passo para declarar, prazo até 31/05, documentos necessários, valor da multa por atraso e como retificar.',
  },
  'nota-fiscal-mei-obrigatoriedade-como-emitir': {
    id: 4,
    slug: 'nota-fiscal-mei-obrigatoriedade-como-emitir',
    title: 'Nota Fiscal MEI: Quando é obrigatória e como emitir grátis',
    excerpt: 'Entenda quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e gratuitamente nos portais estaduais/municipais e erros comuns a evitar.',
    content: `
      <h2>Quando o MEI deve emitir Nota Fiscal</h2>
      <ul>
        <li><strong>Obrigatório:</strong> Vendas para outras empresas (PJ)</li>
        <li><strong>Opcional:</strong> Vendas para consumidor final (PF) — mas recomendado</li>
      </ul>
      <h2>NF-e vs NFS-e</h2>
      <ul>
        <li><strong>NF-e:</strong> Comércio e indústria — emitida no portal da SEFAZ estadual</li>
        <li><strong>NFS-e:</strong> Serviços — emitida no portal da prefeitura municipal</li>
      </ul>
      <h2>Emissão Gratuita</h2>
      <ul>
        <li>NF-e: Portal da SEFAZ do seu estado</li>
        <li>NFS-e: Portal da prefeitura do seu município</li>
        <li>Não pague por sistemas de emissão — use os portais oficiais</li>
      </ul>
      <h2>Erros Comuns</h2>
      <ul>
        <li>Não emitir para PJ (multa e impedimento de crédito)</li>
        <li>Emitir com CFOP errado</li>
        <li>Não guardar XML/DANFE por 5 anos</li>
      </ul>
    `,
    category: 'NOTA_FISCAL',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-01',
    tags: ['nota fiscal', 'NF-e', 'NFS-e', 'emissão gratuita'],
    metaTitle: 'Nota Fiscal MEI 2026: Obrigatoriedade e Emissão Gratuita | Brazil MEI',
    metaDescription: 'Quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e grátis, diferença entre elas, erros comuns e penalidades por não emitir.',
  },
  'obrigacoes-mensais-mei-checklist': {
    id: 5,
    slug: 'obrigacoes-mensais-mei-checklist',
    title: 'Obrigações mensais do MEI: Checklist completo 2026',
    excerpt: 'Tudo que o MEI deve fazer todo mês: pagar DAS, emitir notas, guardar documentos, controlar faturamento. Checklist para não esquecer nada.',
    content: `
      <h2>Checklist Mensal do MEI</h2>
      <h3>Obrigatório todo mês:</h3>
      <ul>
        <li>☐ Pagar DAS até dia 20 (PIX, boleto ou débito automático)</li>
        <li>☐ Emitir notas fiscais nas vendas para PJ</li>
        <li>☐ Controlar faturamento (não ultrapassar R$ 81.000/ano)</li>
        <li>☐ Guardar documentos (notas, comprovantes, extratos) por 5 anos</li>
        <li>☐ Movimentar conta PJ separada da pessoal</li>
      </ul>
      <h3>Anual (até 31/05):</h3>
      <ul>
        <li>☐ Entregar DASN-SIMEI (declaração anual de faturamento)</li>
      </ul>
      <h3>Se tem funcionário:</h3>
      <ul>
        <li>☐ eSocial: admissão, férias, 13º, demissão</li>
        <li>☐ FGTS mensal (guia GRRF/GRDE)</li>
        <li>☐ Exames admissionais/periódicos/demissionais</li>
        <li>☐ Seguro acidente de trabalho (obrigatório)</li>
      </ul>
    `,
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-28',
    tags: ['obrigações', 'checklist', 'mensal', 'compliance'],
    metaTitle: 'Obrigações Mensais MEI 2026: Checklist Completo | Brazil MEI',
    metaDescription: 'Checklist completo das obrigações mensais do MEI: pagamento DAS, emissão de notas, controle de faturamento, guarda de documentos e declarações anuais.',
  },
  'como-abrir-mei-2026-passo-a-passo': {
    id: 6,
    slug: 'como-abrir-mei-2026-passo-a-passo',
    title: 'Como abrir MEI em 2026: Passo a passo gratuito no Gov.br',
    excerpt: 'Guia completo para formalizar seu MEI grátis pelo Portal do Empreendedor: documentos, CNAEs permitidos, tempo de aprovação e primeiros passos depois do CNPJ.',
    content: `
      <h2>Pré-requisitos</h2>
      <ul>
        <li>Maior de 18 anos (ou 16-18 emancipado)</li>
        <li>Não ser sócio/admin de outra empresa</li>
        <li>Atividade permitida na lista de CNAEs do MEI</li>
        <li>Faturamento dentro do limite (R$ 81.000/ano)</li>
      </ul>
      <h2>Documentos Necessários</h2>
      <ul>
        <li>CPF</li>
        <li>Título de Eleitor</li>
        <li>Comprovante de endereço</li>
        <li>Celular e e-mail para cadastro Gov.br</li>
      </ul>
      <h2>Passo a Passo (100% Online e Gratuito)</h2>
      <ol>
        <li>Acesse <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedorismo/mei" target="_blank">gov.br/empresas-e-negocios</a></li>
        <li>Clique em "Formalize-se"</li>
        <li>Login Gov.br (ou crie sua conta)</li>
        <li>Preencha dados pessoais e da atividade (CNAE)</li>
        <li>Receba CNPJ na hora</li>
      </ul>
      <h2>Depois do CNPJ</h2>
      <ul>
        <li>Inscrição Estadual (se comércio/indústria) — SEFAZ do estado</li>
        <li>Inscrição Municipal (se serviços) — Prefeitura</li>
        <li>Alvará de funcionamento (se necessário)</li>
        <li>Abra conta bancária PJ</li>
        <li>Configure emissão de nota fiscal (NF-e/NFS-e)</li>
      </ul>
      <p><strong>⚠️ Cuidado:</strong> Não pague por "abertura de MEI" em sites terceiros. O processo oficial é <strong>gratuito</strong>.</p>
    `,
    category: 'MEI_CADASTRO',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-20',
    tags: ['abrir MEI', 'formalização', 'CNPJ', 'Gov.br', '2026'],
    metaTitle: 'Como Abrir MEI 2026: Passo a Passo Gratuito | Brazil MEI',
    metaDescription: 'Como abrir MEI grátis em 2026: passo a passo no Portal do Empreendedor, documentos necessários, CNAEs permitidos, tempo de aprovação e o que fazer após obter o CNPJ.',
  },
  'mei-pode-contratar-funcionario-regras-2026': {
    id: 7,
    slug: 'mei-pode-contratar-funcionario-regras-2026',
    title: 'MEI pode contratar funcionário? Regras, custos e como fazer em 2026',
    excerpt: 'Sim, MEI pode contratar 1 funcionário. Entenda as regras, custos totais (salário + encargos), como registrar no eSocial e obrigações trabalhistas.',
    content: `
      <h2>Regras Básicas</h2>
      <ul>
        <li>MEI pode contratar <strong>1 (um) funcionário</strong> com carteira assinada</li>
        <li>Salário = <strong>1 salário-mínimo</strong> (R$ 1.518 em 2026) ou piso da categoria</li>
        <li>Registro no <strong>eSocial</strong> obrigatório</li>
        <li>Não pode contratar menor aprendiz ou estagiário</li>
      </ul>
      <h2>Custos Mensais Estimados (2026)</h2>
      <ul>
        <li>Salário-base: R$ 1.518,00</li>
        <li>INSS Patronal (8%): R$ 121,44</li>
        <li>FGTS (8%): R$ 121,44</li>
        <li>Férias + 1/3 (provisão 1/12): R$ 126,50</li>
        <li>13º Salário (provisão 1/12): R$ 126,50</li>
        <li>RAT/SAT (1%): R$ 15,18</li>
        <li><strong>Total encargos/mês: ~R$ 511,06</strong></li>
        <li><strong>Custo total/mês: ~R$ 2.029,06</strong></li>
      </ul>
      <h2>Obrigações Extras</h2>
      <ul>
        <li>eSocial: admissão, folha, férias, 13º, demissão</li>
        <li>FGTS mensal (guia GRRF/GRDE)</li>
        <li>DIRF: declaração de IR retido na fonte (anual)</li>
        <li>Exames: admissionais, periódicos, demissionais (PCMSO)</li>
        <li>Seguro Acidente: obrigatório (Lei 8.213/91)</li>
      </ul>
    `,
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-15',
    tags: ['contratação', 'funcionário', 'eSocial', 'encargos', '2026'],
    metaTitle: 'MEI Pode Contratar Funcionário 2026: Regras e Custos | Brazil MEI',
    metaDescription: 'MEI pode contratar 1 funcionário. Veja regras, custos totais (salário + INSS + FGTS + outros), como registrar no eSocial e obrigações trabalhistas mensais/anuais.',
  },
  'calculadora-das-mei-2026': {
    id: 8,
    slug: 'calculadora-das-mei-2026',
    title: 'Calculadora DAS MEI 2026: Simule seu pagamento mensal',
    excerpt: 'Ferramenta gratuita para calcular o valor exato do seu DAS MEI em 2026: INSS + ICMS/ISS conforme sua atividade. Valores oficiais atualizados.',
    content: `
      <h2>Como funciona a Calculadora DAS MEI</h2>
      <p>Insira sua atividade (comércio, indústria, serviços ou mista) e veja o valor exato do DAS mensal.</p>
      <h2>Valores de Referência 2026</h2>
      <ul>
        <li>Salário-mínimo: R$ 1.518,00</li>
        <li>INSS (5%): R$ 75,90</li>
        <li>ICMS (comércio/indústria): R$ 1,00</li>
        <li>ISS (serviços): R$ 5,00</li>
      </ul>
      <h2>Resultados</h2>
      <ul>
        <li>Comércio/Indústria: R$ 76,90</li>
        <li>Serviços: R$ 80,90</li>
        <li>Comércio e Serviços: R$ 81,90</li>
        <li>Indústria e Serviços: R$ 81,90</li>
      </ul>
      <p><a href="/ferramentas/calculadora-das">Acessar a Calculadora DAS MEI →</a></p>
    `,
    category: 'FERRAMENTAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2025-12-10',
    tags: ['calculadora', 'DAS', 'simulador', '2026'],
    metaTitle: 'Calculadora DAS MEI 2026: Simule seu Pagamento | Brazil MEI',
    metaDescription: 'Calculadora gratuita do DAS MEI 2026. Insira sua atividade (comércio, indústria, serviços) e veja o valor exato: INSS 5% + ICMS/ISS. Valores oficiais.',
  },

  'como-pagar-das-mei-2026': {
    id: 9,
    slug: 'como-pagar-das-mei-2026',
    title: 'Como pagar o DAS do MEI em 2026: passo a passo rápido, canais e cuidados para não atrasar',
    excerpt: 'Todo mês, o MEI precisa gerar e pagar uma guia chamada DAS. Parece simples, mas boa parte das dúvidas não é sobre "o que é o DAS" — é sobre onde emitir a guia, até quando pagar e o que fazer quando o ...',
    content: `<h2>Como pagar o DAS do MEI em 2026: passo a passo rápido, canais e cuidados para não atrasar</h2>

<h2>O problema</h2>

<p>Todo mês, o MEI precisa gerar e pagar uma guia chamada DAS. Parece simples, mas boa parte das dúvidas não é sobre "o que é o DAS" — é sobre onde emitir a guia, até quando pagar e o que fazer quando o sistema trava, a senha do gov.br não funciona ou a data já passou.</p>

<h2>Resposta rápida</h2>

<p>O DAS-MEI é pago todo mês, com vencimento no dia 20 (ou próximo dia útil, se cair em fim de semana ou feriado). A guia é emitida gratuitamente no PGMEI, dentro do Portal do Simples Nacional, ou pelo aplicativo oficial "MEI". Em 2026, os valores mensais são de R\\$ 82,05 (comercio e indústria), R\\$ 86,05 (serviçııes) e R\\$ 87,05 (comercio e serviços), com valores diferentes para o MEI caminhoneiro[cite:1]. O pagamento pode ser feito por Pix, boleto (côıııdigo de barras) ou debito automático, dependendo do banco.</p>

<h2>O que realmente importa</h2>

<p>O valor do DAS é composto por duas partes: uma contribuiçııo fixa ao INSS (5% do salário minimo, ou 12% para o MEI caminhoneiro) e, quando aplicavel, uma parcela de ICMS e/ou ISS conforme a atividade exercida[cite:1]. Com o salário minimo de 2026 fixado em R\\$ 1.621,00, a parcela do INSS corresponde a R\\$ 81,05 para a maioria dos MEIs[cite:1][cite:2].</p>

<p>Nao existe carnêıı único: o MEI precisa emitir a guia mês a mês (ou usar debito automático, quando disponivel pelo banco). A responsabilidade de gerar a guia é do proprio empreendedor — o sistema nao envia boleto automaticamente por padrao.</p>

<h2>Passo a passo pratico</h2>

<ol>
<li>Acesse o PGMEI pelo Portal do Simples Nacional ou abra o aplicativo "MEI" (disponivel para Android e iOS).</li>
<li>Informe o CNPJ do seu MEI.</li>
<li>Selecione o ano-calendario e o mês de competência desejado.</li>
<li>Clique em "Emitir Guia de Pagamento (DAS)".</li>
<li>Baixe o boleto em PDF ou copie o codigo Pix gerado na propria guia.</li>
<li>Pague em banco, aplicativo bancario, loterica ou diretamente via Pix, ate o dia 20.</li>
<li>Guarde o comprovante de pagamento — ele pode ser exigido futuramente para comprovar regularidade fiscal e previdenciaria.</li>
</ol>

<h2>Cenarios praticos</h2>

<p><strong>MEI de serviços que paga sempre em dia</strong>: emite a guia todo inicio de mês, paga via Pix pelo aplicativo do banco e nunca acumula atraso. Esse é o cenario ideal e mais simples.</p>

<p><strong>MEI que muda de atividade no meio do ano</strong>: se você adicionar uma atividade de comercio a um MEI que so prestava serviço, o valor do DAS pode mudar (de R\\$ 86,05 para R\\$ 87,05, por exemplo). Vale confirmar o valor certo antes de pagar, para nao gerar diferença.</p>

<p><strong>MEI caminhoneiro</strong>: paga um valor de INSS maior (12% do salario minimo, R\\$ 194,52 em 2026) somado ao ICMS/ISS aplicavel, dentro do mesmo sistema PGMEI[cite:1].</p>

<h2>Erros comuns</h2>

<ul>
<li>Emitir a guia com o mês de competência errado (isso pode gerar confusao na hora de conferir se um mês especifico foi pago).</li>
<li>Pagar com codigo de barras vencido — o boleto tem prazo, e um DAS pago depois do vencimento original ja entra automaticamente com multa e juros recalculados pelo sistema.</li>
<li>Achar que "nao faturei nada este mês, nao preciso pagar" — o DAS-MEI é uma contribuiçııo fixa mensal e é devido mesmo em meses sem faturamento algum.</li>
<li>Perder o comprovante de pagamento e nao conseguir provar a regularidade em uma eventual duvida futura.</li>
</ul>

<h2>O que fazer se ja passou do vencimento</h2>

<p>Se o dia 20 ja passou, ainda é possivel emitir a guia do mês em atraso: o proprio PGMEI recalcula multa e juros automaticamente ao gerar a nova guia. Isso é tratado com mais detalhe no artigo sobre DAS atrasado.</p>

<p>[Leia tambem: DAS MEI atrasado: multa, juros, parcelamento e como decidir]</p>

<h2>Checklist mensal</h2>

<ul>
<li>Emitir a guia ate o inicio do mês, mesmo que o pagamento so ocorra depois.</li>
<li>Confirmar se a atividade cadastrada (comercio, serviço ou ambos) esta correta.</li>
<li>Pagar ate o dia 20 (ou proximo dia util).</li>
<li>Guardar o comprovante em PDF ou pasta propria.</li>
<li>Anotar em algum lugar (agenda, planilha, app) para nao depender so da memoria.</li>
</ul>

<h2>FAQ</h2>

<p><strong>O DAS vence sempre no dia 20?</strong><br>Sim, esse é o vencimento padrao. Se o dia 20 cair em sabado, domingo ou feriado nacional, o prazo é prorrogado para o proximo dia util.</p>

<p><strong>Posso pagar o DAS adiantado?</strong><br>Sim, é possivel emitir e pagar a guia antes do vencimento, desde que o mês de competencia ja esteja disponivel no sistema.</p>

<p><strong>O valor do DAS é sempre o mesmo todo mês?</strong><br>Regra geral, sim, dentro do mesmo ano-calendario, salvo mudança de atividade cadastrada ou reajuste anual vinculado ao salario minimo.</p>

<p><strong>Existe carnêıı anual para pagar tudo de uma vez?</strong><br>Nao. A emissao é mês a mês pelo PGMEI, embora o debito automatico (quando oferecido pelo banco) simplifique a rotina.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Receita Federal do Brasil — Simples Nacional, comunicado sobre atualizaçııo de valores do MEI para 2026.</li>
<li>Portal Gov.br — Empresas e Negocios: "Pagamento da Contribuiçııo Mensal (DAS)".</li>
<li>Portal do Simples Nacional — PGMEI (Programa Gerador do DAS para o MEI).</li>
</ul>

<h2>Proximo passo</h2>

<p>Se você esta em dia, o proximo passo é apenas manter a rotina mensal descrita no checklist. Se ja perdeu algum mês, siga direto para o artigo sobre regularizaçııo de DAS atrasado antes que a divida cresçıı.</p>`,
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['DAS MEI', 'PGMEI', 'pagamento mensal MEI', 'Simples Nacional', 'boleto MEI'],
    metaTitle: 'Como pagar o DAS do MEI em 2026: passo a passo rápido, canais e cuidados para não atrasar | Brazil MEI',
    metaDescription: 'Todo mês, o MEI precisa gerar e pagar uma guia chamada DAS. Parece simples, mas boa parte das dúvidas não é sobre "o que é o DAS" — é sobre onde emitir a g',
  },

  'das-mei-atrasado-multa-juros-parcelamento': {
    id: 10,
    slug: 'das-mei-atrasado-multa-juros-parcelamento',
    title: 'DAS MEI atrasado: multa, juros, parcelamento e como decidir',
    excerpt: 'Um ou dois meses de DAS atrasados parecem inofensivos. Mas quando o atraso se acumula por muitos meses ou anos, o MEI enfrenta uma duvida concreta: vale mais a pena pagar tudo de uma vez, parcelar ou ...',
    content: `<h2>DAS MEI atrasado: multa, juros, parcelamento e como decidir</h2>

<h2>O problema</h2>

<p>Um ou dois meses de DAS atrasados parecem inofensivos. Mas quando o atraso se acumula por muitos meses ou anos, o MEI enfrenta uma duvida concreta: vale mais a pena pagar tudo de uma vez, parcelar ou simplesmente encerrar o CNPJ? Essa decisao depende de entender exatamente como a divida cresce e o que esta em jogo.</p>

<h2>Resposta rapida</h2>

<p>Sim, é possivel pagar o DAS atrasado. Ao gerar a guia em atraso pelo PGMEI, o sistema ja calcula automaticamente a multa e os juros atualizados. A multa por atraso é de 0,33% por dia, com teto de 20% do valor da guia — esse teto é atingido em torno de 61 dias de atraso. Sobre o valor tambem incidem juros baseados na taxa Selic acumulada, mais 1% no mês do pagamento[cite:3][cite:4]. Debitos antigos podem ainda ser parcelados pelo Portal do Simples Nacional.</p>

<h2>O que realmente importa</h2>

<p>A multa tem um teto (20%), mas os juros continuam correndo mês a mês enquanto a divida nao for paga — ou seja, quanto mais tempo passa, maior o valor total, mesmo depois que a multa parou de subir. Isso significa que dividas muito antigas (varios anos) podem ter juros acumulados relevantes, mesmo que a multa ja esteja no limite.</p>

<p>Outro ponto central: enquanto houver DAS em aberto, o MEI pode enfrentar restriçııes, como dificuldade para obter certidoes, e a inadimplencia prolongada pode levar à inscriçııo em divida ativa, com reflexos no CPF do titular. Alem disso, meses de DAS nao pagos podem comprometer a contagem de carencia para beneficios do INSS, ja que os beneficios dependem de contribuiçııes pagas em dia.</p>

<h2>Como verificar o que esta pendente</h2>

<p>Antes de decidir o que fazer, é preciso saber exatamente quanto se deve. Isso pode ser conferido no Portal do Simples Nacional, na area do SIMEI, usando a opçııo de consulta de extrato ou pendencias ligada ao CNPJ do MEI. O aplicativo "MEI" tambem disponibiliza uma funcionalidade de consulta de pendencias mediante login com conta gov.br.</p>

<h2>Opçııes de pagamento</h2>

<p><strong>Pagamento à vista</strong>: emitir a guia em atraso pelo PGMEI para cada mês pendente. O sistema ja inclui multa e juros atualizados automaticamente. É a opçııo mais simples quando o valor total é administrael.</p>

<p><strong>Parcelamento</strong>: para dividas maiores, o Portal do Simples Nacional oferece a opçııo de parcelamento de debitoss do MEI, com parcela minima e condiçııes proprias, sendo necessario efetuar o pagamento da primeira parcela dentro do prazo para o acordo valer.</p>

<p>Antes de escolher entre pagar tudo de uma vez ou parcelar, vale simular o total de cada mês pendente separadamente — nem sempre parcelar é mais vantajoso, pois o parcelamento tambem tem juros proprios.</p>

<h2>Cenarios praticos</h2>

<p><strong>MEI com 2 a 3 meses atrasados</strong>: valor de multa e juros ainda é pequeno. Nesse caso, normalmente compensa emitir as guias em atraso e pagar à vista o quanto antes, para nao deixar o teto de multa (20%) ser atingido.</p>

<p><strong>MEI com mais de 1 ano de atraso</strong>: a multa de cada guia ja deve estar no teto de 20%, mas os juros continuam acumulando. Aqui, vale considerar o parcelamento, especialmente se o valor total for alto em relaao ao caixa disponivel no momento.</p>

<p><strong>MEI que decidiu parar de operar, mas nunca encerrou o CNPJ</strong>: mesmo sem faturamento, o DAS continua sendo devido mensalmente enquanto o CNPJ estiver ativo como MEI. Encerrar formalmente o CNPJ é o unico jeito de parar a geraao de nova divida — mas isso nao elimina o que ja esta em aberto.</p>

<p>[Leia tambem: Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor]</p>

<h2>Erros comuns</h2>

<ul>
<li>Deixar de pagar "so mais um pouco" pensando em resolver tudo de uma vez depois — o custo total sobe a cada mês.</li>
<li>Parcelar e nao pagar a primeira parcela no prazo, o que pode invalidar o acordo.</li>
<li>Ignorar que a divida tambem afeta a contagem de contribuiçııes para beneficios do INSS.</li>
<li>Achar que encerrar o CNPJ "apaga" automaticamente o que ja é devido — nao é o caso.</li>
</ul>

<h2>Quando vale buscar ajuda contabil</h2>

<p>Se a divida envolve muitos meses ou anos diferentes, se ha duvida sobre valores exibidos no extrato, ou se o MEI ja recebeu notificaao de cobrançııa formal, vale consultar um contador ou o proprio canal de atendimento do Simples Nacional antes de tomar decisoes. Este artigo nao substitui orientaao fiscal individualizada.</p>

<h2>FAQ</h2>

<p><strong>Posso escolher quais meses pagar primeiro?</strong><br>Cada guia é gerada e paga individualmente por competencia (mêıı). Nao ha obrigatoriedade de seguir uma ordem especifica, mas quitar os meses mais antigos primeiro pode ajudar a preservar a contagem de carencia do INSS.</p>

<p><strong>A multa continua aumentando para sempre?</strong><br>Nao. A multa por atraso tem teto de 20% do valor da guia, atingido em torno de 61 dias de atraso. Depois disso, apenas os juros continuam incidindo.</p>

<p><strong>Divida de MEI vira "nome sujo"?</strong><br>Debitos nao pagos podem ser inscritos em divida ativa, o que pode gerar restriçııes ao CPF do titular, dependendo da fase de cobrançııa.</p>

<p><strong>Parcelar é sempre a melhor opçııo?</strong><br>Nao necessariamente. Para dividas pequenas, pagar à vista costuma ser mais simples e evita juros adicionais do proprio parcelamento.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal do Simples Nacional — SIMEI (area de calculo, declaraao e parcelamento).</li>
<li>Receita Federal do Brasil — regras de multa e juros para o Simples Nacional/MEI.</li>
<li>Portal Gov.br — Empresas e Negocios, serviço "Emitir DAS para pagamento de tributos do MEI".</li>
</ul>

<h2>Proximo passo</h2>

<p>Acesse o extrato de pendencias do seu CNPJ antes de qualquer decisao. Com o valor exato em maos, compare o custo de pagar à vista com o de parcelar e escolha a opçııo que cabe no seu caixa atual — mas nao deixe a divida crescer so por indecisao.</p>`,
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['DAS atrasado', 'multa MEI', 'juros Selic', 'parcelamento MEI', 'regularizaçııo CNPJ'],
    metaTitle: 'DAS MEI atrasado: multa, juros, parcelamento e como decidir | Brazil MEI',
    metaDescription: 'Um ou dois meses de DAS atrasados parecem inofensivos. Mas quando o atraso se acumula por muitos meses ou anos, o MEI enfrenta uma duvida concreta: vale ma',
  },

  'dasn-simei-declaracao-anual-mei': {
    id: 11,
    slug: 'dasn-simei-declaracao-anual-mei',
    title: 'Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos',
    excerpt: 'Muitos MEIs sabem que precisam pagar o DAS todo mês, mas esquecem de uma segunda obrigaao, anual: a DASN-SIMEI. E um erro muito comum é pensar que, se nao faturou nada no ano, nao precisa declarar nad...',
    content: `<h2>Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos</h2>

<h2>O problema</h2>

<p>Muitos MEIs sabem que precisam pagar o DAS todo mês, mas esquecem de uma segunda obrigaao, anual: a DASN-SIMEI. E um erro muito comum é pensar que, se nao faturou nada no ano, nao precisa declarar nada. Nao é assim.</p>

<h2>Resposta rapida</h2>

<p>A DASN-SIMEI (Declaraao Anual do Simples Nacional para o MEI) deve ser entregue todos os anos, ate o ultimo dia de maio, informando o faturamento do ano anterior — mesmo que tenha sido zero[cite:5][cite:6]. A entrega é feita pelo Portal do Simples Nacional/Portal do Empreendedor. O atraso gera multa minima de R\\$ 50,00, ou 2% ao mês sobre os tributos declarados, limitada a 20% — com desconto de 50% (R\\$ 25,00) se a declaraao for transmitida voluntariamente, antes de qualquer notificaao da Receita[cite:5][cite:6][cite:7].</p>

<h2>O que realmente importa</h2>

<p>A DASN-SIMEI substitui a declaraao de Imposto de Renda Pessoa Juridica que empresas maiores precisam entregar — o MEI tem uma versao simplificada, focada apenas em informar o quanto faturou no ano anterior. Ela serve para a Receita Federal confirmar que o faturamento do MEI ficou dentro do limite permitido (R\\$ 81.000,00 em 2026)[cite:8].</p>

<p>Nao confunda DAS (pagamento mensal) com DASN-SIMEI (declaraao anual): sao obrigaçııes diferentes, com prazos diferentes, e uma nao substitui a outra. É possivel estar com o DAS em dia e mesmo assim estar irregular por nao ter entregue a DASN-SIMEI, e vice-versa.</p>

<h2>O que é informado na declaraao</h2>

<ul>
<li>O valor total de receita bruta recebida no ano anterior, separado entre comercio/industria e prestaao de serviços.</li>
<li>Se houve ou nao contrataao de funcionario durante o ano.</li>
<li>Confirmaao (ou retificaao) de uma declaraao ja enviada, se for o caso.</li>
</ul>

<h2>Passo a passo</h2>

<ol>
<li>Acesse o Portal do Simples Nacional (area SIMEI) ou o Portal do Empreendedor.</li>
<li>Selecione a opçııo de Declaraao Anual (DASN-SIMEI).</li>
<li>Informe o CNPJ e o ano-calendario de referencia.</li>
<li>Escolha entre declaraao original (primeira vez) ou retificaao (correao de declaraao ja enviada).</li>
<li>Informe o valor da receita bruta total do ano, dividida por tipo de atividade.</li>
<li>Informe se contratou empregado durante o periodo.</li>
<li>Revise e transmita a declaraao.</li>
</ol>

<h2>Faturamento zero tambem precisa declarar</h2>

<p>Se o MEI nao faturou nada durante o ano, ainda assim é obrigatorio entregar a DASN-SIMEI informando receita zero. Deixar de declarar por esse motivo é um dos erros mais comuns e gera multa da mesma forma que a omissao de uma declaraao com faturamento.</p>

<h2>Atraso e regularizaao</h2>

<p>Se o prazo de 31 de maio ja passou, a declaraao ainda pode (e deve) ser transmitida. Ao enviar, o sistema gera automaticamente a guia de multa (DARF). Se esse DARF for pago dentro do prazo indicado na propria guia — geralmente ate 30 dias —, o valor da multa minima cai de R\\$ 50,00 para R\\$ 25,00[cite:7].</p>

<h2>Cenarios praticos</h2>

<p><strong>MEI com um unico ano atrasado</strong>: basta acessar o sistema, selecionar o ano pendente, preencher os dados e transmitir. A multa minima de R\\$ 50,00 (ou R\\$ 25,00 com desconto) sera gerada automaticamente.</p>

<p><strong>MEI com varios anos atrasados</strong>: é preciso levantar quais anos-calendario estao pendentes, revisar o faturamento real de cada um (usando notas fiscais e extratos) e transmitir uma declaraao por ano, na ordem correta.</p>

<p><strong>MEI que encerrou o CNPJ durante o ano</strong>: nesse caso, existe uma modalidade de "Situaao Especial (extinao)", com prazo proprio, diferente do prazo padrao de maio. Vale confirmar no proprio sistema qual prazo se aplica ao caso.</p>

<p>[Leia tambem: Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor]</p>

<h2>Erros comuns</h2>

<ul>
<li>Nao declarar por acreditar que faturamento zero dispensa a obrigaao.</li>
<li>Declarar valor de faturamento incorreto — o que pode gerar inconsistencia entre o valor declarado e o efetivamente recebido, algo que pode ser questionado depois.</li>
<li>Deixar varios anos acumulados sem verificar cada um separadamente.</li>
<li>Ignorar o prazo de desconto de 50% da multa por transmitir voluntariamente.</li>
</ul>

<h2>Corrigindo uma declaraao ja enviada</h2>

<p>Se você percebeu um erro em uma declaraao ja transmitida (valor errado, esqueceu de marcar que teve funcionario, etc.), é possivel enviar uma retificaao para o mesmo ano-calendario, substituindo a declaraao anterior.</p>

<h2>Checklist anual</h2>

<ul>
<li>Separar, ao longo do ano, os valores de receita por comercio e por serviço.</li>
<li>Verificar se houve contrataao de funcionario no periodo.</li>
<li>Acessar o sistema ate maio do ano seguinte.</li>
<li>Se estiver atrasado, transmitir o quanto antes para aproveitar o desconto na multa.</li>
<li>Guardar o comprovante de transmissao.</li>
</ul>

<h2>FAQ</h2>

<p><strong>Preciso declarar mesmo sem ter faturado nada?</strong><br>Sim. A DASN-SIMEI é obrigatoria todos os anos, mesmo com receita zero.</p>

<p><strong>O que acontece se eu nunca entregar a DASN-SIMEI?</strong><br>A falta de entrega pode deixar o CNPJ irregular, dificultar a emissao do DAS e, em casos de excesso de faturamento nao declarado, complicar a verificaao da situaao do MEI perante a Receita.</p>

<p><strong>Posso corrigir uma declaraao depois de enviada?</strong><br>Sim, por meio de retificaao para o mesmo ano-calendario.</p>

<p><strong>A declaraao é a mesma coisa que o Imposto de Renda?</strong><br>Nao. A DASN-SIMEI é a declaraao anual especifica do MEI e substitui a declaraao de IRPJ, mas nao substitui a declaraao de Imposto de Renda Pessoa Fisica do titular, quando ela for exigida.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal Gov.br — Empresas e Negocios: "Declaraao Anual de Faturamento – DASN".</li>
<li>Receita Federal do Brasil — Perguntas Frequentes sobre DASN-SIMEI.</li>
<li>Portal do Simples Nacional — SIMEI (Calculo e Declaraao).</li>
</ul>

<h2>Proximo passo</h2>

<p>Confirme agora mesmo se a declaraao do ultimo ano-calendario ja foi entregue. Se estiver pendente, transmita o quanto antes para garantir o desconto de 50% na multa, antes de qualquer notificaao formal.</p>`,
    category: 'DASN_SIMEI',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['DASN-SIMEI', 'declaraao anual MEI', 'multa DASN', 'faturamento zero', 'Receita Federal'],
    metaTitle: 'Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos | Brazil MEI',
    metaDescription: 'Muitos MEIs sabem que precisam pagar o DAS todo mês, mas esquecem de uma segunda obrigaao, anual: a DASN-SIMEI. E um erro muito comum é pensar que, se nao ',
  },

  'limite-faturamento-mei-2026-desenquadramento': {
    id: 12,
    slug: 'limite-faturamento-mei-2026-desenquadramento',
    title: 'Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar',
    excerpt: 'O MEI cresceu, as vendas aumentaram, e agora surge a pergunta: "sera que ja passei do limite permitido?" Entender esse limite — e o que acontece quando ele é ultrapassado — é essencial para nao ser pe...',
    content: `<h2>Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar</h2>

<h2>O problema</h2>

<p>O MEI cresceu, as vendas aumentaram, e agora surge a pergunta: "sera que ja passei do limite permitido?" Entender esse limite — e o que acontece quando ele é ultrapassado — é essencial para nao ser pego de surpresa com uma cobrançııa retroativa.</p>

<h2>Resposta rapida</h2>

<p>O limite oficial de faturamento anual do MEI em 2026 é de R\\$ 81.000,00, o que equivale a uma media de R\\$ 6.750,00 por mês. Para o MEI caminhoneiro, o teto é diferente: R\\$ 251.600,00 por ano[cite:9]. Se o MEI abriu o CNPJ no meio do ano, esse limite é proporcional ao numero de meses de atividade. Existem propostas em tramitaao no Congresso para aumentar esse teto (valores discutidos entre R\\$ 110 mil e R\\$ 140 mil, em diferentes projetos), mas nenhuma dessas propostas esta em vigor ate o momento — o limite legal vigente continua sendo R\\$ 81.000,00[cite:10][cite:11][cite:12].</p>

<h2>O que realmente importa</h2>

<p><strong>Faturamento</strong> aqui significa receita bruta total recebida, sem descontar custos, despesas ou impostos. É a soma de tudo o que entrou no caixa do negocio ao longo do ano-calendario (janeiro a dezembro, ou do mês de abertura ate dezembro, no primeiro ano).</p>

<p><strong>Limite proporcional no ano de abertura</strong>: quem abre o MEI no meio do ano nao tem direito ao teto cheio de R\\$ 81 mil. O limite é calculado proporcionalmente aos meses restantes do ano, usando a media mensal de R\\$ 6.750,00. Por exemplo, quem formaliza o MEI em julho tem, ate dezembro, um limite proporcional de 6 meses de atividade.</p>

<p><strong>Propostas de aumento nao sao lei ainda</strong>: houve avançııo de projetos como o PLP 60/2025 (aprovado em comissoes do Senado, com discussao de teto de R\\$ 140 mil) e outros projetos na Camara discutindo valores como R\\$ 130 mil, mas, ate a publicaao de sanao presidencial no Diario Oficial, o limite vigente permanece em R\\$ 81.000,00[cite:10][cite:11][cite:12]. Planejar o negocio com base em um teto que ainda nao existe é arriscado.</p>

<h2>O que acontece ao se aproximar do limite</h2>

<p>Nao ha problema em chegar perto do teto — o problema é ultrapassa-lo. Por isso, o ideal é acompanhar o faturamento acumulado mês a mês e nao apenas no fim do ano, para ter tempo de se planejar (seja ajustando o ritmo de vendas, seja se preparando para migrar de categoria).</p>

<h2>O que acontece ao ultrapassar o limite</h2>

<p>Existem dois cenarios diferentes, e a diferença entre eles é importante:</p>

<p><strong>Excesso de ate 20% acima do limite</strong>: o MEI permanece formalmente enquadrado ate 31 de dezembro daquele ano, continuando a pagar o DAS normalmente. O desenquadramento (migraao obrigatoria para outra categoria, como Microempresa) so passa a valer a partir de janeiro do ano seguinte.</p>

<p><strong>Excesso superior a 20% acima do limite</strong>: nesse caso, a legislaao preve que o desenquadramento retroage ao inicio do proprio ano-calendario. Isso significa que o negocio deixa de ser considerado MEI desde janeiro daquele ano, exigindo recalculo de todos os tributos do periodo como se fosse uma empresa de outro regime — um processo mais complexo, normalmente com apoio de contador.</p>

<h2>Cenarios praticos</h2>

<p><strong>MEI que fatura R\\$ 85 mil no ano</strong> (cerca de 5% acima do limite): fica no cenario de excesso ate 20%. Continua MEI ate dezembro, mas ja deve se preparar para migrar de categoria no ano seguinte.</p>

<p><strong>MEI que fatura R\\$ 110 mil no ano</strong> (mais de 20% acima do limite): entra no cenario de desenquadramento retroativo, precisando recalcular tributos desde janeiro daquele ano, com risco de autuaao se isso nao for regularizado.</p>

<p><strong>MEI que abriu o CNPJ em setembro</strong>: tem um limite proporcional (poucos meses de atividade), e precisa calcular esse teto reduzido, nao o valor cheio de R\\$ 81 mil.</p>

<p>[Leia tambem: Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos]</p>

<h2>Erros comuns</h2>

<ul>
<li>Calcular o limite considerando so o lucro, quando na verdade é sobre a receita bruta total.</li>
<li>Ignorar o limite proporcional no ano de abertura e achar que tem direito aos R\\$ 81 mil inteiros.</li>
<li>Confundir os dois cenarios de excesso (ate 20% x acima de 20%), que tem consequencias bem diferentes.</li>
<li>Planejar o negocio ja contando com um teto maior por causa de noticias sobre projetos de lei ainda nao aprovados.</li>
<li>Nao observar tambem o limite de compras (mercadorias e insumos), que a partir do segundo ano de atividade nao pode superar 80% do faturamento do MEI — outro ponto que pode gerar problemas mesmo sem ultrapassar o teto de receita.</li>
</ul>

<h2>Controle mensal pratico</h2>

<p>Sem precisar de nenhum sistema sofisticado, o controle basico envolve: anotar toda entrada de receita do mês, somar o acumulado do ano, e comparar com o limite proporcional (ou total, se ja passou o primeiro ano). Fazer essa conferencia mensalmente, e nao so em dezembro, da tempo de agir antes de qualquer problema.</p>

<h2>FAQ</h2>

<p><strong>O limite de R\\$ 81 mil ja mudou em 2026?</strong><br>Nao. Apesar de propostas em tramitaao no Congresso, o valor vigente em 2026 continua sendo R\\$ 81.000,00 por ano para o MEI geral.</p>

<p><strong>Ultrapassar o limite fecha o MEI automaticamente?</strong><br>Nao fecha automaticamente, mas gera desenquadramento — migraao obrigatoria para outra categoria empresarial, com efeitos diferentes dependendo do percentual de excesso.</p>

<p><strong>Posso abrir um segundo MEI para nao ultrapassar o limite?</strong><br>A legislaao nao permite que uma mesma pessoa mantenha mais de um MEI simultaneamente; a titularidade é individual. Formas de contornar o limite dividindo faturamento entre CNPJs de terceiros podem configurar irregularidade.</p>

<p><strong>O limite do MEI caminhoneiro é o mesmo dos demais?</strong><br>Nao. O MEI caminhoneiro tem teto proprio de R\\$ 251.600,00 por ano, bem superior ao limite geral.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal Gov.br — Empresas e Negocios: "Verifique se você atende as condiçııes para ser MEI".</li>
<li>Camara dos Deputados — tramitaao de projetos sobre aumento do teto do MEI.</li>
<li>Senado Federal — tramitaao do PLP 60/2025 ("Super MEI").</li>
</ul>

<h2>Proximo passo</h2>

<p>Some seu faturamento acumulado do ano ate hoje e compare com o limite proporcional (ou total). Se estiver perto do teto, comece ja a planejar se vale migrar de categoria ou ajustar o ritmo do negocio — antes que a decisao seja tomada por você.</p>`,
    category: 'MEI_FATURAMENTO',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['limite faturamento MEI', 'desenquadramento MEI', 'teto MEI', 'MEI caminhoneiro', 'migraao para ME'],
    metaTitle: 'Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar | Brazil MEI',
    metaDescription: 'O MEI cresceu, as vendas aumentaram, e agora surge a pergunta: "sera que ja passei do limite permitido?" Entender esse limite — e o que acontece quando ele',
  },

  'nota-fiscal-mei-quando-obrigatoria-como-emitir': {
    id: 13,
    slug: 'nota-fiscal-mei-quando-obrigatoria-como-emitir',
    title: 'Nota fiscal para MEI: quando é obrigatooria e como emitir graatis',
    excerpt: '"Preciso mesmo emitir nota fiscal sendo MEI?" é uma das perguntas mais comuns — e a resposta certa depende de para quem você vendeu, o que vendeu e, em alguns casos, de onde e para onde. Nao existe um...',
    content: `<h2>Nota fiscal para MEI: quando é obrigatooria e como emitir graatis</h2>

<h2>O problema</h2>

<p>"Preciso mesmo emitir nota fiscal sendo MEI?" é uma das perguntas mais comuns — e a resposta certa depende de para quem você vendeu, o que vendeu e, em alguns casos, de onde e para onde. Nao existe uma regra unica que sirva para todos os MEIs.</p>

<h2>Resposta rapida</h2>

<p>O MEI nao é obrigado a emitir nota fiscal em vendas para pessoa fisica dentro do mesmo estado. Porem, a emissao passa a ser obrigatooria quando o cliente é uma pessoa jurica (empresa), independentemente do estado, e tambem em vendas interestaduais ou por e-commerce em que o produto é enviado por correio ou transportadora para outro estado[cite:13][cite:14]. A emissao pode ser feita gratuitamente por sistemas oficiais, mas o sistema correto (municipal, estadual ou nacional) varia de acordo com o tipo de operaao e a localizaao.</p>

<h2>O que realmente importa</h2>

<p>A obrigatoriedade depende de tres fatores combinados: <strong>quem é o cliente</strong> (pessoa fisica ou jurica), <strong>o que foi vendido</strong> (produto ou serviço) e, as vezes, <strong>onde a operaao ocorre</strong> (mesmo municipio/estado ou nao).</p>

<p><strong>Venda de serviço para pessoa jurica</strong>: geralmente exige nota fiscal de serviço, emitida pelo sistema da prefeitura do municipio onde o MEI esta cadastrado, ja que o ISS é um imposto municipal.</p>

<p><strong>Venda de produto para pessoa jurica ou operaao interestadual</strong>: pode exigir nota fiscal de produto (NF-e), emitida por sistema estadual ou pelo emissor nacional, ja que o ICMS é estadual.</p>

<p><strong>Venda para pessoa fisica, dentro do mesmo estado, sem envio para fora</strong>: em regra, nao ha obrigatoriedade de emissao, embora seja permitido emitir por controle interno, se o MEI quiser.</p>

<p>Essa distinao entre serviço (municipio) e produto (estado) é o principal motivo pelo qual nao existe "um unico emissor" que sirva para todo MEI — o sistema correto depende da atividade e da localizaao.</p>

<h2>Como identificar o emissor certo</h2>

<ul>
<li>Para nota fiscal de <strong>serviçııo</strong>: procure o sistema de emissao de nota fiscal da prefeitura do municipio onde o MEI esta registrado (cada prefeitura tem seu proprio sistema, geralmente gratuito).</li>
<li>Para nota fiscal de <strong>produto</strong>: pode ser necessario usar o sistema da Secretaria da Fazenda do estado, ou o Emissor Nacional disponibilizado pela Receita/Sefaz para MEIs, dependendo do estado.</li>
<li>O Sebrae tambem oferece um emissor de notas voltado especificamente para MEIs, cobrindo NF-e e CF-e em diversos estados, o que pode simplificar o processo para quem nao sabe qual sistema municipal ou estadual usar[cite:14].</li>
</ul>

<h2>Cenarios praticos</h2>

<p><strong>MEI que presta serviço de manutenao para uma empresa</strong>: precisa emitir nota fiscal de serviço pelo sistema da prefeitura, ja que o cliente é pessoa jurica.</p>

<p><strong>MEI que vende produtos artesanais para pessoa fisica, na mesma cidade, entregue pessoalmente</strong>: em regra, nao ha obrigatoriedade de nota fiscal nessa venda especifica.</p>

<p><strong>MEI que vende pela internet e envia produto para outro estado, mesmo que o comprador seja pessoa fisica</strong>: a operaao interestadual, por si so, ja pode gerar a necessidade de emissao de nota fiscal, dependendo da forma de envio (correio/transportadora)[cite:13].</p>

<p><strong>MEI que vende em marketplace, para varios estados</strong>: precisa avaliar cada venda, ja que a obrigatoriedade pode variar conforme o destino e o tipo de produto — vale manter um sistema de emissao configurado e ativo, em vez de decidir venda por venda sem verificar.</p>

<p>[Leia tambem: Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar]</p>

<h2>Erros comuns</h2>

<ul>
<li>Achar que "MEI nunca precisa emitir nota" — verdade apenas para uma parte das operaçııes (venda a PF, no mesmo estado, sem envio para fora).</li>
<li>Nao emitir nota em vendas para empresas, o que pode ser interpretado como sonegaao fiscal.</li>
<li>Emitir nota pelo sistema errado (por exemplo, tentar emitir nota de produto pelo sistema de serviços da prefeitura).</li>
<li>Nao guardar as notas emitidas e recebidas — a obrigaao de manter esse controle por 5 anos existe independentemente do volume de vendas.</li>
<li>Ignorar variaçııes locais: o sistema, o cadastro necessario e ate a exigencia especifica podem mudar de municipio para municipio e de estado para estado.</li>
</ul>

<h2>Guarda de documentos</h2>

<p>Notas fiscais emitidas (de venda) e recebidas (de compra de mercadorias e insumos) devem ser guardadas por 5 anos, servindo tanto para comprovar o faturamento informado na DASN-SIMEI quanto para eventual fiscalizaao.</p>

<p>[Leia tambem: Declaraao Anual do MEI (DASN-SIMEI): como fazer e regularizar atrasos]</p>

<h2>FAQ</h2>

<p><strong>MEI que so vende para pessoa fisica precisa se preocupar com nota fiscal?</strong><br>Na maioria dos casos, nao é obrigatoorio, mas se as vendas envolverem envio para outro estado ou forem por e-commerce com entrega intermunicipal/interestadual, vale confirmar as regras especificas do seu estado.</p>

<p><strong>Existe um emissor de nota fiscal unico para todo o Brasil?</strong><br>Nao exatamente. Existem sistemas nacionais e do Sebrae que ajudam a simplificar, mas a competencia formal para nota de serviço é municipal, e para nota de produto é estadual — por isso a variaao local é real.</p>

<p><strong>Emitir nota fiscal como MEI tem algum custo?</strong><br>Os sistemas oficiais de emissao (prefeitura, estado, emissor nacional, emissor do Sebrae) sao, em geral, gratuitos. Softwares privados de terceiros podem cobrar por funcionalidades extras.</p>

<p><strong>O que acontece se eu nao emitir nota fiscal quando era obrigatoorio?</strong><br>Pode gerar risco de acusaao de sonegaao fiscal, alem de dificultar a comprovaao da operaao para o cliente pessoa jurica.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal Gov.br — Empresas e Negocios: "Direitos e Obrigaçııes do MEI".</li>
<li>Sebrae — Emissor de Notas Fiscais para MEI.</li>
<li>Sistemas municipais de nota fiscal de serviço (variam por prefeitura) e sistemas estaduais de nota fiscal de produto (variam por Secretaria da Fazenda).</li>
</ul>

<h2>Proximo passo</h2>

<p>Identifique, para o seu tipo de venda mais comum (serviçııo ou produto, PF ou PJ, mesma cidade ou nao), qual sistema de emissao se aplica ao seu caso, e cadastre-se nele antes da proxima venda que exigir nota — nao espere a duvida aparecer no meio de uma negociaao com cliente.</p>`,
    category: 'NOTA_FISCAL',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['nota fiscal MEI', 'emissor nacional', 'NF-e MEI', 'venda para PJ', 'e-commerce MEI'],
    metaTitle: 'Nota fiscal para MEI: quando é obrigatooria e como emitir graatis | Brazil MEI',
    metaDescription: '"Preciso mesmo emitir nota fiscal sendo MEI?" é uma das perguntas mais comuns — e a resposta certa depende de para quem você vendeu, o que vendeu e, em alg',
  },

  'mei-pode-contratar-funcionario-esocial': {
    id: 14,
    slug: 'mei-pode-contratar-funcionario-esocial',
    title: 'MEI pode contratar funcionario? Veja quanto custa, quais sao as regras e como registrar no eSocial',
    excerpt: 'O negocio cresceu e virou mais trabalho do que uma pessoa consegue dar conta. A pergunta natural é: da para contratar alguem formalmente ainda como MEI, ou isso exige virar outro tipo de empresa? E, s...',
    content: `<h2>MEI pode contratar funcionario? Veja quanto custa, quais sao as regras e como registrar no eSocial</h2>

<h2>O problema</h2>

<p>O negocio cresceu e virou mais trabalho do que uma pessoa consegue dar conta. A pergunta natural é: da para contratar alguem formalmente ainda como MEI, ou isso exige virar outro tipo de empresa? E, se der, quanto isso realmente custa?</p>

<h2>Resposta rapida</h2>

<p>Sim, o MEI pode contratar um funcionario registrado, com carteira assinada (regime CLT). A regra permite, em geral, apenas um empregado por MEI, com salario minimo ou piso da categoria profissional, tendo direito a todos os beneficios trabalhistas padrao (FGTS, ferias, 13o salario, entre outros)[cite:15][cite:16]. Existe uma exceao especifica que permite um segundo empregado, de forma temporaria, apenas para substituir o titular em casos como ferias ou afastamento[cite:16]. O processo de contrataao é feito pelo eSocial, no modulo simplificado voltado ao MEI.</p>

<h2>O que realmente importa</h2>

<p>Contratar funcionario muda a natureza das obrigaçııes do MEI: alem das obrigaçııes fiscais ja existentes (DAS, DASN-SIMEI, nota fiscal), passam a existir obrigaçııes trabalhistas e previdenciarias especificas do empregado — isso é mais complexo do que a rotina padrao de um MEI sem funcionario.</p>

<p><strong>Direitos garantidos ao empregado</strong>: salario conforme minimo nacional ou piso da categoria, FGTS, ferias remuneradas, 13o salario, vale-transporte quando aplicavel, e as demais garantias da CLT[cite:15][cite:16]. Isso significa que o custo real de ter um funcionario vai alem do salario bruto: inclui os encargos trabalhistas e previdenciarios vinculados a essa contrataao.</p>

<p><strong>Limite de contrataao</strong>: em regra, apenas um funcionario. A exceao do segundo empregado é pontual, vinculada a uma substituiçııo temporaria do titular, e nao permite manter dois funcionarios fixos ao mesmo tempo.</p>

<h2>Passo a passo para contratar pelo eSocial</h2>

<ol>
<li>Realizar o recrutamento normal do candidato.</li>
<li>Providenciar o exame medico admissional, exigido antes do inicio das atividades.</li>
<li>Reunir os documentos do funcionario (RG, CPF, declaraao de dependentes para fins de Imposto de Renda, atestado medico, declaraao sobre necessidade de vale-transporte).</li>
<li>Definir os termos do contrato (salario, jornada, funao) — consultar o sindicato da categoria ajuda a confirmar piso salarial e beneficios obrigatorios especificos daquela profissao.</li>
<li>Acessar o eSocial (gov.br/esocial) com login gov.br, no perfil de responsavel legal do CNPJ.</li>
<li>Usar o modulo simplificado do eSocial para admitir o funcionario, preenchendo dados pessoais, endereao, dependentes e dados do contrato.</li>
<li>Concluir o cadastro e manter as informaçııes do empregado atualizadas no sistema durante todo o vinculo[cite:17].</li>
</ol>

<h2>Cenario pratico</h2>

<p>Um MEI de serviços de manutenao que decide contratar um ajudante em regime CLT, pagando salario minimo, precisa considerar: o salario mensal do empregado, o FGTS (depositado mensalmente), o custo de ferias e 13o proporcional ao longo do ano, alem do exame admissional inicial. Esse conjunto de obrigaçııes é bem mais amplo do que o simples pagamento do DAS mensal do proprio titular do MEI — por isso, antes de contratar, vale simular o custo total mês a mês, e nao apenas olhar o valor do salario isoladamente.</p>

<p>Nao existe um "percentual fixo e universal" de custo total de um funcionario que sirva para qualquer caso — o valor depende do salario acordado, do piso da categoria (quando houver), de beneficios adicionais negociados (como vale-transporte) e de eventuais acordos coletivos da profissao. Qualquer estimativa de custo total deve ser tratada como aproximada, nao como valor definitivo.</p>

<h2>Erros comuns</h2>

<ul>
<li>Contratar informalmente ("por fora"), sem registro no eSocial — isso expoe tanto o MEI quanto o trabalhador a riscos trabalhistas.</li>
<li>Pagar salario abaixo do piso da categoria, quando esse piso existe e é superior ao salario minimo nacional.</li>
<li>Esquecer o exame medico admissional antes do inicio do trabalho.</li>
<li>Nao considerar o custo de ferias e 13o salario no planejamento financeiro mensal, tratando-os como "surpresa" no fim do ano.</li>
<li>Tentar manter dois funcionarios fixos simultaneamente, fora da exceao de substituiçııo temporaria prevista.</li>
</ul>

<h2>Quando contratar funcionario muda a logica do negocio</h2>

<p>Ter empregado aumenta significativamente a complexidade operacional do MEI, mesmo que o regime tributario continue o mesmo. Nesse ponto, muitos empreendedores avaliam se compensa continuar como MEI ou migrar para outra categoria empresarial, especialmente se o negocio ja estiver proximo do limite de faturamento permitido.</p>

<p>[Leia tambem: Limite de faturamento do MEI em 2026: como controlar, evitar desenquadramento e se preparar]</p>

<h2>FAQ</h2>

<p><strong>MEI pode contratar mais de um funcionario fixo?</strong><br>Nao, em regra. A exceao permite um segundo empregado apenas de forma temporaria, para substituir o titular em situaçııes especificas como ferias ou afastamento.</p>

<p><strong>O funcionario do MEI tem os mesmos direitos de qualquer empregado CLT?</strong><br>Sim. Direitos como FGTS, ferias, 13o salario e demais garantias trabalhistas se aplicam normalmente.</p>

<p><strong>Contratar funcionario exige sair do MEI?</strong><br>Nao necessariamente. É possivel contratar um funcionario permanecendo como MEI, respeitando o limite de um empregado (com a exceao mencionada).</p>

<p><strong>Onde faço o registro do funcionario?</strong><br>Pelo eSocial (gov.br/esocial), usando o modulo simplificado voltado a empregadores MEI.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>eSocial — gov.br/esocial (modulo simplificado para MEI).</li>
<li>Portal Gov.br — Empresas e Negocios: regras de contrataao para MEI.</li>
<li>Consolidaao das Leis do Trabalho (CLT) — direitos trabalhistas aplicaveis.</li>
</ul>

<h2>Proximo passo</h2>

<p>Antes de abrir uma vaga, simule o custo mensal completo (salario + FGTS + provisao de ferias e 13o) considerando o piso da categoria, se houver. So depois de confirmar que esse valor cabe no caixa do negocio, inicie o processo de admissao pelo eSocial.</p>`,
    category: 'MEI_OBRIGACOES',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['MEI funcionario', 'eSocial MEI', 'contratar CLT MEI', 'custo funcionario MEI', 'direitos trabalhistas'],
    metaTitle: 'MEI pode contratar funcionario? Veja quanto custa, quais sao as regras e como registrar no eSocial | Brazil MEI',
    metaDescription: 'O negocio cresceu e virou mais trabalho do que uma pessoa consegue dar conta. A pergunta natural é: da para contratar alguem formalmente ainda como MEI, ou',
  },

  'abrir-alterar-encerrar-mei-portal-empreendedor': {
    id: 15,
    slug: 'abrir-alterar-encerrar-mei-portal-empreendedor',
    title: 'Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor',
    excerpt: 'Formalizar um negocio, mudar de atividade ou fechar o CNPJ sao decisoes que geram duvidas parecidas: onde fazer isso oficialmente, o que é exigido e o que pode dar errado no processo....',
    content: `<h2>Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor</h2>

<h2>O problema</h2>

<p>Formalizar um negocio, mudar de atividade ou fechar o CNPJ sao decisoes que geram duvidas parecidas: onde fazer isso oficialmente, o que é exigido e o que pode dar errado no processo.</p>

<h2>Resposta rapida</h2>

<p>Abrir, alterar dados e encerrar o MEI sao processos gratuitos, feitos totalmente online pelo Portal do Empreendedor (gov.br/empreendedor), exigindo login com conta gov.br. Operaçııes como abertura, alteraao e baixa exigem, atualmente, conta gov.br em nivel Prata ou Ouro — contas de nivel Bronze (apenas e-mail e senha) nao tem mais acesso a essas funçııes. Ao final da abertura, o sistema gera automaticamente o CCMEI (Certificado da Condiao de Microempreendedor Individual), documento que comprova a formalizaao.</p>

<h2>Abrir o MEI</h2>

<p><strong>Elegibilidade</strong>: para se formalizar como MEI, a atividade exercida precisa estar entre as ocupaçııes permitidas para esse regime — nem toda atividade é elegivel, especialmente algumas profissoes intelectuais, tecnicas ou regulamentadas.</p>

<p><strong>Passo a passo</strong>:</p>
<ol>
<li>Acesse gov.br/empresas-e-negocios/pt-br/empreendedor e clique em "Quero ser MEI".</li>
<li>Clique em "Formalize-se" e faça login com CPF e senha da conta gov.br.</li>
<li>Se a conta estiver em nivel Bronze, sera necessario eleva-la para Prata ou Ouro antes de continuar.</li>
<li>Preencha os dados do negocio: endereao, CNAE (codigo da atividade), capital social.</li>
<li>Confirme as informaçııes e conclua o cadastro.</li>
<li>Baixe o CCMEI gerado automaticamente — esse documento comprova seu CNPJ e situaao cadastral.</li>
</ol>

<p><strong>Escolha do CNAE</strong>: é importante escolher a atividade que realmente corresponde ao que você faz, ja que o CNAE define, entre outras coisas, se determinada atividade é elegivel para o MEI e pode influenciar o valor do DAS (comercio, serviço ou ambos).</p>

<h2>Alterar dados cadastrais</h2>

<p>Mudanas como endereao, adiao de nova atividade (CNAE) ou alteraao de capital social sao feitas na mesma plataforma, na area "Ja sou MEI" → "Atualizaao Cadastral". O processo pede novamente CPF e codigo de segurançııa do contribuinte (CSC) para confirmar a identidade antes de liberar a ediao.</p>

<p>Trocar ou adicionar atividade pode mudar o valor do DAS mensal (por exemplo, se você passar de "apenas serviço" para "comercio e serviço") — vale confirmar o novo valor apos qualquer alteraao de CNAE.</p>

<p>[Leia tambem: Como pagar o DAS do MEI em 2026: passo a passo rapido, canais e cuidados para nao atrasar]</p>

<h2>Encerrar o MEI</h2>

<p>Encerrar o CNPJ (dar baixa) tambem é gratuito e feito integralmente online, na area "Ja sou MEI" → "Solicitaao de Baixa". Antes de solicitar, é recomendavel:</p>

<ul>
<li>Verificar se ha DAS em aberto e regularizar (pagar ou, ao menos, ter conhecimento do valor pendente).</li>
<li>Confirmar se a DASN-SIMEI referente ao periodo em que o MEI esteve ativo ja foi entregue (existe um prazo especifico de "Situaao Especial" para a declaraao de encerramento).</li>
</ul>

<p><strong>Passo a passo</strong>:</p>
<ol>
<li>Acesse "Ja sou MEI" → "Solicitaao de Baixa".</li>
<li>Informe CPF e confirme o CNPJ a ser encerrado.</li>
<li>Declare ciencia da decisao de encerramento.</li>
<li>Insira o codigo de confirmaao recebido.</li>
<li>Conclua — o CNPJ é cancelado imediatamente apos a confirmaao.</li>
</ol>

<p><strong>Ateno</strong>: encerrar o CNPJ interrompe a geraao de novas cobranas de DAS a partir daquele momento, mas nao elimina automaticamente dividas, multas ou declaraçııes pendentes referentes ao periodo em que o MEI esteve ativo. Debitos anteriores continuam existindo e podem ser cobrados mesmo depois da baixa.</p>

<p>[Leia tambem: DAS MEI atrasado: multa, juros, parcelamento e como decidir]</p>

<h2>Cenarios praticos</h2>

<p><strong>Pessoa informal que quer se formalizar</strong>: passa direto pelo processo de abertura, escolhendo o CNAE correspondente ao seu trabalho real, e recebe o CCMEI ao final.</p>

<p><strong>MEI que mudou de endereao ou quer adicionar uma atividade</strong>: usa a atualizaao cadastral, sem precisar abrir novo CNPJ.</p>

<p><strong>MEI que quer parar de operar, mas tem DAS atrasado</strong>: pode encerrar o CNPJ mesmo com pendencias, mas deve saber que a divida existente continua vinculada ao CPF do titular e pode ser cobrada normalmente depois da baixa.</p>

<h2>Erros comuns</h2>

<ul>
<li>Tentar abrir/alterar/encerrar com conta gov.br em nivel Bronze, sem saber que é preciso elevar o nivel antes.</li>
<li>Escolher CNAE que nao corresponde à atividade real exercida.</li>
<li>Encerrar o CNPJ achando que isso resolve dividas de DAS ou pendencias de DASN-SIMEI em aberto.</li>
<li>Nao entregar a DASN-SIMEI de "Situaao Especial" apos o encerramento, quando ela é exigida.</li>
<li>Perder o CCMEI e nao saber como emitir uma segunda via (pode ser reemitido pelo mesmo portal ou pelo aplicativo MEI, enquanto o CNPJ estiver ativo).</li>
</ul>

<h2>Checklist antes de encerrar</h2>

<ul>
<li>Conferir se todos os DAS mensais estao pagos (ou ao menos identificados, se houver pendencia).</li>
<li>Verificar se a DASN-SIMEI do ultimo periodo esta entregue.</li>
<li>Guardar copias de notas fiscais emitidas, mesmo depois do encerramento (a obrigaao de guarda por 5 anos nao desaparece com a baixa).</li>
<li>Confirmar se ha funcionario registrado que precise ser desligado formalmente antes do encerramento do CNPJ.</li>
</ul>

<h2>FAQ</h2>

<p><strong>Preciso de contador para abrir ou encerrar o MEI?</strong><br>Nao é exigido por lei — o processo é feito diretamente pelo empreendedor no Portal do Empreendedor. Ainda assim, apoio contabil pode ser util em casos com dividas ou situaçııes mais complexas.</p>

<p><strong>Posso reabrir um MEI depois de encerrado?</strong><br>Em geral, é possivel formalizar um novo MEI depois de um encerramento, desde que a pessoa continue elegivel, mas isso implica um novo CNPJ, e nao a reativaao do CNPJ anterior.</p>

<p><strong>O CCMEI substitui outros documentos da empresa?</strong><br>O CCMEI comprova a condiao de MEI e alguns dados cadastrais basicos, mas nao substitui, por exemplo, comprovantes de pagamento do DAS ou declaraçııes entregues.</p>

<p><strong>O que acontece com dividas depois de encerrar o CNPJ?</strong><br>Elas continuam existindo e vinculadas ao CPF do titular; o encerramento do CNPJ nao cancela debitoss anteriores.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal Gov.br — Empresas e Negocios: Portal do Empreendedor (abertura, alteraao e baixa de MEI).</li>
<li>Receita Federal do Brasil — mei.receita.economia.gov.br (emissao de CCMEI).</li>
<li>Conta gov.br — niveis de confiabilidade (Bronze, Prata, Ouro).</li>
</ul>

<h2>Proximo passo</h2>

<p>Se você esta pensando em encerrar o MEI, primeiro confira pendencias de DAS e DASN-SIMEI antes de solicitar a baixa. Se esta abrindo um MEI, confirme com atenao o CNAE antes de concluir o cadastro — trocar depois exige um processo adicional de alteraao.</p>`,
    category: 'MEI_CADASTRO',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['abrir MEI', 'encerrar MEI', 'CCMEI', 'Portal do Empreendedor', 'alteraao cadastral MEI'],
    metaTitle: 'Como abrir, alterar e encerrar seu MEI pelo Portal do Empreendedor | Brazil MEI',
    metaDescription: 'Formalizar um negocio, mudar de atividade ou fechar o CNPJ sao decisoes que geram duvidas parecidas: onde fazer isso oficialmente, o que é exigido e o que ',
  },

  'beneficios-inss-mei-aposentadoria-auxilio': {
    id: 16,
    slug: 'beneficios-inss-mei-aposentadoria-auxilio',
    title: 'Beneficios do INSS para MEI: aposentadoria, auxilio e como planejar suas contribuiçııes',
    excerpt: 'Pagar o DAS todo mês parece so uma obrigaao fiscal — mas parte desse valor é, na verdade, contribuiçııo previdenciaria. A pergunta que fica é: isso realmente garante algum beneficio no futuro, e o que...',
    content: `<h2>Beneficios do INSS para MEI: aposentadoria, auxilio e como planejar suas contribuiçııes</h2>

<h2>O problema</h2>

<p>Pagar o DAS todo mês parece so uma obrigaao fiscal — mas parte desse valor é, na verdade, contribuiçııo previdenciaria. A pergunta que fica é: isso realmente garante algum beneficio no futuro, e o que exatamente?</p>

<h2>Resposta rapida</h2>

<p>Sim. Parte do DAS-MEI corresponde a uma contribuiçııo ao INSS (5% do salario minimo, ou 12% para o MEI caminhoneiro), que da direito a beneficios como aposentadoria por idade, aposentadoria por incapacidade permanente, auxilio por incapacidade temporaria, salario-maternidade, alem de auxilio-reclusao e pensao por morte para dependentes[cite:18][cite:19]. Cada beneficio exige um numero minimo de contribuiçııes pagas em dia — chamado de carencia — contado a partir do primeiro pagamento feito dentro do prazo[cite:18].</p>

<h2>O que realmente importa</h2>

<p>A carencia é contada apenas com contribuiçııes pagas em dia, dentro do vencimento. Meses de DAS pagos com atraso podem nao contar da mesma forma para essa contagem — por isso, manter o pagamento regular tem impacto direto na proteao previdenciaria, alem da questao fiscal.</p>

<h2>Principais beneficios e carencia (regras gerais)</h2>

<table>
<thead>
<tr><th>Beneficio</th><th>Carencia minima</th><th>Observao</th></tr>
</thead>
<tbody>
<tr><td>Aposentadoria por idade</td><td>180 contribuiçııes mensais</td><td>Idade minima de 62 anos (mulher) ou 65 anos (homem)[cite:18][cite:20]</td></tr>
<tr><td>Auxilio por incapacidade temporaria (antigo auxilio-doena)</td><td>12 contribuiçııes mensais</td><td>Sujeito a pericia medica do INSS[cite:18]</td></tr>
<tr><td>Aposentadoria por incapacidade permanente (antiga invalidez)</td><td>12 contribuiçııes mensais, em regra</td><td>Sujeito a pericia medica do INSS[cite:18]</td></tr>
<tr><td>Salario-maternidade</td><td>Sem carencia minima na maioria dos casos</td><td>Regras especificas se aplicam; convem confirmar a situaao individual</td></tr>
<tr><td>Auxilio-reclusao</td><td>Carencia especifica (variavel conforme a regra vigente)</td><td>Destinado a dependentes do segurado recolhido à prisao, sob certas condiçııes</td></tr>
<tr><td>Pensao por morte</td><td>Sem carencia minima na maioria dos casos</td><td>Destinado a dependentes do segurado falecido</td></tr>
</tbody>
</table>

<p>Estes valores refletem as regras gerais de carencia aplicaveis a contribuintes na condiao de MEI, conforme informaçııes do Portal Gov.br[cite:18]. Regras especificas podem variar conforme a data de inicio da contribuiçııo, alteraçııes legislativas e situaao individual — por isso, tratam-se de parametros gerais, nao de garantia automatica de concessao.</p>

<h2>Como funciona a contribuiçııo do MEI</h2>

<p>Diferente de um empregado CLT, o MEI contribui com uma aliquota fixa sobre o salario minimo (nao sobre o valor real que fatura). Isso significa que o valor do beneficio futuro (como o de aposentadoria) tende a ser calculado com base no salario minimo vigente, e nao em um valor proporcional ao faturamento do negocio — a menos que o titular decida complementar a contribuiçııo.</p>

<h2>O que acontece quando as contribuiçııes sao interrompidas</h2>

<p>Meses sem pagamento do DAS (ou pagos com atraso) podem afetar a contagem continua da carencia. Uma interrupao longa pode, dependendo do caso, impactar o historico contributivo e a analise de manutenao da qualidade de segurado — a situaao exata deve ser verificada junto ao INSS ou por meio do extrato previdenciario (CNIS), ja que os efeitos variam conforme o tempo de interrupao e o beneficio pretendido.</p>

<h2>A contribuiçııo complementar</h2>

<p>O MEI que deseja um beneficio de valor superior ao piso (salario minimo) — por exemplo, para ter uma aposentadoria maior — pode, em algumas situaçııes, complementar sua contribuiçııo previdenciaria alem do percentual padrao. Essa é uma decisao financeira e previdenciaria que deve ser avaliada com cautela, considerando o custo mensal adicional frente ao beneficio adicional esperado, e o ideal é buscar orientao especializada para simular esse cenario com precisao.</p>

<h2>Cenarios praticos (ilustrativos, nao sao previsao de beneficio)</h2>

<p><strong>MEI que contribui continuamente desde a abertura do CNPJ</strong>: constroi, mês a mês, tempo de contribuiçııo que conta para a carencia de 180 meses da aposentadoria por idade, desde que os pagamentos sejam feitos dentro do vencimento.</p>

<p><strong>MEI que sofre um problema de saude apos alguns meses de contribuiçııo regular</strong>: pode ter direito ao auxilio por incapacidade temporaria, desde que ja tenha atingido a carencia minima de 12 contribuiçııes e passe pela pericia medica do INSS.</p>

<p><strong>MEI que interrompe o pagamento do DAS por mais de um ano</strong>: deve verificar, junto ao INSS, como essa lacuna afeta sua qualidade de segurado e a contagem de carencia antes de presumir que os direitos anteriores permanecem intactos automaticamente.</p>

<p>Estes exemplos servem apenas para ilustrar a logica de funcionamento das regras — nao substituem uma analise individual do historico contributivo de cada pessoa.</p>

<p>[Leia tambem: DAS MEI atrasado: multa, juros, parcelamento e como decidir]</p>

<h2>Erros comuns</h2>

<ul>
<li>Achar que qualquer contribuiçııo, mesmo em atraso, conta da mesma forma para a carencia.</li>
<li>Confundir contribuiçııo fixa sobre o salario minimo com contribuiçııo proporcional ao faturamento do negocio.</li>
<li>Presumir o valor exato de uma futura aposentadoria sem consultar o extrato oficial de contribuiçııes (CNIS) e, se necessario, o proprio INSS.</li>
<li>Deixar de considerar que interrupçııes longas podem afetar a qualidade de segurado, nao apenas a carencia.</li>
</ul>

<h2>Limitaçııes desta explicaao</h2>

<p>As regras previdenciarias tem exceçııes, atualizaçııes e particularidades que dependem do historico contributivo de cada pessoa, de mudanas legislativas e de decisoes administrativas do INSS. Este conteudo apresenta uma visao geral simplificada e nao substitui uma simulao previdenciaria individual, nem constitui prova de direito a qualquer beneficio especifico.</p>

<h2>FAQ</h2>

<p><strong>Contribuir como MEI garante aposentadoria automaticamente ao completar a idade minima?</strong><br>Nao automaticamente. É preciso cumprir tambem a carencia minima de contribuiçııes (em regra, 180 meses para aposentadoria por idade) alem da idade exigida.</p>

<p><strong>O valor do beneficio é sempre igual a um salario minimo?</strong><br>Para quem contribui apenas com a aliquota padrao do MEI, o calculo tende a ser baseado no salario minimo. Quem deseja um valor maior pode avaliar a complementaao de contribuiçııo, com orientao especializada.</p>

<p><strong>Atrasar o DAS por um mês compromete toda a carencia ja construida?</strong><br>Um unico atraso pontual tende a ter efeito diferente de uma interrupao prolongada, mas os efeitos exatos devem ser confirmados junto ao INSS, ja que dependem das regras vigentes e do historico individual.</p>

<p><strong>Onde posso conferir minhas contribuiçııes ja realizadas?</strong><br>Pelo extrato do CNIS (Cadastro Nacional de Informaçııes Sociais), disponivel nos canais oficiais do INSS e no aplicativo/portal Meu INSS.</p>

<h2>Fontes oficiais</h2>

<ul>
<li>Portal Gov.br — Empresas e Negocios: "Quem é MEI tem direito a quais beneficios previdenciarios?".</li>
<li>INSS — Meu INSS (extrato de contribuiçııes CNIS e regras de carencia).</li>
<li>Portal Gov.br — Pagamento da Contribuiçııo Mensal (DAS), composiao da aliquota previdenciaria do MEI.</li>
</ul>

<h2>Proximo passo</h2>

<p>Acesse o Meu INSS e confira seu extrato de contribuiçııes (CNIS) para saber exatamente quantos meses ja contam para sua carencia. Se notar lacunas ou duvidas sobre periodos especificos, busque orientao diretamente com o INSS antes de tomar decisoes sobre complementaao de contribuiçııo.</p>`,
    category: 'MEI_DAS',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800',
    author: { name: 'Equipe Editorial', avatarUrl: null },
    createdAt: '2026-01-20',
    tags: ['INSS MEI', 'aposentadoria MEI', 'carencia INSS', 'auxilio-doena MEI', 'salario-maternidade MEI'],
    metaTitle: 'Beneficios do INSS para MEI: aposentadoria, auxilio e como planejar suas contribuiçııes | Brazil MEI',
    metaDescription: 'Pagar o DAS todo mês parece so uma obrigaao fiscal — mas parte desse valor é, na verdade, contribuiçııo previdenciaria. A pergunta que fica é: isso realmen',
  },
};

const categoryLabels: Record<string, string> = {
  'MEI_DAS': 'DAS MEI',
  'MEI_FATURAMENTO': 'Faturamento',
  'DASN_SIMEI': 'DASN-SIMEI',
  'NOTA_FISCAL': 'Nota Fiscal',
  'MEI_OBRIGACOES': 'Obrigações',
  'MEI_CADASTRO': 'Cadastro MEI',
  'FERRAMENTAS': 'Ferramentas',
  'GUIA_COMPLETO': 'Guia Completo',
};

const categoryColors: Record<string, string> = {
  'MEI_DAS': 'blue',
  'MEI_FATURAMENTO': 'green',
  'DASN_SIMEI': 'blue',
  'NOTA_FISCAL': 'purple',
  'MEI_OBRIGACOES': 'orange',
  'MEI_CADASTRO': 'green',
  'FERRAMENTAS': 'cyan',
  'GUIA_COMPLETO': 'purple',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = staticGuides[slug];
  
  if (!post) return { title: 'Guia Não Encontrado | Brazil MEI' };
  
  return {
    title: post.metaTitle || `${post.title} | Brazil MEI`,
    description: post.metaDescription || post.excerpt || 'Guia prático para MEIs no Brasil.',
    openGraph: {
      title: post.metaTitle || `${post.title} | Brazil MEI`,
      description: post.metaDescription || post.excerpt || 'Guia prático para MEIs no Brasil.',
      images: post.imageUrl ? [post.imageUrl] : [],
    },
};
}

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  
  const post = staticGuides[slug];

  if (!post) notFound();

  const categoryLabels: Record<string, string> = {
    'MEI_DAS': 'DAS MEI',
    'MEI_FATURAMENTO': 'Faturamento',
    'DASN_SIMEI': 'DASN-SIMEI',
    'NOTA_FISCAL': 'Nota Fiscal',
    'MEI_OBRIGACOES': 'Obrigações',
    'MEI_CADASTRO': 'Cadastro MEI',
    'FERRAMENTAS': 'Ferramentas',
    'GUIA_COMPLETO': 'Guia Completo',
  };

  const categoryColors: Record<string, string> = {
    'MEI_DAS': 'blue',
    'MEI_FATURAMENTO': 'green',
    'DASN_SIMEI': 'blue',
    'NOTA_FISCAL': 'purple',
    'MEI_OBRIGACOES': 'orange',
    'MEI_CADASTRO': 'green',
    'FERRAMENTAS': 'cyan',
    'GUIA_COMPLETO': 'purple',
  };

  const categoryColor = categoryColors[post.category] || 'blue';
  const categoryLabel = categoryLabels[post.category] || post.category;

  return (
    <article className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)]`}>
      {/* HERO */}
      <header className="relative border-b border-[var(--color-border)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt=""
              fill
              className="object-cover opacity-15"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)] via-[var(--color-black)]/80 to-[var(--color-black)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32">
          <div className="mb-8">
            <Link
              href="/guias"
              className={`${mono.className} text-[var(--color-text-tertiary)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-blue-light)] transition-colors inline-flex items-center gap-1 mb-4`}
            >
              ← Voltar aos Guias
            </Link>
            <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-${categoryColor})] text-white rounded-full`}>
              {categoryLabel}
            </span>
          </div>

          <h1 className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 italic`}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl leading-relaxed font-light mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-tertiary)]">
            <div className="flex items-center gap-2">
              {post.author?.avatarUrl && (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-[var(--color-border)]"
                />
              )}
              <span className={`${mono.className} text-[10px] font-medium uppercase tracking-widest`}>
                {post.author?.name || 'Equipe Editorial'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-px h-4 bg-[var(--color-border)]" />
              <time className={`${mono.className} text-[10px] uppercase tracking-widest`}>
                {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
            <h3 className={`${mono.className} text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[var(--color-text-tertiary)]`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-black)] border border-[var(--color-border)] rounded-full text-[var(--color-text-tertiary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AUTHOR BIO */}
        {post.author && (
          <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
            <div className="flex items-start gap-6">
              {post.author.avatarUrl && (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full border border-[var(--color-border)] flex-shrink-0"
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                  {post.author.name}
                </h3>
                {post.author.bio && (
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RELATED GUIDES */}
        <section className="mt-16">
          <h2 className={`${playfair.className} text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-8`}>
            Guias Relacionados
          </h2>
          <RelatedGuides category={post.category} currentSlug={slug} />
        </section>
      </main>
    </article>
  );
}

async function RelatedGuides({ category, currentSlug }: { category: string; currentSlug: string }) {
  const related = Object.values(staticGuides)
    .filter((post) => post.category === category && post.slug !== currentSlug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((post) => (
        <Link
          key={post.id}
          href={`/guias/${post.slug}`}
          className="card-elevated group overflow-hidden"
        >
          <div className="card-media h-48 relative">
            <Image
              src={post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
              <span className="badge badge-blue">
                <span className="badge-dot" />
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="card-title text-lg font-bold mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors leading-tight flex-1">
              {post.title}
            </h3>
            <div className="card-footer flex items-center justify-between">
              <span className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-widest`}>
                {post.author?.name || 'Equipe Editorial'}
              </span>
              <span className={`${mono.className} text-[var(--color-blue-light)] text-[9px] font-black uppercase tracking-widest`}>
                Ler →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
