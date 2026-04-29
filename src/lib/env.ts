export function getPayloadEnvironment() {
  return {
    databaseUrl: process.env.DATABASE_URL ?? process.env.NEON_CONNECTION_STRING ?? "",
    payloadSecret:
      process.env.PAYLOAD_SECRET ?? (process.env.NODE_ENV === "development" ? "dev-only-payload-secret" : ""),
  };
}
