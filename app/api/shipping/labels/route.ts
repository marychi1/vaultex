import { NextRequest, NextResponse } from "next/server";
import {
  callFedEx,
  errorResponse,
  FedExConfigurationError,
  FedExInputError,
  FedExLabelConflictError,
  finalizeProductionLabel,
  getFedExAccountNumber,
  getFedExMode,
  getShippingUserId,
  isProductionLabelEnabled,
  isProductionLabelUserAllowed,
  markProductionLabelUnknown,
  packageLineItem,
  parseShipment,
  reserveProductionLabel,
} from "@/lib/fedex/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { userId, response: authResponse } = await getShippingUserId();
  if (authResponse) return authResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  let productionReservation: { idempotencyKey: string } | undefined;
  try {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Shipment details are required." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const mode = getFedExMode();
    const serviceType = input.serviceType;
    if (typeof serviceType !== "string" || !/^[A-Z0-9_]{2,40}$/.test(serviceType)) {
      return NextResponse.json({ error: "Select a valid FedEx service from the rate results." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Sign in to create a shipping label." }, { status: 401 });
    }
    const shipment = parseShipment(input);
    const accountNumber = getFedExAccountNumber();

    const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();
    if (!idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 255) {
      return NextResponse.json({ error: "A unique Idempotency-Key header is required." }, { status: 400 });
    }

    if (mode === "production") {
      if (!isProductionLabelEnabled()) {
        return NextResponse.json({
          error: "Production label creation is disabled until FedEx confirms declared-value eligibility and limits for the selected service and account.",
        }, { status: 503 });
      }
      if (shipment.package.declaredValue === undefined) {
        return NextResponse.json(
          { error: "A declared USD package value is required for production labels." },
          { status: 400 }
        );
      }
      if (!isProductionLabelUserAllowed(userId)) {
        return NextResponse.json({ error: "Your account is not authorized to create production labels." }, { status: 403 });
      }
      if (input.productionConfirmation !== "CREATE LABEL") {
        return NextResponse.json({ error: 'Type "CREATE LABEL" to confirm a real, billable FedEx shipment.' }, { status: 400 });
      }
      const shipmentReference = input.shipmentReference;
      if (
        typeof shipmentReference !== "string" ||
        !/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/.test(shipmentReference.trim())
      ) {
        return NextResponse.json({ error: "A unique order or shipment reference (3–64 letters, numbers, dots, underscores, or hyphens) is required." }, { status: 400 });
      }
      await reserveProductionLabel(
        userId,
        idempotencyKey,
        shipmentReference.trim().toUpperCase()
      );
      productionReservation = { idempotencyKey };
    }

    const response = await callFedEx("/ship/v1/shipments", {
      labelResponseOptions: "LABEL",
      accountNumber: { value: accountNumber },
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
            accountNumber: { value: accountNumber },
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
      if (productionReservation) {
        await markProductionLabelUnknown(productionReservation.idempotencyKey);
      }
      return NextResponse.json(
        { error: "FedEx did not return a label and tracking number. Reconcile this request with FedEx before retrying." },
        { status: 502 }
      );
    }

    const label = Buffer.from(encodedLabel, "base64");
    if (!label.length || label.length > 10 * 1024 * 1024) {
      if (productionReservation) {
        await markProductionLabelUnknown(productionReservation.idempotencyKey);
      }
      return NextResponse.json({ error: "FedEx returned an invalid label file." }, { status: 502 });
    }
    if (productionReservation) {
      await finalizeProductionLabel(productionReservation.idempotencyKey, trackingNumber);
    }

    return new NextResponse(label, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="fedex-${mode}-label.pdf"`,
        "Cache-Control": "no-store",
        "X-Tracking-Number": trackingNumber,
      },
    });
  } catch (error) {
    if (productionReservation) {
      await markProductionLabelUnknown(productionReservation.idempotencyKey);
    }
    if (error instanceof FedExLabelConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof FedExConfigurationError) {
      return errorResponse(error);
    }
    if (error instanceof FedExInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return errorResponse(error);
  }
}
