import { NextRequest } from "next/server";

import { requireAdmin, requireAuth } from "@/lib/api/auth";
import { errorResponse, successResponse } from "@/lib/api/errors";
import { moderationSchema } from "@/lib/api/schemas";
import { parseAndValidate } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const adminError = requireAdmin(authResult.user);
  if (adminError) {
    return adminError;
  }

  const payloadResult = await parseAndValidate(request, moderationSchema);
  if (!payloadResult.ok) {
    return payloadResult.response;
  }

  const mosque = await prisma.mosque.findUnique({ where: { id: params.id } });
  if (!mosque) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const status = payloadResult.data.action === "APPROVE" ? "APPROVED" : "REJECTED";

  const updated = await prisma.mosque.update({
    where: { id: params.id },
    data: {
      status,
      moderationReason: payloadResult.data.reason ?? null,
      moderatedBy: authResult.user.id,
      moderatedAt: new Date(),
    },
  });

  return successResponse(updated);
}
