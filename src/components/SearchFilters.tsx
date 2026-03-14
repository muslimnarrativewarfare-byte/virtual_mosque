"use client";

interface SearchFiltersProps {
  query: string;
  city: string;
  onQueryChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export function SearchFilters({ query, city, onQueryChange, onCityChange }: SearchFiltersProps) {
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <input
        aria-label="Search mosques"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by name or service"
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
      <input
        aria-label="Filter by city"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        placeholder="Filter by city"
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
    </section>
  );
}
