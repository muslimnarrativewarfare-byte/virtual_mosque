import { listMosques } from "@/lib/mosques";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const mosques = await listMosques();
  const center = mosques[0];

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 sm:px-10">
      <h1 className="text-3xl font-bold text-slate-900">Map view</h1>
      <p className="mt-2 text-sm text-slate-600">Google Maps for quick location lookup in version 1.</p>

      {center ? (
        <iframe
          title="Mosque map"
          src={`https://www.google.com/maps?q=${center.latitude},${center.longitude}&z=11&output=embed`}
          className="mt-6 h-[480px] w-full rounded-xl border border-slate-200"
          loading="lazy"
        />
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
          Add a mosque first to initialize the map.
        </p>
      )}

      {mosques.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm text-slate-700">
          {mosques.map((mosque) => (
            <li key={mosque.id}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mosque.latitude},${mosque.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {mosque.name} — {mosque.city}, {mosque.country}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
