export function getConfiguredWireBackendUrl(): string | null {
  const configuredUrl = process.env.VAULTEX_BACKEND_URL?.trim();
  const defaultUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : process.env.NODE_ENV === "production"
      ? "https://api.vaultexwallet.io"
      : "";
  const rawUrl = configuredUrl || defaultUrl;
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const localDevelopmentUrl =
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      (url.protocol !== "https:" && !localDevelopmentUrl)
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}
