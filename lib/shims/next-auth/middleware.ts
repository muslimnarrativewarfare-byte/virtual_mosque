import { NextResponse } from 'next/server';

import type { AuthenticatedRequest } from './index';

type WithAuthOptions = {
  callbacks?: {
    authorized?: (params: { token?: Record<string, unknown> }) => boolean;
  };
};

export function withAuth(
  handler: (req: AuthenticatedRequest) => Response | Promise<Response>,
  options?: WithAuthOptions,
) {
  return async function wrapped(req: AuthenticatedRequest) {
    const allowed = options?.callbacks?.authorized?.({ token: req.nextauth?.token }) ?? true;

    if (!allowed) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const response = await handler(req);
    return response ?? NextResponse.next();
  };
}
