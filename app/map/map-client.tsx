"use client";

import { useMemo, useState } from "react";

import type { MosqueRecord } from "@/lib/mosques";

type Props = {
  mosques: MosqueRecord[];
};

export default function MapClient({ mosques }: Props) {
  const [selectedId, setSelectedId] = useState(mosques[0]?.id ?? "");
  const selectedMosque = useMemo(() => mosques.find((mosque) => mosque.id === selectedId) ?? mosques[0], [mosques, selectedId]);

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900">Map view</h1>
      <p className="mt-2 text-sm text-slate-600">Explore mosque locations and open them in Google Maps.</p>

      {selectedMosque ? (
        <>
          <iframe
            title="Mosque map"
            src={`https://www.google.com/maps?q=${selectedMosque.latitude},${selectedMosque.longitude}&z=14&output=embed`}
            className="mt-6 h-[460px] w-full rounded-xl border border-slate-200"
            loading="lazy"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedMosque.latitude},${selectedMosque.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Open {selectedMosque.name} in Google Maps
          </a>
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
          Add a mosque first to initialize the map.
        </p>
      )}

      {mosques.length > 0 ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {mosques.map((mosque) => (
            <li key={mosque.id}>
              <button
                type="button"
                onClick={() => setSelectedId(mosque.id)}
                className={`w-full rounded-lg border p-3 text-left ${
                  selectedMosque?.id === mosque.id ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-semibold text-slate-900">{mosque.name}</p>
                <p className="text-sm text-slate-600">
                  {mosque.city}, {mosque.country}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
