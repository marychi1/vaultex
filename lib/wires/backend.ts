import { getSessionClient } from "@/lib/supabase/server";

type BackendSessionResult =
  | { ok: true; accessToken: string; backendUrl: string }
  | { ok: false; status: number; message: string };

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function getWireBackendSession(): Promise<BackendSessionResult> {
  try {
    const supabase = await getSessionClient();
    const [{ data: userData, error: userError }, { data: sessionData }] =
      await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);
    const user = userData.user;
    const session = sessionData.session;

    if (userError || !user || !session || user.id !== session.user.id) {
      return { ok: false, status: 401, message: "Sign in to continue." };
    }
    if (!user.email_confirmed_at) {
      return {
        ok: false,
        status: 403,
        message: "Verify your sign-in email before linking a bank account.",
      };
    }

    const backendUrl = process.env.VAULTEX_BACKEND_URL?.trim();
    if (!backendUrl) {
      return {
        ok: false,
        status: 503,
        message: "Wire account linking is not configured.",
      };
    }

    return {
      ok: true,
      accessToken: session.access_token,
      backendUrl: backendUrl.replace(/\/$/, ""),
    };
  } catch (error) {
    console.error("Wire customer session verification failed:", error);
    return {
      ok: false,
      status: 503,
      message: "Customer sign-in service is unavailable.",
    };
  }
}
