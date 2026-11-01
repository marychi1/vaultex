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
      <p className="shipping-warning">
        Sandbox only. FedEx rates, labels, and tracking are separate from bank wires.
        No production labels or live carrier charges can be created here.
      </p>
      <ShippingWorkspace />
    </main>
  );
}
