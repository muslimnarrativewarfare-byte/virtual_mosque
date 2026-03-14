import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMosque } from "@/lib/mosques";

type Props = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export default async function MosqueDetailsPage({ params }: Props) {
  const mosque = await getMosque(params.id);

  if (!mosque) {
    notFound();
  }

  const mapSrc = `https://www.google.com/maps?q=${mosque.latitude},${mosque.longitude}&z=15&output=embed`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 sm:px-10">
      <Link href="/mosques" className="text-sm font-medium text-slate-600 hover:text-slate-900">
        ← Back to directory
      </Link>

      <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{mosque.name}</h1>
        <p className="mt-2 text-slate-700">
          {mosque.address}, {mosque.city}, {mosque.country}
        </p>
        {mosque.imageDataUrl ? (
          <Image
            src={mosque.imageDataUrl}
            alt={mosque.name}
            width={1400}
            height={700}
            unoptimized
            className="mt-6 h-72 w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : null}
        {mosque.description ? <p className="mt-4 text-sm leading-6 text-slate-700">{mosque.description}</p> : null}

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Services</h2>
          {mosque.services.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No services listed yet.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {mosque.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Google Map</h2>
          <iframe title={`${mosque.name} map`} src={mapSrc} className="h-80 w-full rounded-lg border border-slate-200" loading="lazy" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mosque.latitude},${mosque.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700"
          >
            Open in Google Maps
          </a>
        </section>
      </article>
    </main>
  );
}
