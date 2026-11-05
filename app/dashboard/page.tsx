import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="page dashboard-page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/wire-transfers">Bank wires</Link><Link href="/shipping">Shipping</Link></nav>
      </header>
      <p className="eyebrow">Your account</p>
      <h1>Welcome to VAULTEX</h1>
      <p className="dashboard-email">Signed in as {user.email}</p>
      <div className="dashboard-service-grid">
        <section className="card dashboard-service-card" aria-labelledby="wire-status">
          <span className="badge">01</span><h2 id="wire-status">Bank-wire services</h2>
          <p>This customer app is not currently connected to an authenticated wire-transfer service. You cannot initiate or track a wire here.</p>
          <Link href="/wire-transfers" className="text-link">Review service status <span aria-hidden="true">→</span></Link>
        </section>
        <section className="card dashboard-service-card" aria-labelledby="shipping-tools">
          <span className="badge shipping-badge">02</span><h2 id="shipping-tools">Parcel shipping</h2>
          <p>Domestic carrier tools are provided in a separate workspace. Available actions depend on the configured carrier environment.</p>
          <Link href="/shipping" className="text-link">Open shipping tools <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  );
}
