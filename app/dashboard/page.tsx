import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await getSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="page dashboard-page">
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}</p>
      <section aria-labelledby="wire-status">
        <h2 id="wire-status">Bank wires are not available yet</h2>
        <p>
          This customer app is not connected to an authenticated wire-transfer service.
          No wire can be initiated or tracked here.
        </p>
        <Link href="/wire-transfers">View wire service status</Link>
      </section>
      <section aria-labelledby="shipping-tools">
        <h2 id="shipping-tools">FedEx parcel shipping</h2>
        <p>Separate sandbox-only tools for domestic rate quotes, test labels, and tracking.</p>
        <Link href="/shipping">Open shipping tools</Link>
      </section>
    </main>
  );
}
