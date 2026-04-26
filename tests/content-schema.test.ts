import { describe, expect, it } from "vitest";
import {
  articleFrontmatterSchema,
  caseStudySchema,
  homeDocumentSchema,
  siteSettingsSchema,
} from "../src/lib/content/schema";

describe("content schemas", () => {
  it("accepts a valid hero block inside the home document", () => {
    const result = homeDocumentSchema.safeParse({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          visible: true,
          eyebrow: "Strategy and systems",
          heading: "Thoughtful work, clearly presented.",
          body: "A dark and minimal publishing system for a personal professional site.",
          primaryLink: {
            label: "Read writing",
            href: "/writing",
          },
          secondaryLink: {
            label: "View work",
            href: "/case-studies",
          },
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid case study record", () => {
    const result = caseStudySchema.safeParse({
      id: "case-001",
      title: "Ops Dashboard",
      summary: "Internal operations dashboard for production planning.",
      background: "Small team, fragmented reporting.",
      problem: "Critical information was scattered across tools.",
      solution: "Built a compact web workflow for the most important decisions.",
      process: "Mapped the operational bottlenecks and simplified the data entry.",
      results: "Faster reviews and fewer spreadsheet handoffs.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/example/repo",
        },
      ],
      tags: ["operations", "dashboard"],
      published: true,
      featured: false,
    });

    expect(result.success).toBe(true);
  });

  it("accepts article metadata with ordered references", () => {
    const result = articleFrontmatterSchema.safeParse({
      title: "Industrial policy after fragmentation",
      slug: "industrial-policy-after-fragmentation",
      topic: "business-economics",
      excerpt: "A short analytical note on industrial policy and supply chain resilience.",
      publishedAt: "2026-04-26",
      updatedAt: "2026-04-26",
      published: true,
      featured: false,
      references: [
        {
          label: "OECD report",
          url: "https://example.com/oecd",
        },
        {
          label: "Policy brief",
          url: "https://example.com/policy",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("accepts site settings with an accent color", () => {
    const result = siteSettingsSchema.safeParse({
      siteTitle: "Pro Site CMS",
      siteDescription: "Editorial personal site starter.",
      accentColor: "#7ee081",
      footerText: "Built with intent.",
    });

    expect(result.success).toBe(true);
  });
});
