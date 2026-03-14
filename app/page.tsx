import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12 sm:px-10 lg:py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Virtual Mosque</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Version 1: Find and add mosques in your city
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Browse our initial mosque directory, open location details with Google Maps, and submit a mosque to make the
          community map more complete.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/mosques" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Browse mosques
          </Link>
          <Link href="/map" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
            Open map
          </Link>
          <Link href="/add" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
            Add mosque
          </Link>
        </div>
      </section>
    </main>
  );
}
