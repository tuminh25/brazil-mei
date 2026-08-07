const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Sanitizes HTML content by removing dangerous patterns:
 * - Event handlers (onclick, onmouseover, onload, etc.)
 * - javascript: URLs
 * - script tags
 * - React-specific attributes (className, onClick, etc.)
 * - data-react attributes
 */
function sanitizeContent(html) {
  if (!html) return html;
  
  let sanitized = html;
  
  // Remove event handler attributes (onclick, onmouseover, onload, onerror, onsubmit, onfocus, onblur, etc.)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^>\s]+/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, 'removed-javascript:');
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<script\b[^>]*>/gi, '');
  
  // Remove React-specific attributes
  sanitized = sanitized.replace(/\s+className\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+className\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onClick\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onClick\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onMouseOver\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onMouseOver\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onMouseOut\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onMouseOut\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onLoad\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onLoad\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onError\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onError\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onSubmit\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onSubmit\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onFocus\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onFocus\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onBlur\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onBlur\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onChange\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onChange\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onKeyDown\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onKeyDown\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onKeyUp\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onKeyUp\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+onKeyPress\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+onKeyPress\s*=\s*[^>\s]+/gi, '');
  
  // Remove dangerouslySetInnerHTML
  sanitized = sanitized.replace(/\s+dangerouslySetInnerHTML\s*=\s*\{[^}]*\}/gi, '');
  
  // Remove data-react attributes
  sanitized = sanitized.replace(/\s+data-react\w*\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+data-react\w*\s*=\s*[^>\s]+/gi, '');
  sanitized = sanitized.replace(/\s+data-reactroot\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+data-reactroot\s*=\s*[^>\s]+/gi, '');
  
  // Remove function declarations and arrow functions in HTML (shouldn't be there but just in case)
  sanitized = sanitized.replace(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}/gi, '');
  sanitized = sanitized.replace(/=>\s*\{[^}]*\}/gi, '');
  
  return sanitized;
}

async function main() {
  console.log('Fetching all posts...');
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      excerpt: true
    }
  });
  
  console.log(`Found ${posts.length} posts to check.`);
  
  let updated = 0;
  let errors = 0;
  
  for (const post of posts) {
    const originalContent = post.content || '';
    const originalExcerpt = post.excerpt || '';
    
    const sanitizedContent = sanitizeContent(originalContent);
    const sanitizedExcerpt = sanitizeContent(originalExcerpt);
    
    if (sanitizedContent !== originalContent || sanitizedExcerpt !== originalExcerpt) {
      try {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            content: sanitizedContent,
            excerpt: sanitizedExcerpt
          }
        });
        console.log(`✅ Updated: ${post.slug} (ID: ${post.id})`);
        updated++;
      } catch (e) {
        console.error(`❌ Error updating ${post.slug}:`, e.message);
        errors++;
      }
    }
  }
  
  console.log(`\nDone! Updated: ${updated}, Errors: ${errors}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });