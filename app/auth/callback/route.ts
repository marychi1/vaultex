import { NextResponse, type NextRequest } from "next/server";
import { getSessionClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", request.url)
    );
  }

  const { error } = await (await getSessionClient()).auth.exchangeCodeForSession(
    code
  );

  if (error) {
    console.error("Supabase auth callback failed:", error.message);
    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
