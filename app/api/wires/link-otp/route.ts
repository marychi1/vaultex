import { NextResponse } from "next/server";
import { getWireBackendSession, isSameOriginRequest } from "@/lib/wires/backend";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const auth = await getWireBackendSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: { phone?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.phone !== "string" || !body.phone.trim()) {
    return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  }

  try {
    const response = await fetch(`${auth.backendUrl}/api/auth/request-link-otp`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: body.phone.trim() }),
      cache: "no-store",
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Wire phone verification request failed:", error);
    return NextResponse.json(
      { error: "Phone verification service is unavailable." },
      { status: 502 }
    );
  }
}
