import { NextRequest } from "next/server";

import { errorResponse } from "./errors";

export type UserRole = "USER" | "ADMIN";

export type RequestUser = {
  id: string;
  role: UserRole;
};

export function getRequestUser(request: NextRequest): RequestUser | null {
  const id = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role") as UserRole | null;

  if (!id || (role !== "USER" && role !== "ADMIN")) {
    return null;
  }

  return { id, role };
}

export function requireAuth(request: NextRequest):
  | {
      ok: true;
      user: RequestUser;
    }
  | {
      ok: false;
      response: ReturnType<typeof errorResponse>;
    } {
  const user = getRequestUser(request);

  if (!user) {
    return {
      ok: false,
      response: errorResponse("UNAUTHORIZED", "Authentication required", 401),
    };
  }

  return { ok: true, user };
}

export function requireAdmin(user: RequestUser) {
  if (user.role !== "ADMIN") {
    return errorResponse("FORBIDDEN", "Admin role required", 403);
  }

  return null;
}
