import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import { ADMIN_ROLE, type UserRole } from './lib/auth/roles';

const DASHBOARD_ALLOWED_ROLES: UserRole[] = [ADMIN_ROLE];

export default withAuth(
  function middleware(req) {
    const tokenRole = req.nextauth.token?.role as UserRole | undefined;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin') && tokenRole !== ADMIN_ROLE) {
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
