import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

type UserRole = 'USER' | 'ADMIN';

const DASHBOARD_ALLOWED_ROLES: UserRole[] = ['ADMIN'];

export default withAuth(
  function middleware(req) {
    const tokenRole = req.nextauth.token?.role as UserRole | undefined;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin') && tokenRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (
      pathname.startsWith('/dashboard') &&
      (!tokenRole || !DASHBOARD_ALLOWED_ROLES.includes(tokenRole))
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
