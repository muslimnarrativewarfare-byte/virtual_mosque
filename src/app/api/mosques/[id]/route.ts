import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { deleteMosque, updateMosque } from "@/lib/mosqueRepo";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(request.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const mosque = await updateMosque(params.id, body);
  return NextResponse.json(mosque);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(request.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteMosque(params.id);
  return NextResponse.json({ success: true });
}
