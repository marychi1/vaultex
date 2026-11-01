import { NextRequest, NextResponse } from "next/server";
import {
  callFedEx,
  errorResponse,
  FedExInputError,
  packageLineItem,
  parseShipment,
  requireShippingUser,
} from "@/lib/fedex/server";

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

  try {
    const shipment = parseShipment(body);
    const response = await callFedEx("/rate/v1/rates/quotes", {
      accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER?.trim() },
      requestedShipment: {
        shipper: { address: shipment.shipper.address },
        recipient: { address: shipment.recipient.address },
        pickupType: "DROPOFF_AT_FEDEX_LOCATION",
        packagingType: "YOUR_PACKAGING",
        rateRequestType: ["ACCOUNT", "LIST"],
        requestedPackageLineItems: [packageLineItem(shipment)],
      },
    });

    const output = (response as Record<string, unknown> | undefined)?.output as
      | Record<string, unknown>
      | undefined;
    const rateDetails = Array.isArray(output?.rateReplyDetails)
      ? output.rateReplyDetails
      : [];
    const rates = rateDetails.flatMap((detail: unknown) => {
      if (!detail || typeof detail !== "object") return [];
      const rate = detail as Record<string, unknown>;
      const ratedDetails = Array.isArray(rate.ratedShipmentDetails)
        ? rate.ratedShipmentDetails
        : [];
      const chosen =
        ratedDetails.find((item: unknown) =>
          item && typeof item === "object" &&
          (item as Record<string, unknown>).rateType === "ACCOUNT"
        ) ?? ratedDetails[0];
      const charges =
        chosen && typeof chosen === "object"
          ? (chosen as Record<string, unknown>).totalNetFedExCharge
          : undefined;
      const charge =
        charges && typeof charges === "object"
          ? (charges as Record<string, unknown>)
          : undefined;
      const amount = Number(charge?.amount);
      if (!Number.isFinite(amount)) return [];

      return [{
        serviceType: typeof rate.serviceType === "string" ? rate.serviceType : "",
        serviceName: typeof rate.serviceName === "string" ? rate.serviceName : rate.serviceType,
        amount,
        currency: typeof charge?.currency === "string" ? charge.currency : "USD",
      }];
    });

    return NextResponse.json({ rates });
  } catch (error) {
    if (error instanceof FedExInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return errorResponse(error);
  }
}
