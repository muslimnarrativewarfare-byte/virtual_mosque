import Link from "next/link";

const quickLinks = [
  {
    href: "/mosques",
    title: "Browse mosques",
    description: "Search the directory and open mosque details.",
  },
  {
    href: "/dashboard",
    title: "Community dashboard",
    description: "Review announcements and key community updates.",
  },
  {
    href: "/admin",
    title: "Admin review",
    description: "Moderate submissions and manage records.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12 sm:px-10 lg:py-16">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Virtual Mosque</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Community-first mosque discovery platform
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          The core backend routes are now working. Next up is building a usable interface that helps people find
          mosques, track announcements, and keep community information up to date.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/mosques"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open mosque directory
          </Link>
          <Link
            href="/map"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Go to map view
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
          >
            <h2 className="text-lg font-semibold text-slate-900">{link.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
            <p className="mt-4 text-sm font-medium text-slate-700 group-hover:text-slate-900">Explore →</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
