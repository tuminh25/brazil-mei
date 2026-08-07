const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      slug: {
        in: [
          'singapore-events-attractions-2026-complete-guide',
          'singapore-2026-mrt-cdc-vouchers-ai-economy',
          'universal-studios-singapore-guide-2026'
        ]
      }
    },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true
    }
  });
  
  posts.forEach(p => {
    console.log('=== POST:', p.slug, '===');
    console.log('ID:', p.id);
    console.log('Title:', p.title);
    console.log('Content length:', p.content?.length);
    
    if (p.content) {
      // Search for any React-specific patterns
      const reactPatterns = [
        'className',
        'onClick',
        'onMouseOver',
        'onMouseOut',
        'onLoad',
        'onError',
        'onSubmit',
        'onFocus',
        'onBlur',
        'onChange',
        'onKeyDown',
        'onKeyUp',
        'onKeyPress',
        'dangerouslySetInnerHTML',
        'data-react',
        'data-reactroot',
      ];
      
      reactPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        const matches = p.content.match(regex);
        if (matches) {
          console.log('⚠️  FOUND:', pattern, '->', matches.length, 'occurrences');
        }
      });
      
      // Also check for any function-like patterns
      const functionPattern = /function\s+\w+\s*\(/gi;
      const funcMatches = p.content.match(functionPattern);
      if (funcMatches) {
        console.log('⚠️  FOUND function declarations:', funcMatches.slice(0, 5));
      }
      
      // Check for arrow functions
      const arrowPattern = /=>\s*{/gi;
      const arrowMatches = p.content.match(arrowPattern);
      if (arrowMatches) {
        console.log('⚠️  FOUND arrow functions:', arrowMatches.length, 'occurrences');
      }
      
      // Print full content to file for manual inspection
      const fs = require('fs');
      fs.writeFileSync(`content-${p.slug}.html`, p.content);
      console.log('Full content saved to content-' + p.slug + '.html');
    }
    console.log('---');
  });
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });