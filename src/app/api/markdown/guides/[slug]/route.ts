import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (_, content) => content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (_, content) => {
      let i = 0;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${++i}. $1\n`) + '\n';
    })
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '---\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/markdown')) {
    return NextResponse.json(
      { error: 'Not Acceptable. Use Accept: text/markdown' },
      { status: 406, headers: { 'Vary': 'Accept' } }
    );
  }

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404, headers: { 'Vary': 'Accept' } }
      );
    }

    const markdown = `# ${post.title}\n\n` +
      `*${post.excerpt || 'Practical guide for living in Singapore.'}*\n\n` +
      `**Category:** ${post.category}${post.neighborhood ? ` | **Neighborhood:** ${post.neighborhood}` : ''}\n\n` +
      `---\n\n` +
      htmlToMarkdown(post.content) +
      `\n\n---\n\n` +
      `*Published by ${post.author?.name || 'SG Events Hub'} on ${new Date(post.createdAt).toLocaleDateString('en-SG')}*\n` +
      `*Source: [${post.title}](${request.nextUrl.origin}/guides/${post.slug})*`;

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Markdown API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Vary': 'Accept' } }
    );
  }
}