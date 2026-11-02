export function getConfiguredWireBackendUrl(): string | null {
  const rawUrl = process.env.VAULTEX_BACKEND_URL?.trim() ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3002" : "");
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
