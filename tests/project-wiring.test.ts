import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Payload project wiring", () => {
  it("contains the Payload admin and API route files", () => {
    expect(existsSync("src/app/(payload)/admin/[[...segments]]/page.tsx")).toBe(true);
    expect(existsSync("src/app/(payload)/api/[...slug]/route.ts")).toBe(true);
  });

  it("uses separate root layouts so Payload can own the admin document shell", () => {
    expect(existsSync("src/app/layout.tsx")).toBe(false);

    const siteLayout = readFileSync("src/app/(site)/layout.tsx", "utf8");
    const payloadLayout = readFileSync("src/app/(payload)/layout.tsx", "utf8");

    expect(siteLayout).toContain("<html");
    expect(siteLayout).toContain("<SiteThemeProvider>");
    expect(payloadLayout).toContain("<RootLayout");
    expect(payloadLayout).not.toContain("<SiteThemeProvider>");
  });

  it("locks Dark Reader out of the Payload admin document", () => {
    const payloadLayout = readFileSync("src/app/(payload)/layout.tsx", "utf8");

    expect(payloadLayout).toContain("darkreader-lock");
  });

  it("passes Payload not-found view the required config and import map", () => {
    const notFound = readFileSync("src/app/(payload)/admin/[[...segments]]/not-found.tsx", "utf8");

    expect(notFound).toContain("@payload-config");
    expect(notFound).toContain("importMap");
    expect(notFound).toContain("NotFoundPage({");
  });

  it("wraps Next config with the Payload plugin", () => {
    const nextConfig = readFileSync("next.config.ts", "utf8");

    expect(nextConfig).toContain("@payloadcms/next/withPayload");
    expect(nextConfig).toContain("withPayload(nextConfig)");
  });

  it("adds the Payload config alias to TypeScript", () => {
    const tsconfig = readFileSync("tsconfig.json", "utf8");

    expect(tsconfig).toContain("\"@payload-config\"");
    expect(tsconfig).toContain("\"./payload.config.ts\"");
  });
});
