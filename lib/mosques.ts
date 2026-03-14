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

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function toDedupKey(mosque: Pick<MosqueRecord, "name" | "city" | "country" | "address" | "latitude" | "longitude">) {
  return [
    normalize(mosque.name),
    normalize(mosque.city),
    normalize(mosque.country),
    normalize(mosque.address),
    mosque.latitude.toFixed(6),
    mosque.longitude.toFixed(6)
  ].join("|");
}

function dedupeMosques(entries: MosqueRecord[]) {
  const seen = new Set<string>();
  const result: MosqueRecord[] = [];

  for (const mosque of entries) {
    const dedupeKey = toDedupKey(mosque);
    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    result.push(mosque);
  }

  return result;
}

export async function listMosques(): Promise<MosqueRecord[]> {
  const ids = await kvSMembers(MOSQUE_INDEX_KEY);
  const mosques = await Promise.all(ids.map((id) => kvGet<MosqueRecord>(mosqueKey(id))));

  return dedupeMosques(
    mosques
      .filter((entry): entry is MosqueRecord => Boolean(entry))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  );
}

export async function getMosque(id: string): Promise<MosqueRecord | null> {
  return kvGet<MosqueRecord>(mosqueKey(id));
}

export async function createMosque(payload: Omit<MosqueRecord, "id" | "createdAt">): Promise<{ mosque: MosqueRecord; created: boolean }> {
  const existing = await listMosques();
  const incomingKey = toDedupKey(payload);
  const duplicate = existing.find((entry) => toDedupKey(entry) === incomingKey);

  if (duplicate) {
    return { mosque: duplicate, created: false };
  }

  const mosque: MosqueRecord = {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  await kvSet(mosqueKey(mosque.id), mosque);
  await kvSAdd(MOSQUE_INDEX_KEY, mosque.id);

  return { mosque, created: true };
}

export async function deleteMosque(id: string) {
  await kvDel(mosqueKey(id));
  await kvSRem(MOSQUE_INDEX_KEY, id);
}
