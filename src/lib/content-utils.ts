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
 * Used to find the best place to inject a contextual resident tool
 */
const DECISION_POINT_KEYWORDS: Record<string, string[]> = {
  HOUSING: ['affordability', 'budget', 'calculate', 'eligibility', 'loan', 'mortgage', 'down payment', 'price', 'cost', 'financial'],
  MONEY: ['cpf', 'contribution', 'retirement', 'savings', 'payout', 'salary', 'income', 'tax', 'investment', 'budget'],
  HEALTHCARE: ['clinic', 'hospital', 'doctor', 'medical', 'healthcare', 'insurance', 'medisave', 'subsidy', 'find', 'nearby'],
  TRANSPORT: ['fare', 'cost', 'mrt', 'bus', 'transport', 'commute', 'travel', 'ride', 'grab', 'taxi', 'calculate'],
  FOOD: ['hawker', 'price', 'food', 'eat', 'dining', 'centre', 'stall', 'meal', 'budget', 'affordable'],
  WORK: ['salary', 'benchmark', 'pay', 'income', 'career', 'job', 'employment', 'industry', 'compare', 'market rate'],
  LIFESTYLE: ['neighborhood', 'area', 'district', 'live', 'amenities', 'facilities', 'compare', 'choose'],
  STUDY: ['school', 'distance', 'primary', 'secondary', 'education', 'enroll', 'admission', 'nearby', 'home'],
  NEIGHBORHOOD: ['compare', 'neighborhood', 'district', 'area', 'versus', 'vs', 'choose', 'decide', 'which'],
  TOOLS: ['calculate', 'plan', 'budget', 'affordability', 'cost', 'compare'],
};

/**
 * Finds the index of the H2 heading that best matches a "decision point" for the given category
 * Returns the index of the heading (0-based) or -1 if no good match found
 */
export function findDecisionPointHeading(content: string, category: string): number {
  if (!content) return -1;
  
  const keywords = DECISION_POINT_KEYWORDS[category] || DECISION_POINT_KEYWORDS.TOOLS;
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
