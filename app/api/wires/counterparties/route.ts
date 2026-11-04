import { NextResponse } from "next/server";
import { getWireBackendSession, isSameOriginRequest } from "@/lib/wires/backend";

export async function GET() {
  const auth = await getWireBackendSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const response = await fetch(`${auth.backendUrl}/api/auth/customer-counterparties`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Wire beneficiary lookup failed:", error);
    return NextResponse.json(
      { error: "Beneficiary service is unavailable." },
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Beneficiary details are required." }, { status: 400 });
  }

  try {
    const response = await fetch(`${auth.backendUrl}/api/auth/customer-counterparties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Wire beneficiary creation request failed:", error);
    return NextResponse.json(
      { error: "Beneficiary service is unavailable. Check status before retrying." },
      { status: 502 }
    );
  }
}
