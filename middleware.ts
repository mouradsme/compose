import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_NAME } from './common/config';
import { UserSessionData } from '@/common/types/common';
import { adminNavSide, navSide } from './common/temp';

const privateLinks = [
  ...navSide,
  ...adminNavSide,
  ...[{ url: '/admin/dashboard' }, { url: '/dashboard' }],
].map((link) => {
  if (link.url === '') {
    return { ...link, url: 'unknown' };
  }
  return link;
});

export async function middleware(request: NextRequest) {
  const data = request.cookies.get(ACCESS_TOKEN_NAME);
  // If no user data in cookies
  if (!data) {
    // If trying to access private links, redirect to login
    if (privateLinks.some((link) => request.nextUrl.pathname.startsWith(link.url))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const user = JSON.parse(data.value) as UserSessionData;

  const isAdmin = user.authorities.includes('ROLE_ADMIN');

  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If a user exists and tries to access discover or learning-paths, redirect
  // to dashboard/learning-paths
  if (['/', '/learning-paths'].includes(request.nextUrl.pathname)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard/courses/list', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/learning-paths', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
