import Link from "next/link";
import { Mosque } from "@/types/mosque";

export function MosqueCard({ mosque }: { mosque: Mosque }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{mosque.name}</h3>
      <p className="text-sm text-slate-600">{mosque.city}, {mosque.country}</p>
      <p className="mt-2 text-xs text-slate-500">Madhab: {mosque.madhab ?? "Community"}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {mosque.services.slice(0, 3).map((service) => (
          <li key={service} className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">{service}</li>
        ))}
      </ul>
      <Link href={`/mosques/${mosque.id}`} className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-900">
        View details →
      </Link>
    </article>
  );
}
