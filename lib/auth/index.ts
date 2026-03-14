import type { UserRole } from './roles';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from './options';

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth();

  if (session.user.role !== role) {
    redirect('/unauthorized');
  }

  return session;
}

export async function requireAnyRole(roles: UserRole[]) {
  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    redirect('/unauthorized');
  }

  return session;
}
