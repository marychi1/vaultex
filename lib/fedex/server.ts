import { getSessionClient } from "@/lib/supabase/server";

const FEDEX_SANDBOX_URL = "https://apis-sandbox.fedex.com";

export class FedExConfigurationError extends Error {}
export class FedExInputError extends Error {}

type FedExConfig = {
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
  };
};

let cachedToken: { value: string; expiresAt: number } | undefined;
let tokenRequest: Promise<string> | undefined;

function getFedExConfig(): FedExConfig {
  if (process.env.FEDEX_ENV !== "sandbox") {
    throw new FedExConfigurationError(
      "FedEx is restricted to sandbox mode. Set FEDEX_ENV=sandbox."
    );
  }

  const apiKey = process.env.FEDEX_API_KEY?.trim();
  const secretKey = process.env.FEDEX_SECRET_KEY?.trim();
  const accountNumber = process.env.FEDEX_ACCOUNT_NUMBER?.trim();

  if (!apiKey || !secretKey || !accountNumber) {
    throw new FedExConfigurationError(
      "FedEx sandbox credentials and account number are not configured."
    );
  }

  return { apiKey, secretKey, accountNumber };
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
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  if (tokenRequest) return tokenRequest;

  tokenRequest = (async () => {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.apiKey,
      client_secret: config.secretKey,
    });
    const response = await fetch(`${FEDEX_SANDBOX_URL}/oauth/token`, {
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
  const response = await fetch(`${FEDEX_SANDBOX_URL}${path}`, {
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

  return {
    shipper,
    recipient,
    package: {
      weight: readDimension(packageInput, "weight", "Weight in pounds", 150),
      length: readDimension(packageInput, "length", "Length in inches", 108),
      width: readDimension(packageInput, "width", "Width in inches", 108),
      height: readDimension(packageInput, "height", "Height in inches", 108),
    },
  };
}

export function packageLineItem(shipment: ParsedShipment) {
  return {
    weight: { units: "LB", value: shipment.package.weight },
    dimensions: {
      length: shipment.package.length,
      width: shipment.package.width,
      height: shipment.package.height,
      units: "IN",
    },
  };
}

export async function requireShippingUser(): Promise<Response | undefined> {
  let supabase;
  try {
    supabase = await getSessionClient();
  } catch (error) {
    console.error(
      "Shipping authentication configuration unavailable:",
      error instanceof Error ? error.message : "Unknown configuration error."
    );
    return Response.json(
      { error: "Shipping authentication is not configured." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Shipping authentication check failed:", error.message);
    return Response.json(
      { error: "Unable to verify your sign-in." },
      { status: 503 }
    );
  }
  if (!data.user) {
    return Response.json({ error: "Sign in to use shipping tools." }, { status: 401 });
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof FedExConfigurationError) {
    return Response.json({ error: error.message }, { status: 503 });
  }
  const message = error instanceof Error ? error.message : "FedEx request failed.";
  console.error("FedEx sandbox request failed:", message);
  return Response.json({ error: message }, { status: 502 });
}
