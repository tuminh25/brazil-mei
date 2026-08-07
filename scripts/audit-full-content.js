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
  
  const dangerousPatterns = [
    /on\w+\s*=/gi,           // onclick, onmouseover, onload, etc.
    /javascript:/gi,         // javascript: URLs
    /<script/gi,             // script tags
    /className\s*=/gi,       // React className
    /onClick\s*=/gi,         // React onClick
    /onMouseOver\s*=/gi,     // React onMouseOver
    /onLoad\s*=/gi,          // React onLoad
    /onError\s*=/gi,         // React onError
    /onSubmit\s*=/gi,        // React onSubmit
    /onFocus\s*=/gi,         // React onFocus
    /onBlur\s*=/gi,          // React onBlur
  ];
  
  posts.forEach(p => {
    console.log('=== POST:', p.slug, '===');
    console.log('ID:', p.id);
    console.log('Title:', p.title);
    console.log('Content length:', p.content?.length);
    
    if (p.content) {
      dangerousPatterns.forEach(pattern => {
        const matches = p.content.match(pattern);
        if (matches) {
          console.log('⚠️  FOUND:', pattern, '->', matches.slice(0, 10));
        }
      });
      
      // Also search for the specific error pattern
      if (p.content.includes('onClick') || p.content.includes('onClick') || p.content.includes('className')) {
        console.log('--- FULL CONTENT SEARCH FOR REACT PATTERNS ---');
        const lines = p.content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('onClick') || line.includes('className') || line.includes('onMouse') || line.includes('onLoad') || line.includes('onError') || line.includes('onSubmit') || line.includes('onFocus') || line.includes('onBlur')) {
            console.log(`Line ${i+1}:`, line.substring(0, 200));
          }
        });
      }
    }
    console.log('---');
  });
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });