import { prisma } from "@/lib/prisma";

async function main() {
  // Clean up existing posts
  await prisma.post.deleteMany();

  await prisma.post.createMany({
    data: [
      {
        slug: "o-que-e-das-mei-como-pagar",
        title: "O que é DAS MEI e como pagar em 2026",
        excerpt: "Guia completo sobre o Documento de Arrecadação do Simples Nacional para MEI: valores, vencimentos, formas de pagamento e o que acontece se atrasar.",
        content: "<p>O DAS MEI (Documento de Arrecadação do Simples Nacional) é a guia única de pagamento dos tributos do Microempreendedor Individual...</p>",
        category: "MEI_DAS",
        status: "PUBLISHED",
        tags: ["DAS", "pagamento", "tributos", "2026"],
        metaTitle: "DAS MEI 2026: Valor, Vencimento e Como Pagar | Brazil MEI",
        metaDescription: "Guia completo sobre DAS MEI 2026: valores atualizados, data de vencimento, formas de pagamento (PIX, boleto, débito automático) e consequências do atraso.",
      },
      {
        slug: "limite-faturamento-mei-2026",
        title: "Limite de faturamento MEI 2026: R$ 81.000 e o que muda",
        excerpt: "Entenda o teto de faturamento anual do MEI, como calcular seu faturamento mensal, o que acontece se ultrapassar e as regras de desenquadramento.",
        content: "<p>O limite de faturamento do MEI para 2026 é de R$ 81.000,00 por ano...</p>",
        category: "MEI_FATURAMENTO",
        status: "PUBLISHED",
        tags: ["faturamento", "limite", "desenquadramento", "2026"],
        metaTitle: "Limite Faturamento MEI 2026: R$ 81.000 | Brazil MEI",
        metaDescription: "Teto de faturamento MEI 2026 é R$ 81.000/ano. Saiba como calcular, o que acontece se ultrapassar, regras de desenquadramento e transição para ME.",
      },
      {
        slug: "dasn-simei-2026-passo-a-passo",
        title: "DASN-SIMEI 2026: Passo a passo para declarar",
        excerpt: "Como fazer a Declaração Anual do Simples Nacional do MEI (DASN-SIMEI): prazo, documentos necessários, como preencher e evitar multa.",
        content: "<p>A DASN-SIMEI é a declaração anual obrigatória do MEI. O prazo para 2026 é até 31 de maio...</p>",
        category: "DASN_SIMEI",
        status: "PUBLISHED",
        tags: ["DASN-SIMEI", "declaração anual", "prazo", "2026"],
        metaTitle: "DASN-SIMEI 2026: Como Declarar, Prazo e Multa | Brazil MEI",
        metaDescription: "Guia completo da DASN-SIMEI 2026: passo a passo para declarar, prazo até 31/05, documentos necessários, valor da multa por atraso e como retificar.",
      },
      {
        slug: "nota-fiscal-mei-obrigatoriedade-como-emitir",
        title: "Nota Fiscal MEI: Quando é obrigatória e como emitir grátis",
        excerpt: "Entenda quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e gratuitamente nos portais estaduais/municipais e erros comuns a evitar.",
        content: "<p>O MEI é obrigado a emitir nota fiscal nas vendas para outras empresas (PJ)...</p>",
        category: "NOTA_FISCAL",
        status: "PUBLISHED",
        tags: ["nota fiscal", "NF-e", "NFS-e", "emissão gratuita"],
        metaTitle: "Nota Fiscal MEI 2026: Obrigatoriedade e Emissão Gratuita | Brazil MEI",
        metaDescription: "Quando o MEI deve emitir nota fiscal, como emitir NF-e e NFS-e grátis, diferença entre elas, erros comuns e penalidades por não emitir.",
      },
      {
        slug: "obrigacoes-mensais-mei-checklist",
        title: "Obrigações mensais do MEI: Checklist completo 2026",
        excerpt: "Tudo que o MEI deve fazer todo mês: pagar DAS, emitir notas, guardar documentos, controlar faturamento. Checklist para não esquecer nada.",
        content: "<p>Ser MEI traz simplicidade, mas não isenta de obrigações. Todo mês você deve...</p>",
        category: "MEI_OBRIGACOES",
        status: "PUBLISHED",
        tags: ["obrigações", "checklist", "mensal", "compliance"],
        metaTitle: "Obrigações Mensais MEI 2026: Checklist Completo | Brazil MEI",
        metaDescription: "Checklist completo das obrigações mensais do MEI: pagamento DAS, emissão de notas, controle de faturamento, guarda de documentos e declarações anuais.",
      },
      {
        slug: "como-abrir-mei-2026-passo-a-passo",
        title: "Como abrir MEI em 2026: Passo a passo gratuito no Gov.br",
        excerpt: "Guia completo para formalizar seu MEI grátis pelo Portal do Empreendedor: documentos, CNAEs permitidos, tempo de aprovação e primeiros passos depois do CNPJ.",
        content: "<p>Abrir MEI em 2026 é 100% digital e gratuito pelo Portal do Empreendedor (gov.br/empresas-e-negocios)...</p>",
        category: "MEI_CADASTRO",
        status: "PUBLISHED",
        tags: ["abrir MEI", "formalização", "CNPJ", "Gov.br", "2026"],
        metaTitle: "Como Abrir MEI 2026: Passo a Passo Gratuito | Brazil MEI",
        metaDescription: "Como abrir MEI grátis em 2026: passo a passo no Portal do Empreendedor, documentos necessários, CNAEs permitidos, tempo de aprovação e o que fazer após obter o CNPJ.",
      },
      {
        slug: "mei-pode-contratar-funcionario-regras-2026",
        title: "MEI pode contratar funcionário? Regras, custos e como fazer em 2026",
        excerpt: "Sim, MEI pode contratar 1 funcionário. Entenda as regras, custos totais (salário + encargos), como registrar no eSocial e obrigações trabalhistas.",
        content: "<p>O MEI pode contratar até 1 (um) funcionário com carteira assinada, recebendo um salário-mínimo ou o piso da categoria...</p>",
        category: "MEI_OBRIGACOES",
        status: "PUBLISHED",
        tags: ["contratação", "funcionário", "eSocial", "encargos", "2026"],
        metaTitle: "MEI Pode Contratar Funcionário 2026: Regras e Custos | Brazil MEI",
        metaDescription: "MEI pode contratar 1 funcionário. Veja regras, custos totais (salário + INSS + FGTS + outros), como registrar no eSocial e obrigações trabalhistas mensais/anuais.",
      },
      {
        slug: "calculadora-das-mei-2026",
        title: "Calculadora DAS MEI 2026: Simule seu pagamento mensal",
        excerpt: "Ferramenta gratuita para calcular o valor exato do seu DAS MEI em 2026: INSS + ICMS/ISS conforme sua atividade. Valores oficiais atualizados.",
        content: "<p>Use nossa calculadora para saber exatamente quanto pagará de DAS MEI em 2026...</p>",
        category: "FERRAMENTAS",
        status: "PUBLISHED",
        tags: ["calculadora", "DAS", "simulador", "2026"],
        metaTitle: "Calculadora DAS MEI 2026: Simule seu Pagamento | Brazil MEI",
        metaDescription: "Calculadora gratuita do DAS MEI 2026. Insira sua atividade (comércio, indústria, serviços) e veja o valor exato: INSS 5% + ICMS/ISS. Valores oficiais.",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });