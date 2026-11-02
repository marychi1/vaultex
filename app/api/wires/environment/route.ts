import { NextResponse } from "next/server";
import { getConfiguredWireBackendUrl } from "@/lib/wires/backend-url";

type BackendEnvironment = {
  environment?: "development" | "staging" | "production";
  wireSubmissions?: "sandbox" | "live" | "disabled";
};

export async function GET() {
  const backendUrl = getConfiguredWireBackendUrl();
  if (!backendUrl) {
    return NextResponse.json({ environment: "unknown" }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const response = await fetch(new URL("/api/environment", `${backendUrl}/`), {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(`Backend environment lookup failed (${response.status}).`);
    }

    const result = await response.json() as BackendEnvironment;
    if (
      !["development", "staging", "production"].includes(result.environment || "") ||
      !["sandbox", "live", "disabled"].includes(result.wireSubmissions || "")
    ) {
      throw new Error("Backend returned an invalid environment status.");
    }

    return NextResponse.json({
      environment: result.environment,
      wireSubmissions: result.wireSubmissions,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Wire environment status lookup failed:", error);
    return NextResponse.json({ environment: "unknown" }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
