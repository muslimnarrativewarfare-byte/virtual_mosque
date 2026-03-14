import Link from "next/link";

import { listMosques } from "@/lib/mosques";

export const dynamic = "force-dynamic";

export default async function MosquesPage() {
  const mosques = await listMosques();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 sm:px-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mosque directory</h1>
          <p className="mt-2 text-sm text-slate-600">{mosques.length} mosque(s) currently listed in version 1.</p>
        </div>
        <Link href="/add" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Add mosque
        </Link>
      </div>

      {mosques.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
          No mosques yet. Add the first mosque to start the directory.
        </section>
      ) : (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {mosques.map((mosque) => (
            <article key={mosque.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{mosque.name}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {mosque.city}, {mosque.country}
              </p>
              <p className="mt-1 text-sm text-slate-600">{mosque.address}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/mosques/${mosque.id}`} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700">
                  Details
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mosque.latitude},${mosque.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700"
                >
                  Google Maps
                </a>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
