import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exact exclusion list: do NOT redirect internal Next routes, assets, API endpoints,
  // welcome page, manifest, service worker, favicon, or any static file with an extension.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api') ||
    pathname === '/welcome' ||
    pathname.startsWith('/welcome/') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const localeCookie = request.cookies.get('krishi_locale');
  if (!localeCookie?.value || !['en', 'kn', 'hi'].includes(localeCookie.value)) {
    const welcomeUrl = new URL('/welcome', request.url);
    return NextResponse.redirect(welcomeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image
     * - favicon.ico, manifest.json, sw.js
     * - assets/*
     * - api/*
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|assets/|api/).*)',
  ],
};
