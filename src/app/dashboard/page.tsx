import Link from "next/link";
import { sampleMosques } from "@/lib/mockData";

export default function MosqueDashboardPage() {
  const totalAnnouncements = sampleMosques.reduce((sum, mosque) => sum + mosque.announcements.length, 0);

  return (
    <section className="space-y-4">
      <h1>Mosque Dashboard</h1>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ padding: "1rem", border: "1px solid #cbd5e1", borderRadius: 12, background: "white" }}>
          <p>Total mosques</p>
          <strong>{sampleMosques.length}</strong>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #cbd5e1", borderRadius: 12, background: "white" }}>
          <p>Announcements</p>
          <strong>{totalAnnouncements}</strong>
        </div>
      </div>
      <Link href="/admin" style={{ color: "#047857", fontWeight: 600 }}>Open admin panel →</Link>
    </section>
  );
}
