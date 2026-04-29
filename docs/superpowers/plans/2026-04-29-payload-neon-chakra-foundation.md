# Payload Neon Chakra Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom CMS/admin foundation with a Payload + Neon Postgres backend and introduce Chakra UI as the new dark-only design system foundation.

**Architecture:** Payload is installed into the existing Next.js App Router project using the official `(payload)` route group, `payload.config.ts`, and the Payload Next plugin. Neon is used through Payload's Postgres adapter via `DATABASE_URL`, and Chakra wraps the public app through a client provider plus a compact dark-only theme.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, Payload CMS, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, Chakra UI, Neon Postgres, Vitest, TypeScript.

---

## File Structure

- Create: `payload.config.ts` for Payload config, collections, globals, Postgres adapter, and editor setup.
- Create: `src/payload/collections/users.ts` for Payload admin users.
- Create: `src/payload/collections/media.ts` for upload/media records.
- Create: `src/payload/collections/articles.ts` for writing content.
- Create: `src/payload/collections/case-studies.ts` for case study records.
- Create: `src/payload/globals/site-settings.ts` for singleton site settings.
- Create: `src/payload/globals/home-page.ts` for home page block content.
- Create: `src/payload/blocks/home-blocks.ts` for reusable Payload block definitions.
- Create: `src/features/site/data/payload-site.ts` for frontend-facing Payload query helpers.
- Create: `src/features/site/theme/provider.tsx` for Chakra provider.
- Create: `src/features/site/theme/system.ts` for the dark-only Chakra system.
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx` for Payload admin.
- Create: `src/app/(payload)/api/[...slug]/route.ts` for Payload REST API.
- Modify: `next.config.ts` to wrap config with `withPayload`.
- Modify: `tsconfig.json` to add `@payload-config`.
- Modify: `src/app/layout.tsx` to use the Chakra provider.
- Modify: `src/app/globals.css` to reduce it to base document styling only.
- Modify: `src/app/(site)/page.tsx` and other public pages to read from the new helper surface.
- Delete: old custom admin routes under `src/app/admin`.
- Delete: old custom admin API routes under `src/app/api/admin`.
- Delete: old custom content runtime under `src/lib/content`.
- Delete: old draft preview UI under `src/features/site/drafts`.
- Delete: old admin feature components under `src/features/admin`.
- Delete or rewrite: tests tied to the removed custom CMS.

---

### Task 1: Install Runtime Dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install Payload and Chakra packages**

Run:

```powershell
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp @chakra-ui/react @emotion/react
```

Expected: packages are added to `dependencies` and `package-lock.json` updates.

- [ ] **Step 2: Run package metadata check**

Run:

```powershell
npm ls payload @payloadcms/next @payloadcms/db-postgres @chakra-ui/react
```

Expected: installed package tree prints without missing dependency errors.

---

### Task 2: Write Failing Tests for New Environment Contract

**Files:**
- Create: `tests/payload-env.test.ts`
- Modify: `src/lib/env.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/payload-env.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { getPayloadEnvironment } from "../src/lib/env";

describe("payload environment", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
  });

  it("returns the configured Neon database URL and Payload secret", () => {
    process.env.DATABASE_URL = "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=require";
    process.env.PAYLOAD_SECRET = "test-secret";

    expect(getPayloadEnvironment()).toEqual({
      databaseUrl: "postgres://user:pass@ep-example-pooler.neon.tech/neondb?sslmode=require",
      payloadSecret: "test-secret",
    });
  });

  it("uses empty strings when Payload env values are not configured", () => {
    expect(getPayloadEnvironment()).toEqual({
      databaseUrl: "",
      payloadSecret: "",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/payload-env.test.ts
```

Expected: FAIL because `getPayloadEnvironment` is not exported.

- [ ] **Step 3: Implement the minimal environment helper**

Add to `src/lib/env.ts`:

```ts
export function getPayloadEnvironment() {
  return {
    databaseUrl: process.env.DATABASE_URL ?? "",
    payloadSecret: process.env.PAYLOAD_SECRET ?? "",
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/payload-env.test.ts
```

Expected: PASS.

---

### Task 3: Write Failing Tests for Payload Schema Shape

**Files:**
- Create: `tests/payload-config-shape.test.ts`
- Create: `payload.config.ts`
- Create: `src/payload/collections/users.ts`
- Create: `src/payload/collections/media.ts`
- Create: `src/payload/collections/articles.ts`
- Create: `src/payload/collections/case-studies.ts`
- Create: `src/payload/globals/site-settings.ts`
- Create: `src/payload/globals/home-page.ts`
- Create: `src/payload/blocks/home-blocks.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/payload-config-shape.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import configPromise from "../payload.config";

describe("payload config shape", () => {
  it("registers the core collections and globals", async () => {
    const config = await configPromise;

    expect(config.collections?.map((collection) => collection.slug)).toEqual([
      "users",
      "media",
      "articles",
      "case-studies",
    ]);

    expect(config.globals?.map((global) => global.slug)).toEqual([
      "site-settings",
      "home-page",
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/payload-config-shape.test.ts
```

Expected: FAIL because `payload.config.ts` does not exist.

- [ ] **Step 3: Add Payload schema files and config**

Create the schema modules listed above. Use `buildConfig`, `postgresAdapter`, and `lexicalEditor`. The config must include:

```ts
collections: [Users, Media, Articles, CaseStudies],
globals: [SiteSettings, HomePage],
admin: { user: Users.slug },
secret: getPayloadEnvironment().payloadSecret,
db: postgresAdapter({
  pool: {
    connectionString: getPayloadEnvironment().databaseUrl,
  },
}),
editor: lexicalEditor(),
sharp,
typescript: {
  outputFile: path.resolve(dirname, "src/payload-types.ts"),
},
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/payload-config-shape.test.ts
```

Expected: PASS.

---

### Task 4: Add Payload Next Routes and Config Wiring

**Files:**
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Modify: `next.config.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Write the failing route/config test**

Create `tests/project-wiring.test.ts`:

```ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Payload project wiring", () => {
  it("contains the Payload admin and API route files", () => {
    expect(existsSync("src/app/(payload)/admin/[[...segments]]/page.tsx")).toBe(true);
    expect(existsSync("src/app/(payload)/api/[...slug]/route.ts")).toBe(true);
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/project-wiring.test.ts
```

Expected: FAIL because Payload route files and config wiring are not present.

- [ ] **Step 3: Implement route and config wiring**

Use `@payloadcms/next/routes` exports for Payload routes. Wrap `next.config.ts` with `withPayload(nextConfig)` and add `@payload-config` to `tsconfig.json` paths.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/project-wiring.test.ts
```

Expected: PASS.

---

### Task 5: Add Chakra Dark System Provider

**Files:**
- Create: `src/features/site/theme/system.ts`
- Create: `src/features/site/theme/provider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing theme test**

Create `tests/chakra-theme.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteSystem } from "../src/features/site/theme/system";

describe("Chakra site system", () => {
  it("defines a dark-only product palette with one bright accent", () => {
    expect(siteSystem._config.theme?.tokens?.colors?.accent).toBeDefined();
    expect(siteSystem._config.theme?.tokens?.colors?.canvas).toBeDefined();
    expect(siteSystem._config.theme?.tokens?.radii?.panel).toBeDefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/chakra-theme.test.ts
```

Expected: FAIL because the Chakra theme files do not exist.

- [ ] **Step 3: Implement provider and system**

Create `siteSystem` with `createSystem(defaultConfig, defineConfig(...))`. Use black/charcoal surfaces, one accent, angular radii, and compact typography.

Create a client `SiteThemeProvider`:

```tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { siteSystem } from "./system";

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={siteSystem}>{children}</ChakraProvider>;
}
```

Wrap root `children` in `src/app/layout.tsx` with `SiteThemeProvider`.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/chakra-theme.test.ts
```

Expected: PASS.

---

### Task 6: Remove Legacy CMS/Admin Runtime

**Files:**
- Delete: `src/app/admin`
- Delete: `src/app/api/admin`
- Delete: `src/app/api/content`
- Delete: `src/features/admin`
- Delete: `src/features/site/drafts`
- Delete: `src/lib/content`
- Delete: `src/lib/github`
- Delete: `src/lib/auth`
- Delete or rewrite: legacy tests that import removed modules

- [ ] **Step 1: Write the failing legacy-removal test**

Create `tests/legacy-cms-removal.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("legacy custom CMS removal", () => {
  it("does not keep the old admin and custom content runtime in source", () => {
    expect(existsSync("src/app/admin")).toBe(false);
    expect(existsSync("src/app/api/admin")).toBe(false);
    expect(existsSync("src/app/api/content")).toBe(false);
    expect(existsSync("src/features/admin")).toBe(false);
    expect(existsSync("src/features/site/drafts")).toBe(false);
    expect(existsSync("src/lib/content")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/legacy-cms-removal.test.ts
```

Expected: FAIL because the legacy runtime still exists.

- [ ] **Step 3: Delete legacy runtime directories**

Delete the directories listed above. Remove tests that only validate the deleted custom CMS.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/legacy-cms-removal.test.ts
```

Expected: PASS.

---

### Task 7: Rebuild Minimal Public Site from Payload Helper Surface

**Files:**
- Create: `src/features/site/data/payload-site.ts`
- Modify: `src/app/(site)/layout.tsx`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/app/(site)/writing/page.tsx`
- Modify: `src/app/(site)/case-studies/page.tsx`
- Delete or rewrite: old public pages that depend on removed loaders

- [ ] **Step 1: Write the failing helper test**

Create `tests/site-data-contract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getFallbackSiteModel } from "../src/features/site/data/payload-site";

describe("site data contract", () => {
  it("provides a minimal public model while Payload content is empty", () => {
    expect(getFallbackSiteModel()).toMatchObject({
      settings: {
        siteTitle: "Pro Site CMS",
      },
      navigation: [
        { href: "/", label: "Home" },
        { href: "/writing", label: "Writing" },
        { href: "/case-studies", label: "Case studies" },
      ],
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test tests/site-data-contract.test.ts
```

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement minimal Payload-facing public helper and pages**

Add a fallback site model and async functions that can later call `getPayload`. Rebuild the public pages with Chakra primitives and the dark-only style language.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm test tests/site-data-contract.test.ts
```

Expected: PASS.

---

### Task 8: Verify the Foundation

**Files:**
- No new files

- [ ] **Step 1: Run focused tests**

Run:

```powershell
npm test tests/payload-env.test.ts tests/payload-config-shape.test.ts tests/project-wiring.test.ts tests/chakra-theme.test.ts tests/legacy-cms-removal.test.ts tests/site-data-contract.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run lint**

Run:

```powershell
npm run lint
```

Expected: PASS.

- [ ] **Step 4: Run build**

Run:

```powershell
npm run build
```

Expected: PASS, unless blocked by missing local `DATABASE_URL` or `PAYLOAD_SECRET`. If blocked by env, document the exact missing value and verify with typecheck/tests instead.

---

## Self-Review

- Spec coverage: The plan covers Payload, Neon Postgres, Chakra UI, hard removal of legacy CMS/admin, and a minimal rebuilt public surface.
- Placeholder scan: No `TBD`, `TODO`, or unspecified test steps remain.
- Type consistency: Tests reference `getPayloadEnvironment`, `siteSystem`, and `getFallbackSiteModel`, all introduced by the plan before use in final verification.
