import { redirect } from "next/navigation";
import { getSessionClient } from "@/lib/supabase/server";

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
    </main>
  );
}
