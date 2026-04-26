import { describe, expect, it } from "vitest";
import {
  parseArticleFile,
  serializeArticleFile,
} from "../src/lib/content/article-frontmatter";

describe("article frontmatter", () => {
  it("parses markdown frontmatter and preserves reference order", () => {
    const article = parseArticleFile(`---
title: Capital intensity after cheap money
slug: capital-intensity-after-cheap-money
topic: business-economics
excerpt: A short note on capital cycles and incentives.
publishedAt: 2026-04-26
updatedAt: 2026-04-26
published: true
featured: false
references:
  - label: BIS working paper
    url: https://example.com/bis
  - label: IMF outlook
    url: https://example.com/imf
---

Capital allocation is path dependent.
`);

    expect(article.references.map((reference) => reference.label)).toEqual([
      "BIS working paper",
      "IMF outlook",
    ]);
    expect(article.body).toContain("Capital allocation");
  });

  it("serializes article metadata and body back into markdown", () => {
    const output = serializeArticleFile({
      title: "Capital intensity after cheap money",
      slug: "capital-intensity-after-cheap-money",
      topic: "business-economics",
      excerpt: "A short note on capital cycles and incentives.",
      publishedAt: "2026-04-26",
      updatedAt: "2026-04-26",
      published: true,
      featured: false,
      references: [
        {
          label: "BIS working paper",
          url: "https://example.com/bis",
        },
        {
          label: "IMF outlook",
          url: "https://example.com/imf",
        },
      ],
      body: "Capital allocation is path dependent.",
    });

    expect(output).toContain("title: Capital intensity after cheap money");
    expect(output.indexOf("BIS working paper")).toBeLessThan(output.indexOf("IMF outlook"));
    expect(output.trim().endsWith("Capital allocation is path dependent.")).toBe(true);
  });
});
