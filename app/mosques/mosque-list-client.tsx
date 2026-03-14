"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { MosqueRecord } from "@/lib/mosques";

type Props = {
  initialMosques: MosqueRecord[];
};

export default function MosqueListClient({ initialMosques }: Props) {
  const [mosques, setMosques] = useState(initialMosques);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const totalLabel = useMemo(() => `${mosques.length} mosque(s) currently listed.`, [mosques.length]);

  async function removeMosque(id: string) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/mosques/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ?? "Unable to remove mosque.");
        return;
      }

      setMosques((current) => current.filter((mosque) => mosque.id !== id));
    } catch {
      setError("Network error while removing mosque.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mosque directory</h1>
          <p className="mt-2 text-sm text-slate-600">{totalLabel}</p>
        </div>
        <Link href="/add" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Add mosque
        </Link>
      </div>

      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {mosques.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
          No mosques yet. Add the first mosque to start the directory.
        </section>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          {mosques.map((mosque) => {
            const displayName = mosque.name?.trim() || "Unnamed mosque";
            const displayCity = mosque.city?.trim() || "Unknown city";
            const displayCountry = mosque.country?.trim() || "Unknown country";
            const displayAddress = mosque.address?.trim() || "Address not provided";

            return (
            <article key={mosque.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {mosque.imageDataUrl ? (
                <Image src={mosque.imageDataUrl} alt={displayName} width={1200} height={480} unoptimized className="h-44 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {displayCity}, {displayCountry}
                </p>
                <p className="mt-1 text-sm text-slate-600">{displayAddress}</p>
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
                  <button
                    type="button"
                    disabled={deletingId === mosque.id}
                    onClick={() => removeMosque(mosque.id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 disabled:opacity-50"
                  >
                    {deletingId === mosque.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </article>
          );
          })}
        </section>
      )}
    </>
  );
}
