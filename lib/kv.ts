const KV_REST_API_URL =
  process.env.KV_REST_API_URL ?? process.env.STORAGE_KV_REST_API_URL ?? "";
const KV_REST_API_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.STORAGE_KV_REST_API_TOKEN ?? "";

function ensureKvConfig() {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    throw new Error("Missing Upstash KV REST configuration.");
  }
}

async function kvRequest<T>(command: unknown[]): Promise<T> {
  ensureKvConfig();

  const response = await fetch(KV_REST_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`KV request failed with ${response.status}`);
  }

  const data = (await response.json()) as { result: T; error?: string };
  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const result = await kvRequest<T | null>(["GET", key]);
  return result ?? null;
}

export async function kvSet(key: string, value: unknown) {
  await kvRequest<"OK">(["SET", key, JSON.stringify(value)]);
}

export async function kvDel(key: string) {
  await kvRequest<number>(["DEL", key]);
}

export async function kvSAdd(key: string, member: string) {
  await kvRequest<number>(["SADD", key, member]);
}

export async function kvSRem(key: string, member: string) {
  await kvRequest<number>(["SREM", key, member]);
}

export async function kvSMembers(key: string): Promise<string[]> {
  return kvRequest<string[]>(["SMEMBERS", key]);
}
