import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/api/auth";
import { errorResponse, successResponse } from "@/lib/api/errors";
import { announcementCreateSchema } from "@/lib/api/schemas";
import { parseAndValidate } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const mosque = await prisma.mosque.findUnique({ where: { id: params.id } });
  if (!mosque || mosque.status !== "APPROVED") {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const announcements = await prisma.announcement.findMany({
    where: { mosqueId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return successResponse(announcements);
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const mosque = await prisma.mosque.findUnique({ where: { id: params.id } });
  if (!mosque) {
    return errorResponse("NOT_FOUND", "Mosque not found", 404);
  }

  const canCreate = authResult.user.role === "ADMIN" || mosque.ownerId === authResult.user.id;
  if (!canCreate) {
    return errorResponse("FORBIDDEN", "You are not allowed to create announcements for this mosque", 403);
  }

  const payloadResult = await parseAndValidate(request, announcementCreateSchema);
  if (!payloadResult.ok) {
    return payloadResult.response;
  }

  const announcement = await prisma.announcement.create({
    data: {
      ...payloadResult.data,
      mosqueId: params.id,
      authorId: authResult.user.id,
    },
  });

  return successResponse(announcement, 201);
}
