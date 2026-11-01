import { NextRequest, NextResponse } from "next/server";
import { callFedEx, errorResponse, requireShippingUser } from "@/lib/fedex/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authResponse = await requireShippingUser();
  if (authResponse) return authResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Tracking number is required." }, { status: 400 });
  }
  const trackingNumber = (body as Record<string, unknown>).trackingNumber;
  if (
    typeof trackingNumber !== "string" ||
    !/^[A-Za-z0-9]{8,40}$/.test(trackingNumber.trim())
  ) {
    return NextResponse.json({ error: "Enter a valid FedEx tracking number." }, { status: 400 });
  }

  try {
    const response = await callFedEx("/track/v1/trackingnumbers", {
      trackingInfo: [{
        trackingNumberInfo: { trackingNumber: trackingNumber.trim() },
      }],
      includeDetailedScans: true,
    });
    const output = (response as Record<string, unknown> | undefined)?.output as
      | Record<string, unknown>
      | undefined;
    const completeResults = Array.isArray(output?.completeTrackResults)
      ? output.completeTrackResults
      : [];
    const completeResult = completeResults[0] as Record<string, unknown> | undefined;
    const trackResults = Array.isArray(completeResult?.trackResults)
      ? completeResult.trackResults
      : [];
    const result = trackResults[0] as Record<string, unknown> | undefined;
    if (!result) {
      return NextResponse.json({ error: "No tracking result was found." }, { status: 404 });
    }

    const status = result.latestStatusDetail as Record<string, unknown> | undefined;
    const events = Array.isArray(result.scanEvents) ? result.scanEvents : [];
    return NextResponse.json({
      trackingNumber: trackingNumber.trim(),
      status: typeof status?.description === "string" ? status.description : "Status unavailable",
      events: events.slice(0, 20).map((event: unknown) => {
        const scan = event as Record<string, unknown>;
        const location = scan.scanLocation as Record<string, unknown> | undefined;
        return {
          date: typeof scan.date === "string" ? scan.date : "",
          description: typeof scan.eventDescription === "string" ? scan.eventDescription : "Update",
          city: typeof location?.city === "string" ? location.city : "",
          state: typeof location?.stateOrProvinceCode === "string" ? location.stateOrProvinceCode : "",
        };
      }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
