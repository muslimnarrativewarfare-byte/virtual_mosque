import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/api/auth";
import { errorResponse, successResponse } from "@/lib/api/errors";
import { mosqueCreateSchema } from "@/lib/api/schemas";
import { parseAndValidate } from "@/lib/api/validation";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mosques = await prisma.mosque.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return successResponse(mosques);
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const payloadResult = await parseAndValidate(request, mosqueCreateSchema);
  if (!payloadResult.ok) {
    return payloadResult.response;
  }

  try {
    const mosque = await prisma.mosque.create({
      data: {
        ...payloadResult.data,
        ownerId: authResult.user.id,
        status: authResult.user.role === "ADMIN" ? "APPROVED" : "PENDING",
      },
    });

    return successResponse(mosque, 201);
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to create mosque", 500);
  }
}
