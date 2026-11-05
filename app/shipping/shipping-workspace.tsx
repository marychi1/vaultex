"use client";

import { useState, type FormEvent } from "react";

type FormValues = {
  senderName: string;
  senderPhone: string;
  senderStreet: string;
  senderCity: string;
  senderState: string;
  senderPostalCode: string;
  recipientName: string;
  recipientPhone: string;
  recipientStreet: string;
  recipientCity: string;
  recipientState: string;
  recipientPostalCode: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  declaredValue: string;
};

type Rate = {
  serviceType: string;
  serviceName: string;
  amount: number;
  currency: string;
};

type ShippingMode = "sandbox" | "production";

const initialForm: FormValues = {
  senderName: "",
  senderPhone: "",
  senderStreet: "",
  senderCity: "",
  senderState: "",
  senderPostalCode: "",
  recipientName: "",
  recipientPhone: "",
  recipientStreet: "",
  recipientCity: "",
  recipientState: "",
  recipientPostalCode: "",
  weight: "2",
  length: "12",
  width: "9",
  height: "4",
  declaredValue: "",
};

function toShipment(form: FormValues) {
  return {
    shipper: {
      name: form.senderName,
      phoneNumber: form.senderPhone,
      street: form.senderStreet,
      city: form.senderCity,
      state: form.senderState,
      postalCode: form.senderPostalCode,
    },
    recipient: {
      name: form.recipientName,
      phoneNumber: form.recipientPhone,
      street: form.recipientStreet,
      city: form.recipientCity,
      state: form.recipientState,
      postalCode: form.recipientPostalCode,
    },
    package: {
      weight: form.weight,
      length: form.length,
      width: form.width,
      height: form.height,
      ...(form.declaredValue.trim() ? { declaredValue: form.declaredValue.trim() } : {}),
    },
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="shipping-field">
      <span>{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

export default function ShippingWorkspace({
  mode,
  productionLabelsEnabled,
}: {
  mode: ShippingMode;
  productionLabelsEnabled: boolean;
}) {
  const [form, setForm] = useState(initialForm);
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentReference, setShipmentReference] = useState("");
  const [productionConfirmation, setProductionConfirmation] = useState("");
  const [trackingResult, setTrackingResult] = useState<{
    status: string;
    events: { date: string; description: string; city: string; state: string }[];
  }>();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function update(key: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitJson(
    endpoint: string,
    payload: unknown
  ): Promise<{ data: Record<string, unknown>; response: Response }> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof data.error === "string" ? data.error : "Shipping request failed.");
    }
    return { data, response };
  }

  async function getRates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setRates([]);
    setSelectedService("");
    setBusy(true);
    try {
      const { data } = await submitJson("/api/shipping/rates", toShipment(form));
      const result = Array.isArray(data.rates) ? data.rates as Rate[] : [];
      setRates(result);
      setMessage(
        result.length
          ? `${mode === "production" ? "Production" : "Sandbox"} rates are ready.`
          : "FedEx returned no rate options for these details."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not retrieve rates.");
    } finally {
      setBusy(false);
    }
  }

  async function createLabel() {
    if (!selectedService) {
      setMessage("Get rates and choose a service before creating a label.");
      return;
    }
    if (mode === "production" && !productionLabelsEnabled) {
      setMessage("Production label creation is disabled.");
      return;
    }
    if (mode === "production" && productionConfirmation !== "CREATE LABEL") {
      setMessage('Type "CREATE LABEL" to confirm a real, billable shipment.');
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/shipping/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          ...toShipment(form),
          serviceType: selectedService,
          shipmentReference,
          productionConfirmation,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Could not create a shipping label.");
      }

      const tracking = response.headers.get("x-tracking-number");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `fedex-${mode}-label.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      if (tracking) setTrackingNumber(tracking);
      setMessage(
        tracking
          ? `${mode === "production" ? "Production" : "Sandbox"} label downloaded. Tracking: ${tracking}`
          : `${mode === "production" ? "Production" : "Sandbox"} label downloaded.`
      );
      setProductionConfirmation("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create a shipping label.");
    } finally {
      setBusy(false);
    }
  }

  async function trackShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setTrackingResult(undefined);
    try {
      const { data } = await submitJson("/api/shipping/tracking", { trackingNumber });
      setTrackingResult({
        status: typeof data.status === "string" ? data.status : "Status unavailable",
        events: Array.isArray(data.events) ? data.events as TrackingEvent[] : [],
      });
      setMessage(`${mode === "production" ? "Production" : "Sandbox"} tracking information loaded.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not retrieve tracking information.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shipping-workspace">
      <form className="shipping-card" onSubmit={getRates}>
        <h2>Get rates and create a label</h2>
        <p>
          US domestic parcels only. Enter sender, recipient, and package details.
          Rates, labels, and tracking are separate from bank wires.
        </p>
        <div className="shipping-columns">
          <fieldset>
            <legend>Sender</legend>
            <Field label="Name" value={form.senderName} onChange={(v) => update("senderName", v)} />
            <Field label="Phone" value={form.senderPhone} onChange={(v) => update("senderPhone", v)} type="tel" />
            <Field label="Street" value={form.senderStreet} onChange={(v) => update("senderStreet", v)} />
            <Field label="City" value={form.senderCity} onChange={(v) => update("senderCity", v)} />
            <div className="shipping-small-fields">
              <Field label="State" value={form.senderState} onChange={(v) => update("senderState", v)} />
              <Field label="ZIP" value={form.senderPostalCode} onChange={(v) => update("senderPostalCode", v)} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Recipient</legend>
            <Field label="Name" value={form.recipientName} onChange={(v) => update("recipientName", v)} />
            <Field label="Phone" value={form.recipientPhone} onChange={(v) => update("recipientPhone", v)} type="tel" />
            <Field label="Street" value={form.recipientStreet} onChange={(v) => update("recipientStreet", v)} />
            <Field label="City" value={form.recipientCity} onChange={(v) => update("recipientCity", v)} />
            <div className="shipping-small-fields">
              <Field label="State" value={form.recipientState} onChange={(v) => update("recipientState", v)} />
              <Field label="ZIP" value={form.recipientPostalCode} onChange={(v) => update("recipientPostalCode", v)} />
            </div>
          </fieldset>
        </div>
        <fieldset>
          <legend>Package (inches and pounds)</legend>
          <div className="shipping-package-fields">
            <Field label="Weight (lb)" type="number" value={form.weight} onChange={(v) => update("weight", v)} />
            <Field label="Length (in)" type="number" value={form.length} onChange={(v) => update("length", v)} />
            <Field label="Width (in)" type="number" value={form.width} onChange={(v) => update("width", v)} />
            <Field label="Height (in)" type="number" value={form.height} onChange={(v) => update("height", v)} />
            <Field
              label={`Declared value (USD${mode === "production" ? "" : ", optional"}; not insurance)`}
              type="number"
              step="0.01"
              value={form.declaredValue}
              onChange={(v) => update("declaredValue", v)}
              required={mode === "production"}
            />
          </div>
        </fieldset>
        <button className="cta" disabled={busy} type="submit">
          {busy ? "Working..." : `GET ${mode === "production" ? "PRODUCTION" : "SANDBOX"} RATES`}
        </button>
        {rates.length > 0 && (
          <div className="shipping-rate-list">
            <label className="shipping-field">
              <span>Select service for {mode === "production" ? "production" : "sandbox"} label</span>
              <select value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>
                <option value="">Choose a service</option>
                {rates.map((rate) => (
                  <option key={rate.serviceType} value={rate.serviceType}>
                    {rate.serviceName} — {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: rate.currency || "USD",
                    }).format(rate.amount)}
                  </option>
                ))}
              </select>
            </label>
            {mode === "production" && (
              <>
                <Field
                  label="Unique order/shipment reference"
                  value={shipmentReference}
                  onChange={setShipmentReference}
                  required
                />
                <Field
                  label='Type "CREATE LABEL" to authorize real carrier charges'
                  value={productionConfirmation}
                  onChange={setProductionConfirmation}
                  required
                />
              </>
            )}
            <button
              className="secondary"
              disabled={
                busy ||
                !selectedService ||
                (mode === "production" &&
                  (!productionLabelsEnabled ||
                    !shipmentReference ||
                    productionConfirmation !== "CREATE LABEL"))
              }
              type="button"
              onClick={createLabel}
            >
              {mode === "production" ? "CREATE BILLABLE LABEL" : "CREATE SANDBOX LABEL"}
            </button>
          </div>
        )}
      </form>

      {mode === "production" && (
        <p className="shipping-warning">
          Declared value is sent per package in the FedEx shipment request; it is not
          insurance or a guarantee of reimbursement. FedEx may apply service-specific
          limits. Production labels remain disabled until those requirements are verified.
        </p>
      )}

      <form className="shipping-card" onSubmit={trackShipment}>
        <h2>Track a parcel</h2>
        <div className="shipping-track-row">
          <Field label="FedEx tracking number" value={trackingNumber} onChange={setTrackingNumber} />
          <button className="secondary" disabled={busy} type="submit">
            TRACK
          </button>
        </div>
        {trackingResult && (
          <div className="shipping-tracking-result">
            <h3>{trackingResult.status}</h3>
            {trackingResult.events.map((event, index) => (
              <p key={`${event.date}-${index}`}>
                {event.date && <time>{event.date}</time>} {event.description}
                {(event.city || event.state) && ` — ${[event.city, event.state].filter(Boolean).join(", ")}`}
              </p>
            ))}
          </div>
        )}
      </form>
      <p aria-live="polite" role="status" className="shipping-message">{message}</p>
    </div>
  );
}

type TrackingEvent = {
  date: string;
  description: string;
  city: string;
  state: string;
};
