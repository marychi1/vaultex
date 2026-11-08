import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionClient } from "@/lib/supabase/server";

/**
 * Creates a Vaultex USD wallet record in a pending-verification state.
 * This is a database-only onboarding step; it does not open a bank account,
 * provision a provider account, or enable money movement.
 */
export async function POST() {
  try {
    const sessionClient = await getSessionClient();
    const {
      data: { user },
      error: authError,
    } = await sessionClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Wallet service is not configured." },
        { status: 503 }
      );
    }

    // Service credentials stay server-side. Never expose this client to the browser.
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: existing, error: lookupError } = await admin
      .from("vaultex_usd_wallets")
      .select("id, currency, status, created_at")
      .eq("user_id", user.id)
      .eq("currency", "USD")
      .maybeSingle();

    if (lookupError) {
      console.error("USD wallet lookup failed:", lookupError.message);
      return NextResponse.json({ error: "Unable to check wallet status." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ wallet: existing, created: false }, { status: 200 });
    }

    const { data: wallet, error: createError } = await admin
      .from("vaultex_usd_wallets")
      .insert({ user_id: user.id, currency: "USD", status: "pending_kyc" })
      .select("id, currency, status, created_at")
      .single();

    if (createError) {
      // A concurrent request may have won the unique(user_id,currency) race.
      if (createError.code === "23505") {
        const { data: racedWallet, error: racedLookupError } = await admin
          .from("vaultex_usd_wallets")
          .select("id, currency, status, created_at")
          .eq("user_id", user.id)
          .eq("currency", "USD")
          .maybeSingle();

        if (!racedLookupError && racedWallet) {
          return NextResponse.json({ wallet: racedWallet, created: false }, { status: 200 });
        }
      }

      console.error("USD wallet creation failed:", createError.message);
      return NextResponse.json({ error: "Unable to create wallet." }, { status: 500 });
    }

    return NextResponse.json(
      {
        wallet,
        created: true,
        message: "Wallet request created. Verification and partner approval are required before activation.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("USD wallet endpoint error:", error);
    return NextResponse.json({ error: "Unexpected wallet service error." }, { status: 500 });
  }
}
