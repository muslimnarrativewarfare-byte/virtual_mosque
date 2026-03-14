import { listMosques } from "@/lib/mosques";

import MapClient from "./map-client";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const mosques = await listMosques();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 sm:px-10">
      <MapClient mosques={mosques} />
    </main>
  );
}
