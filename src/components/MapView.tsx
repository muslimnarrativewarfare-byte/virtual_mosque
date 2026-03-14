import dynamic from "next/dynamic";
import { Mosque } from "@/types/mosque";

const DynamicMap = dynamic(() => import("@/components/MapViewClient").then((mod) => mod.MapViewClient), {
  ssr: false,
  loading: () => <p className="text-sm text-slate-500">Loading map…</p>
});

export function MapView({ mosques }: { mosques: Mosque[] }) {
  return <DynamicMap mosques={mosques} />;
}
