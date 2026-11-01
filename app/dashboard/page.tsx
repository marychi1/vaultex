import { redirect } from "next/navigation";
import { getSessionClient } from "@/lib/supabase/server";
import { listTransactionsForUser } from "@/lib/transaction-receipts";
import WalletAddressQr from "@/components/WalletAddressQr";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await getSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const activity = await listTransactionsForUser(user.id);

  return (
    <main className="page dashboard-page">
      <h1>Dashboard</h1>
      <p className="dashboard-email">Signed in as {user.email}</p>
      <section className="activity-section" aria-labelledby="activity-title">
        <div className="activity-heading">
          <div>
            <p className="eyebrow">Account activity</p>
            <h2 id="activity-title">Recent transactions</h2>
          </div>
        </div>
        {!activity.ok ? (
          <p className="activity-notice" role="status">
            Transaction history is temporarily unavailable. Please try again
            later.
          </p>
        ) : activity.transactions.length === 0 ? (
          <p className="activity-notice">
            No transactions have been recorded for this account.
          </p>
        ) : (
          <ul className="activity-list">
            {activity.transactions.map((transaction) => (
              <li className="activity-row" key={transaction.reference}>
                <div>
                  <h3>
                    {transaction.type === "card_spend"
                      ? transaction.merchant_name || "Card purchase"
                      : transaction.type.replace("_", " ")}
                  </h3>
                  <p>
                    {transaction.created_at
                      ? new Date(transaction.created_at).toLocaleString()
                      : "Date not provided"}
                  </p>
                  <span className="activity-reference">
                    Ref. {transaction.reference}
                  </span>
                </div>
                <div className="activity-amount">
                  <strong>
                    {transaction.from_amount === null
                      ? "Amount unavailable"
                      : `${transaction.from_amount.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })} ${transaction.from_token ?? ""}`}
                  </strong>
                  <span>
                    {transaction.status === "confirmed"
                      ? "Recorded by provider"
                      : transaction.status}
                  </span>
                  <Link
                    href={`/dashboard/transactions/${transaction.reference}`}
                    aria-label={`View receipt ${transaction.reference}`}
                  >
                    View receipt
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <WalletAddressQr />
    </main>
  );
}
