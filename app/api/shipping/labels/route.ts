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
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Shipment details are required." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const serviceType = input.serviceType;
    if (typeof serviceType !== "string" || !/^[A-Z0-9_]{2,40}$/.test(serviceType)) {
      return NextResponse.json({ error: "Select a valid FedEx service from the rate results." }, { status: 400 });
    }

    const shipment = parseShipment(input);
    const response = await callFedEx("/ship/v1/shipments", {
      labelResponseOptions: "LABEL",
      accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER?.trim() },
      requestedShipment: {
        shipDatestamp: new Date().toISOString().slice(0, 10),
        pickupType: "DROPOFF_AT_FEDEX_LOCATION",
        serviceType,
        packagingType: "YOUR_PACKAGING",
        shipper: {
          contact: shipment.shipper.contact,
          address: shipment.shipper.address,
        },
        recipients: [{
          contact: shipment.recipient.contact,
          address: shipment.recipient.address,
        }],
        shippingChargesPayment: {
          paymentType: "SENDER",
          payor: {
            responsibleParty: {
              accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER?.trim() },
            },
          },
        },
        labelSpecification: {
          imageType: "PDF",
          labelStockType: "PAPER_4X6",
        },
        requestedPackageLineItems: [packageLineItem(shipment)],
      },
    });

    const output = (response as Record<string, unknown> | undefined)?.output as
      | Record<string, unknown>
      | undefined;
    const transaction = Array.isArray(output?.transactionShipments)
      ? output.transactionShipments[0] as Record<string, unknown> | undefined
      : undefined;
    const piece = Array.isArray(transaction?.pieceResponses)
      ? transaction.pieceResponses[0] as Record<string, unknown> | undefined
      : undefined;
    const documents = Array.isArray(piece?.packageDocuments)
      ? piece.packageDocuments
      : [];
    const document = documents.find((item: unknown) =>
      item && typeof item === "object" &&
      typeof (item as Record<string, unknown>).encodedLabel === "string"
    ) as Record<string, unknown> | undefined;
    const encodedLabel = document?.encodedLabel;
    const trackingNumber = piece?.trackingNumber;

    if (typeof encodedLabel !== "string" || typeof trackingNumber !== "string") {
      return NextResponse.json(
        { error: "FedEx did not return a label and tracking number. Check the sandbox result before retrying." },
        { status: 502 }
      );
    }

    const label = Buffer.from(encodedLabel, "base64");
    if (!label.length || label.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "FedEx returned an invalid label file." }, { status: 502 });
    }

    return new NextResponse(label, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="fedex-sandbox-label.pdf"',
        "Cache-Control": "no-store",
        "X-Tracking-Number": trackingNumber,
      },
    });
  } catch (error) {
    if (error instanceof FedExInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return errorResponse(error);
  }
}
