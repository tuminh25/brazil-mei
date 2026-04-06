// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// GET handler to fetch existing post data by slug
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Fetch API Error:', error);
    return NextResponse.json({ error: '❌ Server error while fetching post.' }, { status: 500 });
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
      tripUrl,
      klookUrl,
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

    const slugToUse = slug.toLowerCase().replace(/\s+/g, '-');

    // Use upsert to create or update based on the unique slug
    const postData = {
      title: name,
      slug: slugToUse,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200',
      content: description,
      excerpt: autoExcerpt,
      category: normalizedCategory,
      status: 'PUBLISHED',
      isNewsjack: normalizedCategory === 'News',
      insiderPrice: normalizedCategory === 'Evergreen' ? (insiderPrice || null) : null,
      bestTime: normalizedCategory === 'Evergreen' ? (bestTime || null) : null,
      secretTip: normalizedCategory === 'Evergreen' ? (secretTip || null) : null,
      tripUrl: tripUrl || null,
      klookUrl: klookUrl || null,
    };

    const post = await prisma.post.upsert({
      where: { slug: slugToUse },
      update: postData,
      create: postData,
    });

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error: any) {
    console.error('Submit API Error:', error);
    return NextResponse.json({ error: '❌ Server error. Please try again.' }, { status: 500 });
  }
}