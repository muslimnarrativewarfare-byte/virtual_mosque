import { NextRequest, NextResponse } from "next/server";

import { createMosque, listMosques } from "@/lib/mosques";

export async function GET() {
  try {
    const mosques = await listMosques();
    return NextResponse.json(mosques);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch mosques" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;

  const name = String(body.name ?? "").trim();
  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "").trim();
  const address = String(body.address ?? "").trim();
  const description = String(body.description ?? "").trim();
  const services = Array.isArray(body.services)
    ? body.services.map((service) => String(service).trim()).filter(Boolean)
    : String(body.services ?? "")
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean);
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!name || !city || !country || !address || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { message: "name, city, country, address, latitude and longitude are required." },
      { status: 400 }
    );
  }

  try {
    const mosque = await createMosque({
      name,
      city,
      country,
      address,
      description: description || undefined,
      services,
      latitude,
      longitude
    });

    return NextResponse.json(mosque, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create mosque" },
      { status: 500 }
    );
  }
}
