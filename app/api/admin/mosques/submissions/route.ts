import { NextRequest } from "next/server";

import { requireAdmin, requireAuth } from "@/lib/api/auth";
import { successResponse } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const adminError = requireAdmin(authResult.user);
  if (adminError) {
    return adminError;
  }

  const submissions = await prisma.mosque.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return successResponse(submissions);
}
