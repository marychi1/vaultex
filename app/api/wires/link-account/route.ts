import { NextResponse } from "next/server";
import { getWireBackendSession, isSameOriginRequest } from "@/lib/wires/backend";

export async function GET() {
  const auth = await getWireBackendSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const response = await fetch(`${auth.backendUrl}/api/auth/customer-link`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      cache: "no-store",
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Wire customer account-link status lookup failed:", error);
    return NextResponse.json(
      { error: "Wire account-link status is unavailable." },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const auth = await getWireBackendSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: { phone?: unknown; pin?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (
    typeof body.phone !== "string" ||
    !body.phone.trim() ||
    typeof body.pin !== "string" ||
    !/^\d{4,8}$/.test(body.pin) ||
    typeof body.code !== "string" ||
    !/^\d{6}$/.test(body.code)
  ) {
    return NextResponse.json(
      { error: "Phone, 4–8 digit PIN, and 6-digit OTP are required." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${auth.backendUrl}/api/auth/link-customer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: body.phone.trim(),
        pin: body.pin,
        code: body.code,
      }),
      cache: "no-store",
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Wire customer account linking failed:", error);
    return NextResponse.json(
      { error: "Wire account linking service is unavailable." },
      { status: 502 }
    );
  }
}
