export function getConfiguredWireBackendUrl(): string | null {
  const configuredUrl = process.env.VAULTEX_BACKEND_URL?.trim();
  const defaultUrl = process.env.NODE_ENV === "development"
    ? "https://vaultexw-api-staging.onrender.com"
    : process.env.NODE_ENV === "production"
      ? "https://api.vaultexwallet.io"
      : "";
  const rawUrl = configuredUrl || defaultUrl;
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.protocol !== "https:"
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}
