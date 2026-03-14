import { listMosques } from "@/lib/mosques";

import MosqueListClient from "./mosque-list-client";

export const dynamic = "force-dynamic";

export default async function MosquesPage() {
  const mosques = await listMosques();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12 sm:px-10">
      <MosqueListClient initialMosques={mosques} />
    </main>
  );
}
