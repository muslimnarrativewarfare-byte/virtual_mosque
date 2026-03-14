import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const DASHBOARD_ALLOWED_ROLES: Role[] = [Role.MOSQUE_ADMIN, Role.PLATFORM_ADMIN];

export default withAuth(
  function middleware(req) {
    const tokenRole = req.nextauth.token?.role as Role | undefined;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin') && tokenRole !== Role.PLATFORM_ADMIN) {
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
