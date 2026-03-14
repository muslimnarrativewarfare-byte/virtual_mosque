import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/api/auth";
import { errorResponse, successResponse } from "@/lib/api/errors";
import { mosqueUpdateSchema } from "@/lib/api/schemas";
import { parseAndValidate } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const mosque = await prisma.mosque.findUnique({ where: { id: params.id } });

  if (!mosque || mosque.status !== "APPROVED") {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  return successResponse(mosque);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const existing = await prisma.mosque.findUnique({ where: { id: params.id } });
  if (!existing) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const canEdit = authResult.user.role === "ADMIN" || existing.ownerId === authResult.user.id;
  if (!canEdit) {
    return errorResponse("FORBIDDEN", "You are not allowed to edit this mosque", 403);
  }

  const payloadResult = await parseAndValidate(request, mosqueUpdateSchema);
  if (!payloadResult.ok) {
    return payloadResult.response;
  }

  const mosque = await prisma.mosque.update({
    where: { id: params.id },
    data: {
      ...payloadResult.data,
      status: authResult.user.role === "ADMIN" ? existing.status : "PENDING",
    },
  });

  return successResponse(mosque);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const existing = await prisma.mosque.findUnique({ where: { id: params.id } });
  if (!existing) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const canDelete = authResult.user.role === "ADMIN" || existing.ownerId === authResult.user.id;
  if (!canDelete) {
    return errorResponse("FORBIDDEN", "You are not allowed to delete this mosque", 403);
  }

  await prisma.mosque.delete({ where: { id: params.id } });

  return successResponse({ id: params.id, deleted: true });
}
