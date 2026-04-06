// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json({ error: 'Missing required fields: name, slug, description' }, { status: 400 });
    }

    // Normalize category — only Evergreen or News allowed
    const normalizedCategory = category === 'News' ? 'News' : 'Evergreen';

    // Auto-generate excerpt if not provided
    const cleanText = description.replace(/<[^>]*>/g, '');
    const autoExcerpt = excerpt || (cleanText.length > 160 ? cleanText.substring(0, 160) + '...' : cleanText);

    // All submissions go to the Post model
    const post = await prisma.post.create({
      data: {
        title: name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200',
        content: description,
        excerpt: autoExcerpt,
        category: normalizedCategory,
        status: 'PUBLISHED',
        isNewsjack: normalizedCategory === 'News',
        // Insider Intelligence fields (Evergreen only)
        insiderPrice: normalizedCategory === 'Evergreen' ? (insiderPrice || null) : null,
        bestTime: normalizedCategory === 'Evergreen' ? (bestTime || null) : null,
        secretTip: normalizedCategory === 'Evergreen' ? (secretTip || null) : null,
      },
    });

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error: any) {
    console.error('Submit API Error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: '❌ Slug already exists. Choose a unique URL.' }, { status: 409 });
    }

    return NextResponse.json({ error: '❌ Server error. Please try again.' }, { status: 500 });
  }
}