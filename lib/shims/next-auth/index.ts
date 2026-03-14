import type { NextRequest } from 'next/server';

export interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export interface NextAuthOptions {
  session?: { strategy?: string };
  providers?: unknown[];
  callbacks?: Record<string, (...args: any[]) => any>;
  pages?: Record<string, string>;
}

export default function NextAuth(_options: NextAuthOptions) {
  return async function handler() {
    return new Response(JSON.stringify({ error: 'Auth provider is unavailable in this build.' }), {
      status: 501,
      headers: { 'content-type': 'application/json' },
    });
  };
}

export async function getServerSession(_options?: NextAuthOptions): Promise<any> {
  return null;
}

export interface AuthenticatedRequest extends NextRequest {
  nextauth: {
    token?: Record<string, unknown>;
  };
}
