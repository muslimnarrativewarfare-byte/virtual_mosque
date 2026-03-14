"use client";

import { useMemo, useState } from "react";
import { MosqueCard } from "@/components/MosqueCard";
import { SearchFilters } from "@/components/SearchFilters";
import { sampleMosques } from "@/lib/mockData";

export default function MosqueDirectoryPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(
    () =>
      sampleMosques.filter((mosque) => {
        const text = `${mosque.name} ${mosque.services.join(" ")}`.toLowerCase();
        const matchesQuery = !query || text.includes(query.toLowerCase());
        const matchesCity = !city || mosque.city.toLowerCase().includes(city.toLowerCase());
        return matchesQuery && matchesCity;
      }),
    [query, city]
  );

  return (
    <section className="space-y-4">
      <h1>Mosque Directory</h1>
      <SearchFilters query={query} city={city} onQueryChange={setQuery} onCityChange={setCity} />
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {filtered.map((mosque) => (
          <MosqueCard key={mosque.id} mosque={mosque} />
        ))}
      </div>
    </section>
  );
}
