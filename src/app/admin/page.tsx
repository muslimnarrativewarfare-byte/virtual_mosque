import { headers } from "next/headers";
import { isAuthorized } from "@/lib/auth";

export default function AdminPanelPage() {
  const headerStore = headers();
  const token = headerStore.get("x-admin-token");
  const authorized = isAuthorized(token);

  if (!authorized) {
    return (
      <section>
        <h1>Admin Panel</h1>
        <p>Unauthorized. Provide a valid admin token to manage mosque listings.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1>Admin Panel</h1>
      <p>Review submissions, edit mosque information, and curate announcements.</p>
      <ul>
        <li>• Pending approvals</li>
        <li>• User-reported corrections</li>
        <li>• Content moderation queue</li>
      </ul>
    </section>
  );
}
