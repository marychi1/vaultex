import { getSessionClient } from "@/lib/supabase/server";
import {
  DeclaredValueInputError,
  declaredValueRequestField,
  parseDeclaredValue,
} from "./declared-value";

const FEDEX_URLS = {
  sandbox: "https://apis-sandbox.fedex.com",
  production: "https://apis.fedex.com",
} as const;

export class FedExConfigurationError extends Error {}
export class FedExInputError extends Error {}
export class FedExLabelConflictError extends Error {}

const PRODUCTION_DECLARED_VALUE_REQUIREMENTS_VERIFIED = false;

type FedExConfig = {
  mode: "sandbox" | "production";
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  accountNumber: string;
};

type Address = {
  streetLines: string[];
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: "US";
};

type Contact = {
  personName: string;
  phoneNumber: string;
};

export type ParsedShipment = {
  shipper: { contact: Contact; address: Address };
  recipient: { contact: Contact; address: Address };
  package: {
    weight: number;
    length: number;
    width: number;
    height: number;
    declaredValue?: number;
  };
};

let cachedToken: { value: string; expiresAt: number; key: string } | undefined;
let tokenRequest: Promise<string> | undefined;

export function getFedExMode(): "sandbox" | "production" {
  const mode = process.env.FEDEX_ENV;
  if (mode === "sandbox" || mode === "production") return mode;
  throw new FedExConfigurationError("Set FEDEX_ENV to sandbox or production.");
}

function getFedExConfig(): FedExConfig {
  const mode = getFedExMode();
  if (mode === "production" && process.env.FEDEX_PRODUCTION_ENABLED !== "true") {
    throw new FedExConfigurationError(
      "FedEx production access is disabled. Set FEDEX_PRODUCTION_ENABLED=true only after production readiness checks."
    );
  }

  const apiKey = process.env.FEDEX_API_KEY?.trim();
  const secretKey = process.env.FEDEX_SECRET_KEY?.trim();
  const accountNumber = process.env.FEDEX_ACCOUNT_NUMBER?.trim();

  if (!apiKey || !secretKey || !accountNumber) {
    throw new FedExConfigurationError(
      `FedEx ${mode} credentials and account number are not configured.`
    );
  }

  return {
    mode,
    baseUrl: FEDEX_URLS[mode],
    apiKey,
    secretKey,
    accountNumber,
  };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.map(asRecord).filter((item): item is Record<string, unknown> => Boolean(item))
    : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

async function getAccessToken(config: FedExConfig): Promise<string> {
  const cacheKey = `${config.baseUrl}:${config.apiKey}`;
  if (
    cachedToken &&
    cachedToken.key === cacheKey &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.value;
  }
  if (tokenRequest) return tokenRequest;

  tokenRequest = (async () => {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.apiKey,
      client_secret: config.secretKey,
    });
    const response = await fetch(`${config.baseUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const result = asRecord(await response.json().catch(() => undefined));
    const token = stringValue(result?.access_token);
    const expiresIn = Number(result?.expires_in);

    if (!response.ok || !token || !Number.isFinite(expiresIn)) {
      throw new Error(`FedEx authorization failed (${response.status}).`);
    }

    cachedToken = {
      value: token,
      expiresAt: Date.now() + expiresIn * 1000,
      key: cacheKey,
    };
    return token;
  })();

  try {
    return await tokenRequest;
  } finally {
    tokenRequest = undefined;
  }
}

export async function callFedEx(path: string, payload: unknown): Promise<unknown> {
  const config = getFedExConfig();
  const token = await getAccessToken(config);
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-locale": "en_US",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const result = await response.json().catch(() => undefined);

  if (!response.ok) {
    const firstError = asRecords(asRecord(result)?.errors)[0];
    const message = stringValue(firstError?.message);
    throw new Error(message || `FedEx request failed (${response.status}).`);
  }
  return result;
}

export function getFedExAccountNumber(): string {
  return getFedExConfig().accountNumber;
}

export function isProductionLabelEnabled(): boolean {
  return PRODUCTION_DECLARED_VALUE_REQUIREMENTS_VERIFIED &&
    process.env.FEDEX_PRODUCTION_ENABLED === "true" &&
    process.env.FEDEX_PRODUCTION_LABELS_ENABLED === "true";
}

export function isProductionLabelUserAllowed(userId: string): boolean {
  const allowedIds = (process.env.FEDEX_PRODUCTION_ALLOWED_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return allowedIds.includes(userId);
}

export async function reserveProductionLabel(
  userId: string,
  idempotencyKey: string,
  shipmentReference: string
): Promise<void> {
  let supabase;
  try {
    supabase = await getSessionClient();
  } catch (error) {
    console.error(
      "FedEx label ledger configuration unavailable:",
      error instanceof Error ? error.message : "Unknown configuration error."
    );
    throw new FedExConfigurationError(
      "Production labels require the Supabase shipment-ledger migration."
    );
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user || authData.user.id !== userId) {
    throw new FedExConfigurationError("Unable to verify authorization for a production label.");
  }

  const { error } = await supabase.from("fedex_shipments").insert({
    owner_user_id: userId,
    idempotency_key: idempotencyKey,
    shipment_reference: shipmentReference,
    status: "pending",
  });

  if (error?.code === "23505") {
    throw new FedExLabelConflictError(
      "This shipment reference or label request was already used. Check its tracking status or reconcile it before creating another label."
    );
  }
  if (error) {
    console.error("FedEx label ledger reservation failed:", error.message);
    throw new FedExConfigurationError(
      "Could not reserve a production label safely. Verify the shipment-ledger migration and retry."
    );
  }
}

export async function finalizeProductionLabel(
  idempotencyKey: string,
  trackingNumber: string
): Promise<void> {
  const supabase = await getSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new FedExConfigurationError(
      "FedEx created a label, but the result could not be securely recorded. Contact support before retrying."
    );
  }

  const { error: updateError } = await supabase
    .from("fedex_shipments")
    .update({
      status: "submitted",
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("owner_user_id", data.user.id)
    .eq("idempotency_key", idempotencyKey);

  if (updateError) {
    console.error("FedEx label result persistence failed:", updateError.message);
    throw new FedExConfigurationError(
      "FedEx may have created the label, but its result could not be recorded. Contact support before retrying."
    );
  }
}

export async function markProductionLabelUnknown(
  idempotencyKey: string
): Promise<void> {
  let supabase;
  try {
    supabase = await getSessionClient();
  } catch (error) {
    console.error(
      "FedEx label outcome could not be recorded:",
      error instanceof Error ? error.message : "Supabase configuration unavailable."
    );
    return;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.error("Unable to verify user while recording an unknown FedEx label outcome.");
    return;
  }

  const { error: updateError } = await supabase
    .from("fedex_shipments")
    .update({ status: "unknown", updated_at: new Date().toISOString() })
    .eq("owner_user_id", data.user.id)
    .eq("idempotency_key", idempotencyKey);

  if (updateError) {
    console.error("FedEx unknown label outcome persistence failed:", updateError.message);
  }
}

function readText(
  input: Record<string, unknown>,
  key: string,
  label: string,
  maxLength: number
): string {
  const value = input[key];
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new FedExInputError(
      `${label} is required and must be ${maxLength} characters or fewer.`
    );
  }
  return value.trim();
}

function parseContactAddress(
  input: unknown,
  label: string
): { contact: Contact; address: Address } {
  const record = asRecord(input);
  if (!record) throw new FedExInputError(`${label} details are required.`);

  const state = readText(record, "state", `${label} state`, 2).toUpperCase();
  const postalCode = readText(record, "postalCode", `${label} ZIP code`, 10);
  const phoneNumber = readText(record, "phoneNumber", `${label} phone`, 30);

  if (!/^[A-Z]{2}$/.test(state)) {
    throw new FedExInputError(`${label} state must be a two-letter code.`);
  }
  if (!/^\d{5}(?:-\d{4})?$/.test(postalCode)) {
    throw new FedExInputError(`${label} ZIP code must be a valid US ZIP code.`);
  }
  if (!/^[+\d().\-\s]{10,30}$/.test(phoneNumber)) {
    throw new FedExInputError(`${label} phone number is invalid.`);
  }

  return {
    contact: {
      personName: readText(record, "name", `${label} name`, 100),
      phoneNumber,
    },
    address: {
      streetLines: [readText(record, "street", `${label} street`, 100)],
      city: readText(record, "city", `${label} city`, 50),
      stateOrProvinceCode: state,
      postalCode,
      countryCode: "US",
    },
  };
}

function readDimension(
  input: Record<string, unknown>,
  key: string,
  label: string,
  max: number
): number {
  const value = Number(input[key]);
  if (!Number.isFinite(value) || value <= 0 || value > max) {
    throw new FedExInputError(
      `${label} must be greater than 0 and no more than ${max}.`
    );
  }
  return value;
}

export function parseShipment(input: unknown): ParsedShipment {
  const record = asRecord(input);
  if (!record) throw new FedExInputError("Shipment details are required.");

  const shipper = parseContactAddress(record.shipper, "Sender");
  const recipient = parseContactAddress(record.recipient, "Recipient");
  const packageInput = asRecord(record.package);
  if (!packageInput) throw new FedExInputError("Package details are required.");
  let declaredValue: number | undefined;
  try {
    declaredValue = parseDeclaredValue(packageInput.declaredValue);
  } catch (error) {
    if (error instanceof DeclaredValueInputError) {
      throw new FedExInputError(error.message);
    }
    throw error;
  }

  return {
    shipper,
    recipient,
    package: {
      weight: readDimension(packageInput, "weight", "Weight in pounds", 150),
      length: readDimension(packageInput, "length", "Length in inches", 108),
      width: readDimension(packageInput, "width", "Width in inches", 108),
      height: readDimension(packageInput, "height", "Height in inches", 108),
      declaredValue,
    },
  };
}

export function packageLineItem(shipment: ParsedShipment) {
  return {
    ...declaredValueRequestField(shipment.package.declaredValue),
    weight: { units: "LB", value: shipment.package.weight },
    dimensions: {
      length: shipment.package.length,
      width: shipment.package.width,
      height: shipment.package.height,
      units: "IN",
    },
  };
}

export async function getShippingUserId(): Promise<{
  userId?: string;
  response?: Response;
}> {
  let supabase;
  try {
    supabase = await getSessionClient();
  } catch (error) {
    console.error(
      "Shipping authentication configuration unavailable:",
      error instanceof Error ? error.message : "Unknown configuration error."
    );
    return {
      response: Response.json(
        { error: "Shipping authentication is not configured." },
        { status: 503 }
      ),
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Shipping authentication check failed:", error.message);
    return {
      response: Response.json(
        { error: "Unable to verify your sign-in." },
        { status: 503 }
      ),
    };
  }
  if (!data.user) {
    return {
      response: Response.json(
        { error: "Sign in to use shipping tools." },
        { status: 401 }
      ),
    };
  }
  return { userId: data.user.id };
}

export async function requireShippingUser(): Promise<Response | undefined> {
  const { response } = await getShippingUserId();
  return response;
}

export function errorResponse(error: unknown): Response {
  if (error instanceof FedExConfigurationError) {
    return Response.json({ error: error.message }, { status: 503 });
  }
  const message = error instanceof Error ? error.message : "FedEx request failed.";
  console.error("FedEx API request failed:", message);
  return Response.json({ error: message }, { status: 502 });
}
