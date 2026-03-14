import { MapView } from "@/components/MapView";
import { sampleMosques } from "@/lib/mockData";

export default function MapExplorerPage() {
  return (
    <section className="space-y-4">
      <h1>Map Explorer</h1>
      <p>Find mosques near your location and open details quickly.</p>
      <MapView mosques={sampleMosques} />
    </section>
  );
}
