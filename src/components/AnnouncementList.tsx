import { Announcement } from "@/types/mosque";

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) {
    return <p className="text-sm text-slate-500">No announcements yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {announcements.map((announcement) => (
        <li key={announcement.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="font-medium text-slate-900">{announcement.title}</p>
          <p className="text-sm text-slate-600">{announcement.body}</p>
        </li>
      ))}
    </ul>
  );
}
