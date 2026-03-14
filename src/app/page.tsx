import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1>Virtual Mosque Hub</h1>
      <p>Discover local mosques, announcements, services, and community programs from your phone first.</p>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Link href="/mosques" style={{ padding: "1rem", background: "white", border: "1px solid #cbd5e1", borderRadius: 12 }}>
          Browse mosque directory
        </Link>
        <Link href="/map" style={{ padding: "1rem", background: "white", border: "1px solid #cbd5e1", borderRadius: 12 }}>
          Explore map view
        </Link>
        <Link href="/add" style={{ padding: "1rem", background: "white", border: "1px solid #cbd5e1", borderRadius: 12 }}>
          Submit a mosque
        </Link>
      </div>
    </section>
  );
}
