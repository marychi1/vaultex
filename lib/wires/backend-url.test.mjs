import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { getConfiguredWireBackendUrl } from "./backend-url.ts";

const originalNodeEnv = process.env.NODE_ENV;
const originalBackendUrl = process.env.VAULTEX_BACKEND_URL;

afterEach(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
  if (originalBackendUrl === undefined) delete process.env.VAULTEX_BACKEND_URL;
  else process.env.VAULTEX_BACKEND_URL = originalBackendUrl;
});

test("uses the deployed VAULTEX API origin when production URL is not configured", () => {
  process.env.NODE_ENV = "production";
  delete process.env.VAULTEX_BACKEND_URL;

  assert.equal(getConfiguredWireBackendUrl(), "https://api.vaultexwallet.io");
});

test("prefers an explicitly configured safe backend origin", () => {
  process.env.NODE_ENV = "production";
  process.env.VAULTEX_BACKEND_URL = "https://api.example.com";

  assert.equal(getConfiguredWireBackendUrl(), "https://api.example.com");
});

test("uses the hosted staging API in development by default", () => {
  process.env.NODE_ENV = "development";
  delete process.env.VAULTEX_BACKEND_URL;

  assert.equal(
    getConfiguredWireBackendUrl(),
    "https://vaultexw-api-staging.onrender.com"
  );
});

test("rejects localhost backend overrides", () => {
  process.env.NODE_ENV = "development";
  process.env.VAULTEX_BACKEND_URL = "http://localhost:3002";

  assert.equal(getConfiguredWireBackendUrl(), null);
});

test("does not select a production backend in test environments", () => {
  process.env.NODE_ENV = "test";
  delete process.env.VAULTEX_BACKEND_URL;

  assert.equal(getConfiguredWireBackendUrl(), null);
});

test("rejects unsafe configured production URLs", () => {
  process.env.NODE_ENV = "production";
  process.env.VAULTEX_BACKEND_URL = "http://api.example.com";

  assert.equal(getConfiguredWireBackendUrl(), null);
});
