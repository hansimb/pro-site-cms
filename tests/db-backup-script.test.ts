import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildBackupFilePath,
  parseDotEnv,
  resolveConnectionString,
} from "../scripts/db-backup.mjs";

describe("db backup script", () => {
  it("builds a dated backup path under db_backups", () => {
    const filePath = buildBackupFilePath(
      "C:/Users/IMBERI/Desktop/dev/projects2/pro-site-cms",
      new Date(2026, 4, 9, 17, 45, 30),
    );

    expect(filePath.replaceAll("\\", "/")).toContain(
      "/db_backups/prod-2026-05-09_17-45-30.dump",
    );
  });

  it("parses dotenv-style key-value pairs", () => {
    expect(
      parseDotEnv(`
# comment
NEON_CONNECTION_STRING=postgres://user:pass@example.com/db
DATABASE_URL=postgresql://fallback.example.com/app
`),
    ).toMatchObject({
      NEON_CONNECTION_STRING: "postgres://user:pass@example.com/db",
      DATABASE_URL: "postgresql://fallback.example.com/app",
    });
  });

  it("prefers DATABASE_URL over NEON_CONNECTION_STRING when both exist", () => {
    expect(
      resolveConnectionString({
        DATABASE_URL: "postgresql://primary.example.com/app",
        NEON_CONNECTION_STRING: "postgres://secondary.example.com/app",
      }),
    ).toBe("postgresql://primary.example.com/app");
  });

  it("registers an npm shortcut for backups", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.["db:backup"]).toBe("node ./scripts/db-backup.mjs");
  });
});
