"use client";

import { useEffect, useState } from "react";

type UniSatProvider = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getChain?: () => Promise<{ enum: string; name: string; network: string }>;
  getBalance: () => Promise<{
    confirmed: number;
    unconfirmed: number;
    total: number;
  }>;
  on: (
    event: "accountsChanged" | "networkChanged",
    handler: (value: string[] | string) => void,
  ) => void;
  removeListener: (
    event: "accountsChanged" | "networkChanged",
    handler: (value: string[] | string) => void,
  ) => void;
};

type BitcoinBalance = {
  confirmed: number;
  unconfirmed: number;
  total: number;
};

const SUPPORTED_TESTNET_CHAINS = new Set([
  "BITCOIN_TESTNET",
  "BITCOIN_TESTNET4",
  "BITCOIN_SIGNET",
]);

declare global {
  interface Window {
    unisat?: UniSatProvider;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return "Wallet connection failed. Check the wallet and try again.";
}

async function requireTestnet(provider: UniSatProvider) {
  if (!provider.getChain) {
    throw new Error(
      "Update UniSat Wallet to a version that supports getChain() before connecting.",
    );
  }

  const chain = await provider.getChain();
  if (chain.network !== "testnet" || !SUPPORTED_TESTNET_CHAINS.has(chain.enum)) {
    throw new Error(
      "UniSat is not on a supported Bitcoin test network. Switch to Bitcoin Testnet, Testnet4, or Signet and reconnect.",
    );
  }
}

function formatSatoshis(satoshis: number) {
  const whole = Math.floor(satoshis / 100_000_000);
  const fraction = String(satoshis % 100_000_000).padStart(8, "0");
  return `${whole}.${fraction}`;
}

function isValidBalance(balance: BitcoinBalance) {
  return [balance.confirmed, balance.unconfirmed, balance.total].every(
    (value) => Number.isSafeInteger(value) && value >= 0,
  ) &&
    Number.isSafeInteger(balance.confirmed + balance.unconfirmed) &&
    balance.confirmed + balance.unconfirmed === balance.total;
}

async function readTestnetBalance(
  provider: UniSatProvider,
  expectedAddress: string,
) {
  await requireTestnet(provider);
  const accounts = await provider.getAccounts();
  if (accounts[0]?.trim() !== expectedAddress) {
    throw new Error("The wallet account changed. Reconnect to continue.");
  }

  const balance = await provider.getBalance();
  await requireTestnet(provider);
  const currentAccounts = await provider.getAccounts();
  if (currentAccounts[0]?.trim() !== expectedAddress) {
    throw new Error("The wallet account changed. Reconnect to continue.");
  }
  if (!isValidBalance(balance)) {
    throw new Error("The wallet returned an invalid balance.");
  }

  return balance;
}

export default function BitcoinWalletConnect() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<BitcoinBalance | null>(null);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [refreshingBalance, setRefreshingBalance] = useState(false);

  useEffect(() => {
    if (!address) return;

    const provider = window.unisat;
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[] | string) => {
      const currentAddress = Array.isArray(accounts) ? accounts[0]?.trim() : "";
      if (currentAddress !== address) {
        setAddress("");
        setBalance(null);
        setError("The wallet account changed. Reconnect to continue.");
      }
    };
    const handleNetworkChanged = (network: string[] | string) => {
      const disconnect = () => {
        setAddress("");
        setBalance(null);
        setError(
          "The wallet left a supported Bitcoin test network. Vaultex disconnected; switch networks to reconnect.",
        );
      };

      if (network !== "testnet") {
        disconnect();
      } else {
        void requireTestnet(provider).catch(disconnect);
      }
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("networkChanged", handleNetworkChanged);

    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("networkChanged", handleNetworkChanged);
    };
  }, [address]);

  async function connectWallet() {
    setError("");
    setConnecting(true);

    try {
      const provider = window.unisat;
      if (!provider) {
        throw new Error(
          "UniSat Wallet was not detected. Install the browser extension and try again.",
        );
      }

      await requireTestnet(provider);
      const accounts = await provider.requestAccounts();
      await requireTestnet(provider);

      const testnetAddress = accounts[0]?.trim();
      if (!testnetAddress) {
        throw new Error("The wallet did not provide an account address.");
      }

      setAddress(testnetAddress);
      setBalance(null);
      try {
        const testnetBalance = await readTestnetBalance(
          provider,
          testnetAddress,
        );
        setBalance(testnetBalance);
      } catch (balanceError) {
        setError(
          `Wallet connected, but the testnet balance could not be loaded: ${getErrorMessage(balanceError)}`,
        );
      }
    } catch (connectionError) {
      setAddress("");
      setBalance(null);
      setError(getErrorMessage(connectionError));
    } finally {
      setConnecting(false);
    }
  }

  async function refreshBalance() {
    const provider = window.unisat;
    if (!provider || !address) {
      setAddress("");
      setBalance(null);
      setError("UniSat Wallet is no longer available. Reconnect your wallet.");
      return;
    }

    setRefreshingBalance(true);
    setBalance(null);
    setError("");
    try {
      setBalance(await readTestnetBalance(provider, address));
    } catch (balanceError) {
      setAddress("");
      setBalance(null);
      setError(getErrorMessage(balanceError));
    } finally {
      setRefreshingBalance(false);
    }
  }

  return (
    <section
      aria-labelledby="bitcoin-wallet-title"
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
      <h2 id="bitcoin-wallet-title">Connect a Bitcoin testnet wallet</h2>
      <p style={{ marginTop: 8, color: "#6A7D96", lineHeight: 1.6 }}>
        Connect UniSat to view a public account address on Bitcoin Testnet,
        Testnet4, or Signet. Vaultex never asks for a seed phrase or private key.
      </p>

      {address ? (
        <div style={{ marginTop: 20 }}>
          <p>Connected to Bitcoin testnet</p>
          <p
            style={{
              marginTop: 8,
              overflowWrap: "anywhere",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {address}
          </p>
          <div
            aria-live="polite"
            style={{
              display: "grid",
              gap: 8,
              marginTop: 16,
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            {balance ? (
              <>
                <p>Confirmed: {formatSatoshis(balance.confirmed)} tBTC</p>
                <p>
                  Unconfirmed: {formatSatoshis(balance.unconfirmed)} tBTC
                </p>
                <p>Total: {formatSatoshis(balance.total)} tBTC</p>
              </>
            ) : (
              <p>
                {refreshingBalance
                  ? "Loading testnet balance..."
                  : error
                    ? "Testnet balance unavailable."
                    : "Loading testnet balance..."}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={refreshBalance}
            disabled={refreshingBalance || connecting}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              border: "1px solid #1C2B42",
              borderRadius: 8,
              background: "transparent",
              color: "#E2EAF5",
              cursor: refreshingBalance ? "wait" : "pointer",
            }}
          >
            {refreshingBalance ? "Refreshing..." : "Refresh balance"}
          </button>
          <button
            type="button"
            onClick={() => {
              setAddress("");
              setBalance(null);
              setError("");
            }}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              border: "1px solid #1C2B42",
              borderRadius: 8,
              background: "transparent",
              color: "#E2EAF5",
              cursor: "pointer",
            }}
          >
            Clear address
          </button>
          <p style={{ marginTop: 8, color: "#6A7D96", fontSize: 13 }}>
            Clearing removes the address from this page only. Manage site
            permissions in UniSat to revoke access.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={connectWallet}
          disabled={connecting}
          style={{
            marginTop: 20,
            padding: "10px 16px",
            border: 0,
            borderRadius: 8,
            background: connecting ? "#6A7D96" : "#00F0FF",
            color: "#060A12",
            fontWeight: 700,
            cursor: connecting ? "wait" : "pointer",
          }}
        >
          {connecting ? "Connecting..." : "Connect UniSat"}
        </button>
      )}

      <p style={{ marginTop: 12, color: "#6A7D96", fontSize: 13 }}>
        Testnet balances are experimental and have no real-world value. This
        preview never signs messages or sends transactions, and it does not
        save wallet details.
      </p>
      {error && (
        <p role="alert" style={{ marginTop: 12, color: "#FF8C42" }}>
          {error}
        </p>
      )}
    </section>
  );
}
