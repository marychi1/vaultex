"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function WalletAddressQr() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address.trim());
      setMessage("Wallet address copied.");
    } catch {
      setMessage("Unable to copy the address. Select and copy it manually.");
    }
  }

  const normalizedAddress = address.trim();

  return (
    <section
      aria-labelledby="wallet-qr-title"
      style={{
        maxWidth: 560,
        marginTop: 32,
        padding: 24,
        border: "1px solid #1C2B42",
        borderRadius: 12,
        background: "#0D1624",
        color: "#E2EAF5",
      }}
    >
      <h2 id="wallet-qr-title">Share a wallet address</h2>
      <p style={{ marginTop: 8, color: "#6A7D96", lineHeight: 1.6 }}>
        Enter a public wallet address to create a QR code others can scan.
        This only shares the address; it does not send funds or verify the
        address or network.
      </p>
      <label
        htmlFor="wallet-address"
        style={{ display: "block", marginTop: 20, marginBottom: 6 }}
      >
        Public wallet address
      </label>
      <input
        id="wallet-address"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={address}
        onChange={(event) => {
          setAddress(event.target.value);
          setMessage("");
        }}
        placeholder="Paste a public wallet address"
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: 12,
          border: "1px solid #1C2B42",
          borderRadius: 8,
          background: "#060A12",
          color: "#E2EAF5",
        }}
      />
      <p style={{ marginTop: 8, color: "#6A7D96", fontSize: 13 }}>
        Never enter a seed phrase or private key here. Before any transfer, the
        sender must confirm the address and blockchain network.
      </p>

      {normalizedAddress && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "inline-block",
              padding: 12,
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <QRCodeSVG
              value={normalizedAddress}
              size={220}
              level="M"
              marginSize={4}
              title="QR code containing the public wallet address"
            />
          </div>
          <p
            style={{
              marginTop: 12,
              overflowWrap: "anywhere",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {normalizedAddress}
          </p>
          <button
            type="button"
            onClick={copyAddress}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              border: 0,
              borderRadius: 8,
              background: "#00F0FF",
              color: "#060A12",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Copy address
          </button>
          <p role="status" aria-live="polite" style={{ marginTop: 8 }}>
            {message}
          </p>
        </div>
      )}
    </section>
  );
}
