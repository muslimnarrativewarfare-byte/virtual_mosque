import { randomUUID } from "node:crypto";

import { kvDel, kvGet, kvSAdd, kvSMembers, kvSRem, kvSet } from "@/lib/kv";

export type MosqueRecord = {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  description?: string;
  imageDataUrl?: string;
  services: string[];
  latitude: number;
  longitude: number;
  createdAt: string;
};

const MOSQUE_INDEX_KEY = "mosques:index";

function mosqueKey(id: string) {
  return `mosque:${id}`;
}

export async function listMosques(): Promise<MosqueRecord[]> {
  const ids = await kvSMembers(MOSQUE_INDEX_KEY);
  const mosques = await Promise.all(ids.map((id) => kvGet<MosqueRecord>(mosqueKey(id))));

  return mosques
    .filter((entry): entry is MosqueRecord => Boolean(entry))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getMosque(id: string): Promise<MosqueRecord | null> {
  return kvGet<MosqueRecord>(mosqueKey(id));
}

export async function createMosque(payload: Omit<MosqueRecord, "id" | "createdAt">): Promise<MosqueRecord> {
  const mosque: MosqueRecord = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  await kvSet(mosqueKey(mosque.id), mosque);
  await kvSAdd(MOSQUE_INDEX_KEY, mosque.id);

  return mosque;
}

export async function deleteMosque(id: string) {
  await kvDel(mosqueKey(id));
  await kvSRem(MOSQUE_INDEX_KEY, id);
}
