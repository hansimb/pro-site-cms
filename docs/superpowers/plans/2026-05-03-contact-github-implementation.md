# Contact and GitHub Signal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CMS-managed contact/social settings, a shared contact modal, a mobile burger menu, and a GitHub profile block with safe server-side stats and omission-first rendering.

**Architecture:** Keep the site model and page composition server-first, then add small client islands for the mobile drawer, contact modal, and copy-email behavior. Extend Payload schemas and homepage mapping for new content/configuration, and fetch GitHub/WakaTime stats only on the server with "omit instead of fake fallback" rules.

**Tech Stack:** Next.js App Router, React 19, Chakra UI v3, Payload CMS, Vitest, Neon-backed Payload local API, GitHub API, WakaTime API

---

## File Structure

### Modify

- `src/payload/globals/site-settings.ts`
  Adds `contact` / social fields such as `email`, `linkedinUrl`, and `githubUrl`.
- `src/payload/blocks/home-blocks.ts`
  Adds a new `githubProfile` homepage block and redefines `contactCta` button intent.
- `src/features/site/data/payload-site.ts`
  Normalizes optional contact/social fields into the public site model.
- `src/features/site/data/home-page.ts`
  Adds `githubProfile` block typing and mapping.
- `src/app/(site)/layout.tsx`
  Integrates the new header/footer contact behaviors with server-fed settings.
- `src/app/(site)/page.tsx`
  Renders the new GitHub block and updated CTA behavior.
- `tests/site-data-contract.test.ts`
  Verifies fallback site model includes safe optional contact structures.
- `tests/home-page-blocks.test.ts`
  Verifies Payload block registration and mapping for the new GitHub block.
- `tests/payload-config-shape.test.ts`
  Verifies Payload config still wires updated globals/blocks correctly.
- `src/migrations/index.ts`
  Registers the new migration file.

### Create

- `src/features/site/contact.ts`
  Shared types and helpers for validating/normalizing email and external profile links.
- `src/features/site/github-stats.ts`
  Server-only GitHub/WakaTime fetch and normalization helpers.
- `src/app/(site)/components/contact-modal.tsx`
  Client-side shared contact modal.
- `src/app/(site)/components/contact-actions.tsx`
  Client-side trigger/wiring for opening the modal from header and CTA.
- `src/app/(site)/components/mobile-nav.tsx`
  Client-side burger/drawer navigation wrapper.
- `src/app/(site)/components/social-icon-links.tsx`
  Small conditional GitHub/LinkedIn icon link cluster.
- `src/app/(site)/components/copy-email-button.tsx`
  Client-side clipboard button used by modal/footer.
- `tests/contact-ui.test.tsx`
  Focused rendering/behavior tests for conditional contact UI.
- `tests/github-stats.test.ts`
  Server-side tests for omission-first external stat handling.
- `src/migrations/20260503_210000_add_contact_and_github_fields.ts`
  Payload migration for new contact/global fields and any homepage block schema changes.

## Task 1: Lock the Data Contract with Tests

**Files:**
- Create: `tests/contact-ui.test.tsx`
- Modify: `tests/site-data-contract.test.ts`
- Modify: `tests/home-page-blocks.test.ts`

- [ ] **Step 1: Extend the fallback site-model test**

Add this case to `tests/site-data-contract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getFallbackSiteModel } from "../src/features/site/data/payload-site";

describe("site data contract", () => {
  it("provides empty optional contact and social settings in the fallback model", () => {
    expect(getFallbackSiteModel().settings).toMatchObject({
      contact: {
        email: undefined,
        githubUrl: undefined,
        linkedinUrl: undefined,
      },
    });
  });
});
```

- [ ] **Step 2: Extend the homepage block mapping test**

Append this block fixture and expectation to `tests/home-page-blocks.test.ts`:

```ts
{
  blockType: "githubProfile",
  heading: "GitHub",
  intro: "Selected public work and coding signal.",
  ctaLabel: "Open profile",
  ctaUrl: "https://github.com/example",
}
```

And assert the mapped result contains:

```ts
{
  blockType: "githubProfile",
  heading: "GitHub",
  intro: "Selected public work and coding signal.",
  ctaLabel: "Open profile",
  ctaUrl: "https://github.com/example",
}
```

Also update the registered block slug list to include:

```ts
"githubProfile"
```

- [ ] **Step 3: Add a focused contact rendering test file**

Create `tests/contact-ui.test.tsx` with:

```tsx
import { describe, expect, it } from "vitest";
import { normalizeContactSettings } from "../src/features/site/contact";

describe("contact settings normalization", () => {
  it("drops empty values instead of returning placeholders", () => {
    expect(
      normalizeContactSettings({
        email: "   ",
        githubUrl: "",
        linkedinUrl: "   ",
      }),
    ).toEqual({
      email: undefined,
      githubUrl: undefined,
      linkedinUrl: undefined,
    });
  });

  it("keeps valid values intact", () => {
    expect(
      normalizeContactSettings({
        email: "hans@imberg.dev",
        githubUrl: "https://github.com/imberg",
        linkedinUrl: "https://linkedin.com/in/imberg",
      }),
    ).toEqual({
      email: "hans@imberg.dev",
      githubUrl: "https://github.com/imberg",
      linkedinUrl: "https://linkedin.com/in/imberg",
    });
  });
});
```

- [ ] **Step 4: Run the focused test files and verify failure**

Run:

```powershell
npm.cmd test -- tests/site-data-contract.test.ts tests/home-page-blocks.test.ts tests/contact-ui.test.tsx
```

Expected:

- FAIL because `settings.contact` does not exist yet
- FAIL because `githubProfile` is not mapped/registered yet
- FAIL because `src/features/site/contact` does not exist yet

- [ ] **Step 5: Commit the failing tests**

```bash
git add tests/site-data-contract.test.ts tests/home-page-blocks.test.ts tests/contact-ui.test.tsx
git commit -m "test: define contact and github content contracts"
```

## Task 2: Implement Contact/Social Schema and Public Mapping

**Files:**
- Create: `src/features/site/contact.ts`
- Modify: `src/payload/globals/site-settings.ts`
- Modify: `src/features/site/data/payload-site.ts`
- Modify: `tests/site-data-contract.test.ts`
- Modify: `tests/contact-ui.test.tsx`

- [ ] **Step 1: Implement contact normalization helpers**

Create `src/features/site/contact.ts`:

```ts
type RawContactSettings = {
  email?: unknown;
  githubUrl?: unknown;
  linkedinUrl?: unknown;
};

export type SiteContactSettings = {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

function readTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function normalizeContactSettings(
  value: RawContactSettings | null | undefined,
): SiteContactSettings {
  return {
    email: readTrimmedString(value?.email),
    githubUrl: readTrimmedString(value?.githubUrl),
    linkedinUrl: readTrimmedString(value?.linkedinUrl),
  };
}
```

- [ ] **Step 2: Extend Payload site settings**

Add this group to `src/payload/globals/site-settings.ts` after `navigation`:

```ts
{
  name: "contact",
  type: "group",
  fields: [
    {
      name: "email",
      type: "text",
    },
    {
      name: "linkedinUrl",
      type: "text",
    },
    {
      name: "githubUrl",
      type: "text",
    },
  ],
},
```

- [ ] **Step 3: Extend the site model**

Update the `SiteModel` type and fallback in `src/features/site/data/payload-site.ts`:

```ts
import {
  normalizeContactSettings,
  type SiteContactSettings,
} from "../contact";

type RawSiteSettings = {
  contact?: unknown;
  navigation?: unknown;
  seo?: unknown;
  siteDescription?: unknown;
  siteSubtitle?: unknown;
  siteTitle?: unknown;
};

export type SiteModel = {
  // existing fields...
  settings: {
    contact: SiteContactSettings;
    seo: {
      // existing fields...
    };
    siteDescription: string;
    siteSubtitle?: string;
    siteTitle: string;
  };
  // existing fields...
};

export function getFallbackSiteModel(): SiteModel {
  return {
    // existing fields...
    settings: {
      contact: {
        email: undefined,
        githubUrl: undefined,
        linkedinUrl: undefined,
      },
      // existing settings...
    },
  };
}
```

Then in the live mapper return:

```ts
contact: normalizeContactSettings(
  (settingsData?.contact as Record<string, unknown> | null | undefined) ?? {},
),
```

- [ ] **Step 4: Run the focused tests and verify pass**

Run:

```powershell
npm.cmd test -- tests/site-data-contract.test.ts tests/contact-ui.test.tsx
```

Expected:

- PASS for fallback contact settings
- PASS for normalization behavior

- [ ] **Step 5: Commit the schema/mapping foundation**

```bash
git add src/features/site/contact.ts src/payload/globals/site-settings.ts src/features/site/data/payload-site.ts tests/site-data-contract.test.ts tests/contact-ui.test.tsx
git commit -m "feat: add cms-managed contact and social settings"
```

## Task 3: Add Homepage GitHub Block Types and Mapping

**Files:**
- Modify: `src/payload/blocks/home-blocks.ts`
- Modify: `src/features/site/data/home-page.ts`
- Modify: `tests/home-page-blocks.test.ts`
- Modify: `tests/payload-config-shape.test.ts`

- [ ] **Step 1: Add the new Payload block definition**

Append to `src/payload/blocks/home-blocks.ts`:

```ts
export const GithubProfileBlock: Block = {
  slug: "githubProfile",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "ctaLabel",
      type: "text",
      required: true,
    },
    {
      name: "ctaUrl",
      type: "text",
      required: true,
    },
  ],
};
```

And include it in `HomeBlocks`.

- [ ] **Step 2: Add type + mapper support**

Extend `src/features/site/data/home-page.ts` with:

```ts
export type HomeGithubProfileBlock = {
  blockType: "githubProfile";
  ctaLabel: string;
  ctaUrl: string;
  heading: string;
  intro?: string;
};
```

Add the union member and `RawHomeBlock` keys:

```ts
  ctaLabel?: unknown;
  ctaUrl?: unknown;
```

Add the mapper case:

```ts
      case "githubProfile":
        if (block.heading && block.ctaLabel && block.ctaUrl) {
          result.push({
            blockType: "githubProfile",
            ctaLabel: readString(block.ctaLabel),
            ctaUrl: readString(block.ctaUrl),
            heading: readString(block.heading),
            intro: block.intro ? readString(block.intro) : undefined,
          });
        }
        break;
```

- [ ] **Step 3: Update Payload config shape expectations**

Add the new block slug expectation to `tests/payload-config-shape.test.ts` using the existing block-shape assertion style.

Expected slug to include:

```ts
"githubProfile"
```

- [ ] **Step 4: Run the block-related tests**

Run:

```powershell
npm.cmd test -- tests/home-page-blocks.test.ts tests/payload-config-shape.test.ts
```

Expected:

- PASS for block mapping
- PASS for Payload block registration shape

- [ ] **Step 5: Commit the new homepage block contract**

```bash
git add src/payload/blocks/home-blocks.ts src/features/site/data/home-page.ts tests/home-page-blocks.test.ts tests/payload-config-shape.test.ts
git commit -m "feat: add github profile home block"
```

## Task 4: Build the Contact UI Islands and Responsive Header

**Files:**
- Create: `src/app/(site)/components/contact-modal.tsx`
- Create: `src/app/(site)/components/contact-actions.tsx`
- Create: `src/app/(site)/components/mobile-nav.tsx`
- Create: `src/app/(site)/components/social-icon-links.tsx`
- Create: `src/app/(site)/components/copy-email-button.tsx`
- Modify: `src/app/(site)/components/site-navigation.tsx`
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Create a copy-email button**

Create `src/app/(site)/components/copy-email-button.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@chakra-ui/react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button onClick={handleCopy} size="sm" variant="ghost">
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
```

- [ ] **Step 2: Create the shared contact modal**

Create `src/app/(site)/components/contact-modal.tsx`:

```tsx
"use client";

import NextLink from "next/link";
import { Button, Dialog, Link, Stack, Text } from "@chakra-ui/react";
import { CopyEmailButton } from "./copy-email-button";

export type ContactModalProps = {
  email?: string;
  linkedinUrl?: string;
  open: boolean;
  onClose: () => void;
};

export function ContactModal({
  email,
  linkedinUrl,
  open,
  onClose,
}: ContactModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Contact</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              {email && (
                <Stack gap={2}>
                  <Text>{email}</Text>
                  <Stack direction="row" gap={2}>
                    <CopyEmailButton email={email} />
                    <Button asChild size="sm" variant="subtle">
                      <NextLink href={`mailto:${email}`}>Open email app</NextLink>
                    </Button>
                  </Stack>
                </Stack>
              )}
              {linkedinUrl && (
                <Link asChild color="accent">
                  <NextLink href={linkedinUrl}>Open LinkedIn</NextLink>
                </Link>
              )}
            </Stack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
```

- [ ] **Step 3: Create the trigger wrapper and mobile drawer**

Create `src/app/(site)/components/contact-actions.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button, Link } from "@chakra-ui/react";
import { ContactModal } from "./contact-modal";

type ContactActionsProps = {
  email?: string;
  label?: string;
  linkedinUrl?: string;
};

export function ContactActions({
  email,
  label = "Contact",
  linkedinUrl,
}: ContactActionsProps) {
  const [open, setOpen] = useState(false);

  if (!email && !linkedinUrl) {
    return null;
  }

  return (
    <>
      <Link as="button" color="muted" onClick={() => setOpen(true)}>
        {label}
      </Link>
      <ContactModal
        email={email}
        linkedinUrl={linkedinUrl}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
```

Create `src/app/(site)/components/mobile-nav.tsx` with a small Chakra `Drawer`/`Dialog`-based burger menu that renders nav links and `ContactActions` only on mobile.

- [ ] **Step 4: Add social icon links and integrate layout**

Create `src/app/(site)/components/social-icon-links.tsx` to render only valid URLs.

Update `src/app/(site)/layout.tsx` so that:

- desktop shows `SiteNavigation`, `ContactActions`, and `SocialIconLinks`
- mobile shows `SocialIconLinks` and `MobileNav`
- footer shows email and `CopyEmailButton` only when `site.settings.contact.email` exists

Update `src/app/(site)/components/site-navigation.tsx` only if needed to keep desktop nav server/client boundary clean.

- [ ] **Step 5: Run typecheck and full tests**

Run:

```powershell
npm.cmd run typecheck
npm.cmd test
```

Expected:

- `tsc --noEmit` succeeds
- existing test suite still passes

- [ ] **Step 6: Commit the responsive contact UX**

```bash
git add src/app/(site)/components/contact-modal.tsx src/app/(site)/components/contact-actions.tsx src/app/(site)/components/mobile-nav.tsx src/app/(site)/components/social-icon-links.tsx src/app/(site)/components/copy-email-button.tsx src/app/(site)/layout.tsx src/app/(site)/components/site-navigation.tsx
git commit -m "feat: add responsive contact modal and mobile navigation"
```

## Task 5: Add Safe Server-Side GitHub/WakaTime Stats

**Files:**
- Create: `src/features/site/github-stats.ts`
- Create: `tests/github-stats.test.ts`

- [ ] **Step 1: Write omission-first stats tests**

Create `tests/github-stats.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { compactGithubStats } from "../src/features/site/github-stats";

describe("github stats compaction", () => {
  it("omits cards with missing values", () => {
    expect(
      compactGithubStats([
        { label: "Repositories", value: "24" },
        { label: "Contributions", value: undefined },
        { label: "Hours", value: undefined },
      ]),
    ).toEqual([{ label: "Repositories", value: "24" }]);
  });

  it("returns an empty array instead of zero fallbacks", () => {
    expect(
      compactGithubStats([
        { label: "Repositories", value: undefined },
        { label: "Contributions", value: undefined },
      ]),
    ).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the new test and verify failure**

Run:

```powershell
npm.cmd test -- tests/github-stats.test.ts
```

Expected:

- FAIL because `compactGithubStats` does not exist yet

- [ ] **Step 3: Implement the server helper**

Create `src/features/site/github-stats.ts`:

```ts
export type GithubStatCard = {
  label: string;
  value?: string;
};

export function compactGithubStats(cards: GithubStatCard[]): Array<{
  label: string;
  value: string;
}> {
  return cards.filter(
    (card): card is { label: string; value: string } =>
      typeof card.value === "string" && card.value.trim().length > 0,
  );
}
```

Then extend this file with server-only fetch helpers that:

- read tokens from env
- return `undefined` on network/auth/shape failures
- never synthesize `0` values

- [ ] **Step 4: Re-run the stats tests**

Run:

```powershell
npm.cmd test -- tests/github-stats.test.ts
```

Expected:

- PASS for omission-first behavior

- [ ] **Step 5: Commit the stats helper foundation**

```bash
git add src/features/site/github-stats.ts tests/github-stats.test.ts
git commit -m "feat: add safe github stats utilities"
```

## Task 6: Render the GitHub Block and Update CTA Behavior

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/features/site/data/home-page.ts`
- Modify: `src/features/site/data/payload-site.ts`
- Modify: `tests/home-page-blocks.test.ts`
- Modify: `tests/contact-ui.test.tsx`

- [ ] **Step 1: Update CTA rendering rules**

In `src/app/(site)/page.tsx`, change the `contactCta` case so that:

- the primary action opens the shared contact modal
- the LinkedIn action renders only when `site.settings.contact.linkedinUrl` exists
- GitHub is no longer part of CTA behavior

Use the server-fed site settings instead of trusting block-level URLs for identity links.

- [ ] **Step 2: Render the new GitHub block**

In `src/app/(site)/page.tsx`, add a `githubProfile` case that:

- fetches stats through the server helper before rendering
- renders only cards with real values
- renders intro + CTA even when every stat card is omitted

Expected JSX shape:

```tsx
<Stack gap={6}>
  <Stack gap={3} maxW="3xl">
    <Heading as="h2">{block.heading}</Heading>
    {block.intro && <Text color="muted">{block.intro}</Text>}
  </Stack>
  {stats.length > 0 && (
    <Grid templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}>
      {stats.map((stat) => (
        <Box key={stat.label}>
          <Text color="accent">{stat.value}</Text>
          <Text color="muted">{stat.label}</Text>
        </Box>
      ))}
    </Grid>
  )}
  <Link asChild color="accent">
    <NextLink href={block.ctaUrl}>{block.ctaLabel}</NextLink>
  </Link>
</Stack>
```

- [ ] **Step 3: Run focused homepage tests**

Run:

```powershell
npm.cmd test -- tests/home-page-blocks.test.ts tests/contact-ui.test.tsx tests/github-stats.test.ts
```

Expected:

- PASS for block mapping
- PASS for safe omission behavior
- PASS for contact normalization/conditional rules

- [ ] **Step 4: Run verification suite**

Run:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Expected:

- typecheck passes
- test suite passes
- Next build passes without `.ts` import-extension regressions

- [ ] **Step 5: Commit the homepage integration**

```bash
git add src/app/(site)/page.tsx src/features/site/data/home-page.ts src/features/site/data/payload-site.ts tests/home-page-blocks.test.ts tests/contact-ui.test.tsx tests/github-stats.test.ts
git commit -m "feat: add github signal block and contact cta integration"
```

## Task 7: Add Migration and Seed the CMS Fields

**Files:**
- Create: `src/migrations/20260503_210000_add_contact_and_github_fields.ts`
- Modify: `src/migrations/index.ts`
- Modify: `src/payload/globals/site-settings.ts`

- [ ] **Step 1: Add the migration file**

Create a migration that adds columns for the new `site_settings.contact.*` fields and any required tables/columns for the GitHub block content.

At minimum, include SQL for:

```ts
await db.execute(sql`
  ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS contact_email varchar,
  ADD COLUMN IF NOT EXISTS contact_linkedin_url varchar,
  ADD COLUMN IF NOT EXISTS contact_github_url varchar;
`);
```

Then add any block-schema evolution statements needed for homepage blocks.

- [ ] **Step 2: Register the migration**

Update `src/migrations/index.ts` to export the new migration in order.

- [ ] **Step 3: Seed the initial contact values**

Prepare the dev CMS data so `site-settings.contact.email` is populated with:

```txt
hans@imberg.dev
```

Leave GitHub/LinkedIn values empty unless the user has already provided exact URLs.

- [ ] **Step 4: Verify migration path**

Run:

```powershell
npm.cmd test -- tests/payload-config-shape.test.ts tests/site-data-contract.test.ts
```

Then, if the local Payload CLI is still blocked, document the exact fallback SQL used for dev seeding in the commit message or task notes.

Expected:

- schema tests pass
- migration file is registered

- [ ] **Step 5: Commit the schema evolution**

```bash
git add src/migrations/20260503_210000_add_contact_and_github_fields.ts src/migrations/index.ts src/payload/globals/site-settings.ts
git commit -m "feat: add contact and github cms schema migration"
```

## Spec Coverage Review

- Shared contact modal: covered in Task 4 and Task 6
- Mobile burger menu: covered in Task 4
- CMS-managed email / LinkedIn / GitHub settings: covered in Task 2 and Task 7
- Conditional icon/email rendering: covered in Task 2, Task 4, and Task 6
- CTA changes from Email + LinkedIn: covered in Task 6
- New GitHub profile block: covered in Task 3 and Task 6
- Safe GitHub/WakaTime omission behavior: covered in Task 5 and Task 6
- No secrets in CMS: preserved by Task 5 and Task 7

