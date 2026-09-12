// src/lib/content-utils.ts
// Shared utilities for content processing (usable on both server and client)

/**
 * Adds IDs to H2 headings in HTML content for anchor linking
 */
export function addHeadingIds(content: string): string {
  if (!content) return content;
  
  let headingIndex = 0;
  
  return content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, innerContent) => {
    const cleanText = innerContent.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return match;
    
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
    
    headingIndex++;
    return `<h2${attrs} id="${id}">${innerContent}</h2>`;
  });
}

/**
 * Extracts H2 headings from HTML content for Table of Contents
 */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  
  if (content) {
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;
    
    while ((match = h2Regex.exec(content)) !== null) {
      const cleanText = match[1].replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        const id = cleanText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 60);
        
        headings.push({
          id,
          text: cleanText,
          level: 2
        });
      }
    }
  }
  
  return headings;
}

/**
 * Keywords that indicate a "decision point" for each category
 * Used to find the best place to inject a contextual MEI tool
 */
const DECISION_POINT_KEYWORDS: Record<string, string[]> = {
  MEI_DAS: ['das', 'pagamento', 'boleto', 'pix', 'vencimento', 'multa', 'atraso', 'débito', 'calcular', 'valor', 'inss', 'icms', 'iss'],
  MEI_FATURAMENTO: ['faturamento', 'limite', 'receita', 'teto', 'desenquadramento', 'microempresa', 'calcular', 'controle', 'mensal', 'anual', '81000'],
  DASN_SIMEI: ['dasn', 'simei', 'declaração', 'anual', 'prazo', 'maio', 'retificação', 'multa', 'atraso', 'entregar', 'preencher'],
  NOTA_FISCAL: ['nota fiscal', 'nf-e', 'nfs-e', 'emitir', 'emissão', 'obrigatório', 'pj', 'pf', 'gratuita', 'portal', 'sefaz', 'prefeitura'],
  MEI_OBRIGACOES: ['obrigações', 'mensal', 'checklist', 'documentos', 'guarda', 'conta pj', 'separar', 'finanças', 'funcionário', 'contratar', 'esocial'],
  MEI_CADASTRO: ['abrir', 'formalizar', 'cnpj', 'cnae', 'atividade', 'permitida', 'documentos', 'cpf', 'título eleitor', 'endereço', 'gov.br'],
  FERRAMENTAS: ['calculadora', 'verificador', 'checklist', 'simulador', 'planejar', 'calcular', 'controle', 'orçamento'],
  GUIA_COMPLETO: ['guia', 'completo', 'tudo', 'passo a passo', 'como fazer', 'explicação', 'dúvidas', 'perguntas'],
};

/**
 * Finds the index of the H2 heading that best matches a "decision point" for the given category
 * Returns the index of the heading (0-based) or -1 if no good match found
 */
export function findDecisionPointHeading(content: string, category: string): number {
  if (!content) return -1;
  
  const keywords = DECISION_POINT_KEYWORDS[category] || DECISION_POINT_KEYWORDS.FERRAMENTAS;
  const headings: { index: number; text: string; matchScore: number }[] = [];
  
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  let headingIndex = 0;
  
  while ((match = h2Regex.exec(content)) !== null) {
    const cleanText = match[1].replace(/<[^>]*>/g, '').trim().toLowerCase();
    if (cleanText) {
      // Calculate match score based on keyword presence
      let matchScore = 0;
      for (const keyword of keywords) {
        if (cleanText.includes(keyword.toLowerCase())) {
          matchScore += 1;
        }
      }
      
      if (matchScore > 0) {
        headings.push({ index: headingIndex, text: cleanText, matchScore });
      }
      headingIndex++;
    }
  }
  
  if (headings.length === 0) return -1;
  
  // Sort by match score (descending), then by index (ascending - prefer earlier headings)
  headings.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.index - b.index;
  });
  
  // Return the index of the best matching heading
  // But skip the very first heading (index 0) to avoid inserting right after intro
  const bestMatch = headings.find(h => h.index > 0) || headings[0];
  return bestMatch.index;
}

/**
 * Splits content at a specific H2 heading index
 * Returns { beforeHtml, afterHtml } where the split occurs AFTER the closing </h2> of the target heading
 */
export function splitContentAtHeading(content: string, headingIndex: number): { beforeHtml: string; afterHtml: string } {
  if (!content || headingIndex < 0) {
    return { beforeHtml: content, afterHtml: '' };
  }
  
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  let currentIndex = 0;
  let splitPosition = -1;
  
  while ((match = h2Regex.exec(content)) !== null) {
    if (currentIndex === headingIndex) {
      // Split after this closing </h2>
      splitPosition = match.index + match[0].length;
      break;
    }
    currentIndex++;
  }
  
  if (splitPosition === -1) {
    return { beforeHtml: content, afterHtml: '' };
  }
  
  return {
    beforeHtml: content.substring(0, splitPosition),
    afterHtml: content.substring(splitPosition)
  };
}