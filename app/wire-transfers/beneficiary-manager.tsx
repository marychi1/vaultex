"use client";

import { useEffect, useState, type FormEvent } from "react";

type Counterparty = {
  id: string;
  name: string;
  accountLast4: string;
  createdAt: string;
};

type CounterpartyResponse = {
  error?: string;
  counterparties?: Counterparty[];
  counterparty?: Counterparty;
};

const initialForm = {
  name: "",
  accountType: "checking",
  accountNumber: "",
  routingNumber: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
};

export default function BeneficiaryManager() {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/wires/counterparties", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as CounterpartyResponse;
        if (!response.ok) throw new Error(result.error || "Beneficiary service is unavailable.");
        if (!Array.isArray(result.counterparties)) {
          throw new Error("Beneficiary service returned an invalid response.");
        }
        if (active) {
          setCounterparties(result.counterparties);
          setEnabled(true);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : "Beneficiary service is unavailable.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function update(key: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function createBeneficiary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/wires/counterparties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          accountType: form.accountType,
          accountNumber: form.accountNumber,
          routingNumber: form.routingNumber,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
          },
        }),
      });
      const result = await response.json() as CounterpartyResponse;
      if (!response.ok) {
        throw new Error(result.error || "Beneficiary could not be saved.");
      }
      if (!result.counterparty) {
        throw new Error("Beneficiary service returned an invalid response.");
      }

      setCounterparties((current) => [
        result.counterparty!,
        ...current.filter((item) => item.id !== result.counterparty!.id),
      ]);
      setForm(initialForm);
      setMessage("Sandbox beneficiary was created and verified with Column. Wire transfers remain unavailable.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Beneficiary could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="shipping-card" aria-labelledby="beneficiary-heading">
      <h2 id="beneficiary-heading">Sandbox beneficiaries</h2>
      {loading ? (
        <p role="status">Checking beneficiary service...</p>
      ) : !enabled ? (
        <p role="status">
          Beneficiary setup is unavailable in this environment. Do not submit bank details;
          wire transfers remain disabled.
          {message ? ` ${message}` : ""}
        </p>
      ) : (
        <>
          <p>
            Sandbox only. Do not enter real bank information. Details are sent to Column&apos;s
            test environment; this app cannot submit a wire or move funds.
          </p>
          {counterparties.length > 0 && (
            <ul aria-label="Saved sandbox beneficiaries">
              {counterparties.map((counterparty) => (
                <li key={counterparty.id}>
                  {counterparty.name} · account ending {counterparty.accountLast4}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={createBeneficiary}>
            <label className="shipping-field">
              Beneficiary name
              <input
                autoComplete="off"
                maxLength={127}
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              Account type
              <select
                value={form.accountType}
                onChange={(event) => update("accountType", event.target.value)}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </label>
            <label className="shipping-field">
              Sandbox account number
              <input
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]{4,17}"
                required
                value={form.accountNumber}
                onChange={(event) => update("accountNumber", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              ABA routing number
              <input
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]{9}"
                required
                value={form.routingNumber}
                onChange={(event) => update("routingNumber", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              Street address
              <input
                autoComplete="off"
                maxLength={35}
                required
                value={form.line1}
                onChange={(event) => update("line1", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              Address line 2 (optional)
              <input
                autoComplete="off"
                maxLength={35}
                value={form.line2}
                onChange={(event) => update("line2", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              City
              <input
                autoComplete="off"
                maxLength={35}
                required
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              State
              <input
                autoComplete="off"
                maxLength={2}
                pattern="[A-Za-z]{2}"
                required
                value={form.state}
                onChange={(event) => update("state", event.target.value)}
              />
            </label>
            <label className="shipping-field">
              ZIP code
              <input
                autoComplete="off"
                maxLength={10}
                pattern="[0-9]{5}(-[0-9]{4})?"
                required
                value={form.postalCode}
                onChange={(event) => update("postalCode", event.target.value)}
              />
            </label>
            <button className="cta" disabled={busy} type="submit">
              {busy ? "Verifying with Column..." : "ADD SANDBOX BENEFICIARY"}
            </button>
          </form>
          <p className="shipping-message" role="status" aria-live="polite">{message}</p>
        </>
      )}
    </section>
  );
}
