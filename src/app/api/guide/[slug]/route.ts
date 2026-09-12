import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

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

function readStatic404(): string {
  try {
    const filePath = path.join(process.cwd(), 'public', 'static-404.html');
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>404 - Não Encontrado</title></head>
<body><h1>Página Não Encontrada</h1><p>A página que você procura não existe.</p><a href="/">Voltar à Inicial</a></body></html>`;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const accept = request.headers.get('accept') || '';
  const wantsMd = accept.includes('text/markdown');

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      if (wantsMd) {
        return NextResponse.json(
          { error: 'Guia não encontrado' },
          { status: 404, headers: { 'Vary': 'Accept' } }
        );
      }
      const html = readStatic404();
      return new NextResponse(html, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }

    if (wantsMd) {
      const markdown = `# ${post.title}\n\n` +
        `*${post.excerpt || 'Guia prático para MEIs no Brasil.'}*\n\n` +
        `**Categoria:** ${post.category}\n\n` +
        `---\n\n` +
        htmlToMarkdown(post.content) +
        `\n\n---\n\n` +
        `*Publicado por ${post.author?.name || 'Brazil MEI'} em ${new Date(post.createdAt).toLocaleDateString('pt-BR')}*\n` +
        `*Fonte: [${post.title}](${request.nextUrl.origin}/guias/${post.slug})*`;

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const url = request.nextUrl.clone();
    url.pathname = `/guias/${slug}`;
    return NextResponse.rewrite(url);
  } catch (error) {
    console.error('Guide API Error:', error);
    if (wantsMd) {
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500, headers: { 'Vary': 'Accept' } }
      );
    }
    const html = readStatic404();
    return new NextResponse(html, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}