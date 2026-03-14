import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10 lg:py-16">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Virtual Mosque</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Discover, contribute, and navigate to mosques near you
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          A polished V1 directory with add/remove mosque management, location picking from map, Google Maps integration,
          and image upload support for better community listings.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/mosques" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            Browse mosques
          </Link>
          <Link href="/map" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400">
            Explore map
          </Link>
          <Link href="/add" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400">
            Add mosque
          </Link>
        </div>
      </section>
    </main>
  );
}
