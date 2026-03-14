import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { createMosque, listMosques } from "@/lib/mosqueRepo";

export async function GET() {
  const mosques = await listMosques();
  return NextResponse.json(mosques);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || !body.city || !body.country || typeof body.latitude !== "number" || typeof body.longitude !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const mosque = await createMosque({
    name: body.name,
    city: body.city,
    country: body.country,
    madhab: body.madhab,
    prayerTimes: body.prayerTimes,
    services: Array.isArray(body.services) ? body.services : [],
    latitude: body.latitude,
    longitude: body.longitude
  });

  return NextResponse.json(mosque, { status: 201 });
}
