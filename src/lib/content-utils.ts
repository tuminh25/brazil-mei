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