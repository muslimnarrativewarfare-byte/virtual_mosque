import { notFound } from "next/navigation";
import { AnnouncementList } from "@/components/AnnouncementList";
import { sampleMosques } from "@/lib/mockData";

export default function MosqueDetailsPage({ params }: { params: { id: string } }) {
  const mosque = sampleMosques.find((entry) => entry.id === params.id);
  if (!mosque) notFound();

  return (
    <article className="space-y-4">
      <h1>{mosque.name}</h1>
      <p>{mosque.city}, {mosque.country}</p>
      <p>Prayer times: {mosque.prayerTimes ?? "Contact mosque"}</p>
      <section>
        <h2>Services</h2>
        <ul>
          {mosque.services.map((service) => (
            <li key={service}>• {service}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Announcements</h2>
        <AnnouncementList announcements={mosque.announcements} />
      </section>
    </article>
  );
}
