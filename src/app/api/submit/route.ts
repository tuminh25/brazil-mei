// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// GET handler to fetch existing post data by slug
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Parâmetro slug ausente' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Fetch API Error:', error);
    return NextResponse.json({ error: 'Erro no servidor ao buscar post.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      imageUrl,
      description,
      excerpt,
      category,
      insiderPrice,
      bestTime,
      secretTip,
    } = body;

    // Validate required fields
    if (!name || !slug || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios: name, slug, description' }, { status: 400 });
    }

    // Normalize category — use new PostCategory enum
    const validCategories = ['MEI_DAS', 'MEI_FATURAMENTO', 'DASN_SIMEI', 'NOTA_FISCAL', 'MEI_OBRIGACOES', 'MEI_CADASTRO', 'FERRAMENTAS', 'GUIA_COMPLETO'];
    const normalizedCategory = validCategories.includes(category) ? category : 'GUIA_COMPLETO';

    // Auto-generate excerpt if not provided
    const cleanText = description.replace(/<[^>]*>/g, '');
    const autoExcerpt = excerpt || (cleanText.length > 160 ? cleanText.substring(0, 160) + '...' : cleanText);

    const slugToUse = slug.toLowerCase().replace(/\s+/g, '-');

    // Use upsert to create or update based on the unique slug
    const postData = {
      title: name,
      slug: slugToUse,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
      content: description,
      excerpt: autoExcerpt,
      category: normalizedCategory as any, // Prisma enum cast
      status: 'PUBLISHED' as any, // Prisma enum cast
      insiderPrice: insiderPrice || null,
      bestTime: bestTime || null,
      secretTip: secretTip || null,
    };

    const post = await prisma.post.upsert({
      where: { slug: slugToUse },
      update: postData,
      create: postData,
    });

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error: any) {
    console.error('Submit API Error:', error);
    return NextResponse.json({ error: 'Erro no servidor. Tente novamente.' }, { status: 500 });
  }
}