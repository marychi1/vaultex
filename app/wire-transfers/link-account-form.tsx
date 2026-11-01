"use client";

import { useEffect, useState, type FormEvent } from "react";

type ApiResult = { error?: string; message?: string; linked?: boolean; phone?: string };

export default function LinkAccountForm() {
  const [linked, setLinked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/wires/link-account", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as ApiResult;
        if (!response.ok) throw new Error(result.error || "Could not check linked account status.");
        if (active) {
          setLinked(Boolean(result.linked));
          if (result.linked && result.phone) {
            setMessage(`Your bank-wire account is linked (${result.phone}). Transfers remain unavailable.`);
          }
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : "Could not check linked account status.");
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function post(path: string, body: Record<string, string>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as ApiResult;
    if (!response.ok) {
      throw new Error(result.error || "The request could not be completed.");
    }
    return result;
  }

  async function requestCode() {
    setBusy(true);
    setMessage("");
    try {
      const result = await post("/api/wires/link-otp", { phone });
      setMessage(result.message || "If the account is eligible, a verification code was sent.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not request a verification code."
      );
    } finally {
      setBusy(false);
    }
  }

  async function linkAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await post("/api/wires/link-account", { phone, pin, code });
      setMessage(
        result.linked
          ? `Account linked (${result.phone}). Wire transfers are still unavailable pending Column sandbox setup and testing.`
          : "Account linking could not be confirmed."
      );
      setLinked(Boolean(result.linked));
      setPin("");
      setCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not link the account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shipping-workspace">
      {checking && <p role="status">Checking account-link status...</p>}
      {linked && (
        <div className="shipping-card">
          <h2>Existing account linked</h2>
          <p>Wire submission and tracking remain unavailable pending Column sandbox setup and testing.</p>
        </div>
      )}
      {!checking && !linked && (
      <form className="shipping-card" onSubmit={linkAccount}>
        <h2>Link an existing VAULTEX bank-wire account</h2>
        <p>
          This verifies your existing backend account with a phone code and PIN.
          It does not submit a wire or enable transfers.
        </p>
        <label className="shipping-field">
          Phone number on your existing account
          <input
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <button className="cta" disabled={busy || !phone.trim()} onClick={requestCode} type="button">
          {busy ? "Working..." : "REQUEST PHONE CODE"}
        </button>
        <label className="shipping-field">
          Existing account PIN
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            minLength={4}
            maxLength={8}
            required
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        <label className="shipping-field">
          6-digit phone code
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
        <button className="cta" disabled={busy} type="submit">
          {busy ? "Working..." : "VERIFY AND LINK ACCOUNT"}
        </button>
        <p className="shipping-message" role="status" aria-live="polite">{message}</p>
      </form>
      )}
    </div>
  );
}
