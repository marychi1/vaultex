import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/server";
import ShippingWorkspace from "./shipping-workspace";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  let supabase;
  try {
    supabase = await getSessionClient();
  } catch {
    redirect("/login");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");
  const mode = process.env.FEDEX_ENV === "production" ? "production" : "sandbox";
  const productionLabelsEnabled =
    process.env.FEDEX_ENV === "production" &&
    process.env.FEDEX_PRODUCTION_ENABLED === "true" &&
    process.env.FEDEX_PRODUCTION_LABELS_ENABLED === "true";

  return (
    <main className="page dashboard-page">
      <header className="nav">
        <Link className="brand" href="/">VAULT<span>EX</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/wire-transfers">Bank wires</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <p className="eyebrow">FedEx parcel shipping</p>
      <h1>Shipping tools</h1>
      {mode === "sandbox" ? (
        <p className="shipping-warning">
          Sandbox only. FedEx rates, labels, and tracking are separate from bank wires.
          No production labels or live carrier charges can be created here.
        </p>
      ) : (
        <p className="shipping-warning">
          FedEx production is selected. Production labels are
          {productionLabelsEnabled ? " restricted to explicitly authorized accounts" : " disabled"}.
          A production label creates a real shipment and may incur carrier charges.
          Declared value is not insurance; do not use this tool for a high-value parcel
          until FedEx confirms its service limits and coverage requirements.
        </p>
      )}
      <ShippingWorkspace mode={mode} productionLabelsEnabled={productionLabelsEnabled} />
    </main>
  );
}
