const KV_REST_API_URL =
  process.env.KV_REST_API_URL ?? process.env.STORAGE_KV_REST_API_URL ?? "";
const KV_REST_API_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.STORAGE_KV_REST_API_TOKEN ?? "";

const hasRemoteKvConfig = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);

const memoryValues = new Map<string, string>();
const memorySets = new Map<string, Set<string>>();

async function kvRequest<T>(command: unknown[]): Promise<T> {
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
  if (!hasRemoteKvConfig) {
    const raw = memoryValues.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  const result = await kvRequest<string | null>(["GET", key]);
  return result ? (JSON.parse(result) as T) : null;
}

export async function kvSet(key: string, value: unknown) {
  const encoded = JSON.stringify(value);

  if (!hasRemoteKvConfig) {
    memoryValues.set(key, encoded);
    return;
  }

  await kvRequest<"OK">(["SET", key, encoded]);
}

export async function kvDel(key: string) {
  if (!hasRemoteKvConfig) {
    memoryValues.delete(key);
    memorySets.delete(key);
    return;
  }

  await kvRequest<number>(["DEL", key]);
}

export async function kvSAdd(key: string, member: string) {
  if (!hasRemoteKvConfig) {
    const set = memorySets.get(key) ?? new Set<string>();
    set.add(member);
    memorySets.set(key, set);
    return;
  }

  await kvRequest<number>(["SADD", key, member]);
}

export async function kvSRem(key: string, member: string) {
  if (!hasRemoteKvConfig) {
    const set = memorySets.get(key);
    if (!set) return;
    set.delete(member);
    return;
  }

  await kvRequest<number>(["SREM", key, member]);
}

export async function kvSMembers(key: string): Promise<string[]> {
  if (!hasRemoteKvConfig) {
    return Array.from(memorySets.get(key) ?? []);
  }

  return kvRequest<string[]>(["SMEMBERS", key]);
}
