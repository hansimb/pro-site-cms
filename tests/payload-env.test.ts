import { beforeEach, describe, expect, it } from "vitest";
import {
  getPayloadEnvironment,
  normalizeDatabaseUrl,
} from "../src/lib/env";

describe("payload environment", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.NEON_CONNECTION_STRING;
    delete process.env.PAYLOAD_SECRET;
  });

  it("returns the configured Neon database URL and Payload secret", () => {
    process.env.DATABASE_URL = "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=require";
    process.env.PAYLOAD_SECRET = "test-secret";

    expect(getPayloadEnvironment()).toEqual({
      databaseUrl: "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=verify-full",
      payloadSecret: "test-secret",
    });
  });

  it("uses empty strings when Payload env values are not configured", () => {
    expect(getPayloadEnvironment()).toEqual({
      databaseUrl: "",
      payloadSecret: "",
    });
  });

  it("falls back to the Neon connection string when DATABASE_URL is not set", () => {
    process.env.NEON_CONNECTION_STRING = "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=require";

    expect(getPayloadEnvironment().databaseUrl).toBe(
      "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=verify-full",
    );
  });

  it("keeps libpq compatibility URLs unchanged when explicitly requested", () => {
    expect(
      normalizeDatabaseUrl(
        "postgres://user:pass@ep-example-pooler.neon.tech/neondb?uselibpqcompat=true&sslmode=require",
      ),
    ).toBe(
      "postgres://user:pass@ep-example-pooler.neon.tech/neondb?uselibpqcompat=true&sslmode=require",
    );
  });

  it("leaves non-aliased sslmode values unchanged", () => {
    expect(
      normalizeDatabaseUrl(
        "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=verify-full",
      ),
    ).toBe(
      "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=verify-full",
    );
  });
});
