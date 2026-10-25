import { redirect } from "next/navigation";
import { getSessionClient } from "@/lib/supabase/server";
import WalletAddressQr from "@/components/WalletAddressQr";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await getSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}</p>
      <WalletAddressQr />
    </main>
  );
}
