import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/api/auth";
import { errorResponse, successResponse } from "@/lib/api/errors";
import { announcementUpdateSchema } from "@/lib/api/schemas";
import { parseAndValidate } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const existing = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!existing) {
    return errorResponse("NOT_FOUND", "Announcement not found", 404);
  }

  const mosque = await prisma.mosque.findUnique({ where: { id: existing.mosqueId } });
  if (!mosque) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const canEdit =
    authResult.user.role === "ADMIN" ||
    existing.authorId === authResult.user.id ||
    mosque.ownerId === authResult.user.id;
  if (!canEdit) {
    return errorResponse("FORBIDDEN", "You are not allowed to edit this announcement", 403);
  }

  const payloadResult = await parseAndValidate(request, announcementUpdateSchema);
  if (!payloadResult.ok) {
    return payloadResult.response;
  }

  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: payloadResult.data,
  });

  return successResponse(announcement);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const existing = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!existing) {
    return errorResponse("NOT_FOUND", "Announcement not found", 404);
  }

  const mosque = await prisma.mosque.findUnique({ where: { id: existing.mosqueId } });
  if (!mosque) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const canDelete =
    authResult.user.role === "ADMIN" ||
    existing.authorId === authResult.user.id ||
    mosque.ownerId === authResult.user.id;
  if (!canDelete) {
    return errorResponse("FORBIDDEN", "You are not allowed to delete this announcement", 403);
  }

  await prisma.announcement.delete({ where: { id: params.id } });

  return successResponse({ id: params.id, deleted: true });
}
