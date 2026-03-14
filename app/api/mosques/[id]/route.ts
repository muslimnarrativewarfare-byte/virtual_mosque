import { NextRequest, NextResponse } from "next/server";

import { deleteMosque, getMosque } from "@/lib/mosques";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const mosque = await getMosque(params.id);
    if (!mosque) {
      return NextResponse.json({ message: "Mosque not found" }, { status: 404 });
    }

    return NextResponse.json(mosque);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch mosque" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await deleteMosque(params.id);
    return NextResponse.json({ id: params.id, deleted: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete mosque" },
      { status: 500 }
    );
  }
}
