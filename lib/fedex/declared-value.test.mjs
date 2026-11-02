import assert from "node:assert/strict";
import test from "node:test";
import {
  DeclaredValueInputError,
  declaredValueRequestField,
  parseDeclaredValue,
} from "./declared-value.ts";

test("parses declared USD values with exact cent precision", () => {
  assert.equal(parseDeclaredValue("0.29"), 0.29);
  assert.equal(parseDeclaredValue("50000"), 50000);
  assert.equal(parseDeclaredValue("50000.00"), 50000);
});

test("omits an unspecified declared value", () => {
  assert.equal(parseDeclaredValue(undefined), undefined);
  assert.deepEqual(declaredValueRequestField(undefined), {});
});

test("creates the FedEx package declared-value field", () => {
  assert.deepEqual(declaredValueRequestField(50000), {
    declaredValue: { amount: 50000, currency: "USD" },
  });
});

test("rejects invalid declared-value inputs", () => {
  for (const value of [0, -1, "0", "1.001", "1e3", "  ", {}, Number.NaN]) {
    assert.throws(() => parseDeclaredValue(value), DeclaredValueInputError);
  }
});
