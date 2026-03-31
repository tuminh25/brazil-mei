// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, imageUrl, description, category } = body;

    // PHÂN LOẠI DATA ĐỂ LƯU VÀO ĐÚNG BẢNG
    if (category === 'Expert Guide' || category === 'Trending') {
      // Lưu vào bảng POST (Tin tức/Cẩm nang)
      await prisma.post.create({
        data: {
          title: name,
          slug: slug,
          imageUrl: imageUrl,
          content: description,
          category: category,
          excerpt: description.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
          status: 'PUBLISHED'
        }
      });
    } else {
      // Lưu vào bảng EVENT (Sự kiện/Attraction)
      await prisma.event.create({
        data: {
          name: name,
          slug: slug,
          imageUrl: imageUrl,
          description: description,
          category: category,
          startDate: new Date(),
          status: 'PUBLISHED',
          aiSummary: description.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}