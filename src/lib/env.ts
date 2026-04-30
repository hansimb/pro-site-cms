export function normalizeDatabaseUrl(value: string): string {
  if (!value) {
    return "";
  }

  const normalizedValue = value.replace(/^postgres:\/\//, "http://").replace(/^postgresql:\/\//, "http://");

  try {
    const parsed = new URL(normalizedValue);
    const usesLibpqCompat = parsed.searchParams.get("uselibpqcompat") === "true";
    const sslmode = parsed.searchParams.get("sslmode");

    if (!usesLibpqCompat && ["prefer", "require", "verify-ca"].includes(String(sslmode))) {
      parsed.searchParams.set("sslmode", "verify-full");
    }

    return parsed.toString().replace(/^http:\/\//, value.startsWith("postgresql://") ? "postgresql://" : "postgres://");
  } catch {
    return value;
  }
}

export function getPayloadEnvironment() {
  return {
    databaseUrl: normalizeDatabaseUrl(process.env.DATABASE_URL ?? process.env.NEON_CONNECTION_STRING ?? ""),
    payloadSecret:
      process.env.PAYLOAD_SECRET ?? (process.env.NODE_ENV === "development" ? "dev-only-payload-secret" : ""),
  };
}
