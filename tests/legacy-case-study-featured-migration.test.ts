import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("legacy case study featured migration", () => {
  it("captures the intentional removal of case study featured columns", () => {
    const migrationIndexPath = path.resolve("src/migrations/index.ts");
    const migrationPath = path.resolve(
      "src/migrations/20260501_120000_remove_case_study_featured_columns.ts",
    );

    expect(existsSync(migrationIndexPath)).toBe(true);
    expect(existsSync(migrationPath)).toBe(true);

    const migrationIndex = readFileSync(migrationIndexPath, "utf8");
    const migration = readFileSync(migrationPath, "utf8");

    expect(migrationIndex).toContain(
      "20260501_120000_remove_case_study_featured_columns",
    );
    expect(migration).toContain('DROP COLUMN IF EXISTS "featured"');
    expect(migration).toContain('DROP COLUMN IF EXISTS "version_featured"');
  });
});
