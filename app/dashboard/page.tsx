import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type TransferTracking = {
  id: string;
  transfer_reference: string;
  amount_minor: number;
  currency: string;
  funding_source: string;
  destination_label: string;
  recipient_label: string;
  provider_status: string;
  recipient_status: string;
  status_note: string;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: transfers, error } = await supabase
    .from("transfer_tracking")
    .select("id, transfer_reference, amount_minor, currency, funding_source, destination_label, recipient_label, provider_status, recipient_status, status_note, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) as { data: TransferTracking[] | null; error: unknown };

  return (
    <main className="page dashboard-page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/wire-transfers">Bank wires</Link><Link href="/shipping">Shipping</Link></nav>
      </header>
      <p className="eyebrow">Your account</p>
      <h1>Welcome to VAULTEX</h1>
      <p className="dashboard-email">Signed in as {user.email}</p>

      <section className="card dashboard-service-card" aria-labelledby="tracked-transfers">
        <p className="eyebrow">Payment reconciliation</p>
        <h2 id="tracked-transfers">Tracked transfers</h2>
        {error ? (
          <p role="status">Transfer tracking is temporarily unavailable. Please refresh later.</p>
        ) : transfers && transfers.length > 0 ? (
          <div className="dashboard-transfer-list">
            {transfers.map((transfer) => (
              <article key={transfer.id} className="dashboard-transfer-item">
                <div className="dashboard-transfer-heading">
                  <strong>{transfer.transfer_reference}</strong>
                  <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: transfer.currency }).format(transfer.amount_minor / 100)}</strong>
                </div>
                <p><strong>Funding:</strong> {transfer.funding_source}</p>
                <p><strong>Route:</strong> {transfer.destination_label}</p>
                <p><strong>Recipient:</strong> {transfer.recipient_label}</p>
                <p><strong>Remitly status:</strong> {transfer.provider_status.replaceAll("_", " ")}</p>
                <p><strong>Recipient status:</strong> {transfer.recipient_status}</p>
                <p>{transfer.status_note}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No transfers are currently being tracked.</p>
        )}
      </section>

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
