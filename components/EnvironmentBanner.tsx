"use client";

import { useEffect, useState } from "react";

type Environment = "development" | "staging" | "production";
type WireSubmissions = "sandbox" | "live" | "disabled";
type EnvironmentResponse = { environment?: Environment | "unknown"; wireSubmissions?: WireSubmissions };

export default function EnvironmentBanner() {
  const [status, setStatus] = useState<EnvironmentResponse | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/wires/environment", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Service status unavailable.");
        const result = await response.json() as EnvironmentResponse;
        if (
          !["development", "staging", "production", "unknown"].includes(result.environment || "") ||
          !["sandbox", "live", "disabled"].includes(result.wireSubmissions || "")
        ) throw new Error("Service status invalid.");
        if (active) setStatus(result);
      })
      .catch(() => { if (active) setStatus(null); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  const environment = status?.environment;
  const wireSubmissions = status?.wireSubmissions;
  const copy = checking
    ? "Checking service availability…"
    : !environment || !wireSubmissions
      ? "SERVICE STATUS UNVERIFIED · Bank-wire submission is unavailable."
      : environment === "production"
        ? "LIVE SITE · Bank-wire submission is currently unavailable."
        : environment === "staging"
          ? "PREVIEW ENVIRONMENT · No live bank transfers."
          : wireSubmissions === "sandbox"
            ? "TEST ENVIRONMENT · No live funds move."
            : "DEVELOPMENT ENVIRONMENT · Live bank transfers are disabled.";

  return (
    <div className={`environment-banner environment-${environment || (checking ? "checking" : "unknown")}`} role="status" aria-live="polite">
      <span className="environment-indicator" aria-hidden="true" />
      <span>{copy}</span>
    </div>
  );
}
