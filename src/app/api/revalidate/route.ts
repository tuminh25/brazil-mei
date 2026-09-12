// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(path);
  revalidatePath('/guias/[slug]', 'page');

  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  let body: { paths?: string[]; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { paths, secret } = body;
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: 'paths must be a non-empty array' }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }
  // Always revalidate dynamic guide routes
  revalidatePath('/guias/[slug]', 'page');

  return NextResponse.json({
    revalidated: true,
    paths,
    timestamp: new Date().toISOString(),
  });
}