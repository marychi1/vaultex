export class DeclaredValueInputError extends Error {}

const INVALID_DECLARED_VALUE =
  "Declared value must be a positive USD amount with no more than two decimal places.";

export function parseDeclaredValue(input: unknown): number | undefined {
  if (input === undefined || input === null || input === "") return undefined;

  const text = String(input).trim();
  if (
    (typeof input !== "string" && typeof input !== "number") ||
    !/^\d+(?:\.\d{1,2})?$/.test(text)
  ) {
    throw new DeclaredValueInputError(INVALID_DECLARED_VALUE);
  }

  const [whole, fraction = ""] = text.split(".");
  const cents = Number(`${whole}${fraction.padEnd(2, "0")}`);
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new DeclaredValueInputError(INVALID_DECLARED_VALUE);
  }

  return cents / 100;
}

export function declaredValueRequestField(value: number | undefined) {
  return value === undefined
    ? {}
    : { declaredValue: { amount: value, currency: "USD" } };
}
