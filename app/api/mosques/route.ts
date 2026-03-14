import { NextRequest, NextResponse } from "next/server";

import { createMosque, listMosques } from "@/lib/mosques";

const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;

function isSafeImageDataUrl(value: string) {
  return /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(value);
}

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
  const imageDataUrl = String(body.imageDataUrl ?? "").trim();

  if (!name || !city || !country || !address || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { message: "name, city, country, address, latitude and longitude are required." },
      { status: 400 }
    );
  }

  if (imageDataUrl) {
    if (imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      return NextResponse.json({ message: "Image is too large. Please upload a smaller image." }, { status: 400 });
    }

    if (!isSafeImageDataUrl(imageDataUrl)) {
      return NextResponse.json({ message: "Unsupported image format." }, { status: 400 });
    }
  }

  try {
    const result = await createMosque({
      name,
      city,
      country,
      address,
      description: description || undefined,
      imageDataUrl: imageDataUrl || undefined,
      services,
      latitude,
      longitude
    });

    if (!result.created) {
      return NextResponse.json(
        { ...result.mosque, message: "This mosque already exists. Existing listing returned." },
        { status: 200 }
      );
    }

    return NextResponse.json(result.mosque, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create mosque" },
      { status: 500 }
    );
  }
}
