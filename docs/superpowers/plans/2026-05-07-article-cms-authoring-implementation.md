# Article CMS Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Payload article authoring flow so articles support stronger SEO metadata, structured references, inline IEEE-style citation links, and a copyable citation box while remaining quick to write in the CMS.

**Architecture:** Extend the `articles` collection with lightweight metadata fields, update Payload-backed site data mapping to expose them, and improve the public article renderer so it can display stronger article metadata and transform `[n]` citation markers into anchored reference links at render time. Keep the existing Payload rich text stack and revalidation flow in place.

**Tech Stack:** Next.js App Router, Payload CMS, Payload Lexical rich text, Chakra UI, TypeScript, Vitest

---

## File Map

- Modify: `src/payload/collections/articles.ts`
  Add article SEO, citation, and richer reference fields.
- Modify: `src/features/site/data/payload-site.ts`
  Normalize and expose the new article fields to the public site.
- Modify: `src/features/site/metadata.ts`
  Prefer article-level SEO fields and canonical metadata.
- Modify: `src/app/(site)/components/rich-text-content.tsx`
  Add render-time inline citation linking support around rich text output.
- Create: `src/app/(site)/components/article-citation-box.tsx`
  Render a copyable citation string with sensible fallbacks.
- Modify: `src/app/(site)/writing/[topic]/[slug]/page.tsx`
  Show enhanced article metadata, citation box, and anchored references.
- Test: `tests/article-metadata.test.ts`
  Cover metadata fallback and canonical behavior.
- Test: `tests/article-citation-format.test.ts`
  Cover citation string formatting and fallback behavior.
- Test: `tests/article-reference-linking.test.tsx`
  Cover inline citation linking and broken-marker fallback behavior.

### Task 1: Lock the Article Data Contract

**Files:**
- Modify: `src/payload/collections/articles.ts`
- Test: `tests/article-metadata.test.ts`

- [ ] **Step 1: Write the failing collection-shape test**

```ts
import { describe, expect, it } from "vitest";
import { Articles } from "@/payload/collections/articles";

describe("Articles collection", () => {
  it("includes article SEO and citation fields", () => {
    const fieldNames = Articles.fields.map((field) =>
      "name" in field ? field.name : undefined,
    );

    expect(fieldNames).toContain("seoTitle");
    expect(fieldNames).toContain("seoDescription");
    expect(fieldNames).toContain("canonicalUrl");
    expect(fieldNames).toContain("keywords");
    expect(fieldNames).toContain("citationTitle");
    expect(fieldNames).toContain("citationAuthors");
    expect(fieldNames).toContain("citationPublication");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: FAIL because the collection does not yet define the new fields.

- [ ] **Step 3: Add the minimal schema changes**

```ts
{
  name: "seoTitle",
  type: "text",
},
{
  name: "seoDescription",
  type: "textarea",
},
{
  name: "canonicalUrl",
  type: "text",
},
{
  name: "keywords",
  type: "array",
  fields: [{ name: "keyword", type: "text", required: true }],
},
{
  name: "citationTitle",
  type: "text",
},
{
  name: "citationAuthors",
  type: "text",
},
{
  name: "citationPublication",
  type: "text",
},
```

Expand each `references` row:

```ts
{
  name: "publisher",
  type: "text",
},
{
  name: "publishedAt",
  type: "date",
},
{
  name: "accessedAt",
  type: "date",
},
```
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-metadata.test.ts src/payload/collections/articles.ts
git commit -m "feat: extend article metadata fields"
```

### Task 2: Expose the New Article Fields to the Site Layer

**Files:**
- Modify: `src/features/site/data/payload-site.ts`
- Test: `tests/article-metadata.test.ts`

- [ ] **Step 1: Add the failing data-mapping test**

```ts
import { describe, expect, it } from "vitest";
import { getFallbackSiteModel } from "@/features/site/data/payload-site";

describe("article site model", () => {
  it("keeps article-level SEO and citation fallbacks stable", () => {
    const site = getFallbackSiteModel();
    expect(site.settings.siteTitle).toBeTruthy();
  });
});
```

Add a mapper-focused assertion once helper exports exist:

```ts
expect(mappedArticle.seoTitle).toBe("Custom title");
expect(mappedArticle.references?.[0]?.publisher).toBe("OECD");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: FAIL because the public article type and mapper do not expose the new properties.

- [ ] **Step 3: Extend the raw and public article types plus mapping**

```ts
type RawReference = {
  accessedAt?: unknown;
  label?: unknown;
  publishedAt?: unknown;
  publisher?: unknown;
  url?: unknown;
};

export type SiteArticleReference = {
  accessedAt?: string;
  label: string;
  publishedAt?: string;
  publisher?: string;
  url: string;
};

export type SiteArticle = {
  canonicalUrl?: string;
  citationAuthors?: string;
  citationPublication?: string;
  citationTitle?: string;
  content: unknown;
  excerpt: string;
  keywords: string[];
  publishedAt?: string;
  references: SiteArticleReference[];
  seoDescription?: string;
  seoTitle?: string;
  title: string;
  topic: string;
  updatedAt?: string;
};
```

Map the new fields in `getArticleBySlug`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-metadata.test.ts src/features/site/data/payload-site.ts
git commit -m "feat: map article SEO and citation data"
```

### Task 3: Strengthen Article Metadata Output

**Files:**
- Modify: `src/features/site/metadata.ts`
- Test: `tests/article-metadata.test.ts`

- [ ] **Step 1: Write the failing metadata test**

```ts
import { describe, expect, it } from "vitest";
import { buildArticleMetadata } from "@/features/site/metadata";
import { getFallbackSiteModel } from "@/features/site/data/payload-site";

describe("buildArticleMetadata", () => {
  it("prefers article SEO overrides and canonical URL", () => {
    const metadata = buildArticleMetadata(getFallbackSiteModel(), {
      canonicalUrl: "https://example.com/canonical",
      citationAuthors: "A. Author",
      citationPublication: "imberg.dev",
      citationTitle: "Citation title",
      content: null,
      excerpt: "Excerpt",
      keywords: ["macro", "software"],
      references: [],
      seoDescription: "SEO description",
      seoTitle: "SEO title",
      title: "Plain title",
      topic: "Markets",
    });

    expect(metadata.title).toBe("SEO title");
    expect(metadata.description).toBe("SEO description");
    expect(metadata.alternates?.canonical).toBe("https://example.com/canonical");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: FAIL because `buildArticleMetadata` still uses only title and excerpt.

- [ ] **Step 3: Implement metadata overrides**

```ts
const title = trimToUndefined(article.seoTitle) ?? article.title;
const description =
  trimToUndefined(article.seoDescription) ??
  trimToUndefined(article.excerpt) ??
  trimToUndefined(site.settings.seo.metaDescription) ??
  site.settings.siteDescription;

return {
  title,
  description,
  alternates: article.canonicalUrl
    ? { canonical: article.canonicalUrl }
    : undefined,
  openGraph: {
    description,
    title,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    description,
    title,
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/article-metadata.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-metadata.test.ts src/features/site/metadata.ts
git commit -m "feat: improve article metadata fallbacks"
```

### Task 4: Add Citation Formatting and Copy UI

**Files:**
- Create: `src/app/(site)/components/article-citation-box.tsx`
- Test: `tests/article-citation-format.test.ts`

- [ ] **Step 1: Write the failing citation-format test**

```ts
import { describe, expect, it } from "vitest";
import { formatArticleCitation } from "@/app/(site)/components/article-citation-box";

describe("formatArticleCitation", () => {
  it("builds an IEEE-style online citation with fallbacks", () => {
    expect(
      formatArticleCitation({
        citationAuthors: "I. Imberi",
        citationPublication: "imberg.dev",
        citationTitle: "Tech and economics outlook",
        publishedAt: "2026-05-07T00:00:00.000Z",
        url: "https://imberg.dev/writing/outlook/test",
      }),
    ).toContain('I. Imberi, "Tech and economics outlook," imberg.dev, May 7, 2026.');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-citation-format.test.ts`
Expected: FAIL because the formatter and component do not exist.

- [ ] **Step 3: Create the formatter and copy box**

```tsx
export function formatArticleCitation(input: {
  citationAuthors?: string;
  citationPublication?: string;
  citationTitle?: string;
  publishedAt?: string;
  title: string;
  url: string;
}) {
  const title = input.citationTitle?.trim() || input.title;
  const authors = input.citationAuthors?.trim() || "Unknown author";
  const publication = input.citationPublication?.trim() || "imberg.dev";
  const date = input.publishedAt
    ? new Date(input.publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "n.d.";

  return `${authors}, "${title}," ${publication}, ${date}. [Online]. Available: ${input.url}`;
}
```

Render it with a Chakra `Textarea` or `Code` block plus a small copy button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/article-citation-format.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-citation-format.test.ts src/app/(site)/components/article-citation-box.tsx
git commit -m "feat: add article citation box"
```

### Task 5: Link Inline Citation Markers to References

**Files:**
- Modify: `src/app/(site)/components/rich-text-content.tsx`
- Test: `tests/article-reference-linking.test.tsx`

- [ ] **Step 1: Write the failing citation-linking test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { linkCitationText } from "@/app/(site)/components/rich-text-content";

describe("linkCitationText", () => {
  it("converts valid IEEE markers into anchor targets", () => {
    const parts = linkCitationText("Claim [1] and another [2].", 2);
    expect(parts).toHaveLength(5);
  });

  it("leaves invalid markers as plain text", () => {
    const parts = linkCitationText("Claim [3].", 2);
    expect(parts.join("")).toContain("[3]");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-reference-linking.test.tsx`
Expected: FAIL because no citation-linking helper exists.

- [ ] **Step 3: Implement the minimal helper and renderer hook**

```tsx
const citationPattern = /\[(\d+)\]/g;

export function linkCitationText(value: string, referenceCount: number) {
  const parts: Array<string | { index: number }> = [];
  let lastIndex = 0;

  for (const match of value.matchAll(citationPattern)) {
    const index = Number(match[1]);
    const start = match.index ?? 0;
    parts.push(value.slice(lastIndex, start));

    if (index >= 1 && index <= referenceCount) {
      parts.push({ index });
    } else {
      parts.push(match[0]);
    }

    lastIndex = start + match[0].length;
  }

  parts.push(value.slice(lastIndex));
  return parts;
}
```

Use the rich text component’s text rendering path to wrap valid citations with links like `href="#reference-1"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/article-reference-linking.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-reference-linking.test.tsx src/app/'(site)'/components/rich-text-content.tsx
git commit -m "feat: link inline article citations"
```

### Task 6: Finish the Article Page

**Files:**
- Modify: `src/app/(site)/writing/[topic]/[slug]/page.tsx`
- Modify: `src/app/(site)/components/rich-text-content.tsx`
- Create: `src/app/(site)/components/article-citation-box.tsx`
- Test: `tests/article-reference-linking.test.tsx`

- [ ] **Step 1: Write the failing page-level test**

```tsx
import { describe, expect, it } from "vitest";

describe("article page contract", () => {
  it("renders anchored references and the citation box", () => {
    expect(true).toBe(true);
  });
});
```

Replace the placeholder with a server-component-friendly assertion once the page contract is extracted into testable helpers.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-reference-linking.test.tsx`
Expected: FAIL after adding the concrete page assertions.

- [ ] **Step 3: Implement page rendering changes**

```tsx
<Text color="muted" fontSize="sm">
  Published {formatArticleDate(article.publishedAt)}
  {article.updatedAt ? ` • Updated ${formatArticleDate(article.updatedAt)}` : ""}
</Text>

<ArticleCitationBox
  article={article}
  articleUrl={`${site.settings.seo.siteUrl.replace(/\/$/, "")}/writing/${encodeURIComponent(article.topic)}/${encodeURIComponent(decodedSlug)}` }
  siteTitle={site.settings.siteTitle}
/>

<RichTextContent
  content={article.content}
  referenceCount={article.references.length}
/>

{article.references.length > 0 && (
  <Stack as="ol" gap={3}>
    {article.references.map((reference, index) => (
      <Box as="li" id={`reference-${index + 1}`} key={`${reference.label}-${reference.url}`}>
        ...
      </Box>
    ))}
  </Stack>
)}
```

- [ ] **Step 4: Run the targeted tests**

Run: `npm test -- tests/article-metadata.test.ts tests/article-citation-format.test.ts tests/article-reference-linking.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/article-metadata.test.ts tests/article-citation-format.test.ts tests/article-reference-linking.test.tsx src/app/'(site)'/components/article-citation-box.tsx src/app/'(site)'/components/rich-text-content.tsx src/app/'(site)'/writing/'[topic]'/'[slug]'/page.tsx
git commit -m "feat: upgrade article authoring presentation"
```

### Task 7: Final Verification

**Files:**
- Modify: none unless verification finds issues

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Manual verification**

Run: `npm run dev`
Expected:
- Payload article editor shows the new metadata and references fields.
- Public article page shows clickable `[1]`-style references.
- The citation box copies a stable citation string.
- References anchor correctly.

- [ ] **Step 5: Commit any follow-up fix**

```bash
git add .
git commit -m "test: verify article authoring upgrade"
```
