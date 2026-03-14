import { prisma } from "@/lib/prisma";

export interface MosquePayload {
  name: string;
  city: string;
  country: string;
  madhab?: string | null;
  prayerTimes?: string | null;
  services: string[];
  latitude: number;
  longitude: number;
}

export async function listMosques() {
  return prisma.mosque.findMany({ include: { announcements: true }, orderBy: { createdAt: "desc" } });
}

export async function createMosque(payload: MosquePayload) {
  return prisma.mosque.create({ data: payload, include: { announcements: true } });
}

export async function updateMosque(id: string, payload: Partial<MosquePayload>) {
  return prisma.mosque.update({ where: { id }, data: payload, include: { announcements: true } });
}

export async function deleteMosque(id: string) {
  return prisma.mosque.delete({ where: { id } });
}
