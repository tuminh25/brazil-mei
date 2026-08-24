import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STATIC_HOMEPAGE_PATH = '/static-homepage.html';
const STATIC_404_PATH = '/static-404.html';

function isSimpleClient(request: NextRequest): boolean {
  const nextjsData = request.headers.get('x-nextjs-data');
  const purpose = request.headers.get('purpose');
  const accept = request.headers.get('accept') || '';
  
  if (nextjsData === '1') return false;
  if (purpose === 'prefetch') return false;
  if (accept.includes('application/json') && !accept.includes('text/html')) return false;
  
  const userAgent = request.headers.get('user-agent') || '';
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i,
    /python/i, /go-http/i, /java/i, /axios/i, /node/i,
    /pingdom/i, /uptime/i, /monitor/i, /check/i, /audit/i,
    /agent/i, /ai/i, /llm/i, /gpt/i, /claude/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(userAgent))) return true;
  
  return !accept.includes('text/html') || userAgent === '';
}

function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/markdown');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Markdown negotiation for real guides
  if (wantsMarkdown(request) && pathname.startsWith('/guides/') && !pathname.startsWith('/guides?') && !pathname.includes('/api/')) {
    const slug = pathname.replace('/guides/', '');
    if (slug && !slug.includes('/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/markdown/guides/${slug}`;
      return NextResponse.rewrite(url);
    }
  }
  
  if (isSimpleClient(request)) {
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = STATIC_HOMEPAGE_PATH;
      return NextResponse.rewrite(url);
    }
    
    if (pathname === '/_not-found' || pathname.startsWith('/_not-found')) {
      const url = request.nextUrl.clone();
      url.pathname = STATIC_404_PATH;
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/_not-found/:path*',
  ],
};