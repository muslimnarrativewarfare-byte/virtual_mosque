export const USER_ROLES = ['USER', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = 'USER';
export const ADMIN_ROLE: UserRole = 'ADMIN';

export function toUserRole(value: unknown): UserRole {
  if (value === 'ADMIN' || value === 'USER') {
    return value;
  }

  return DEFAULT_USER_ROLE;
}
