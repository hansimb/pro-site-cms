import { describe, expect, it } from "vitest";
import type { SiteArticle, SiteCaseStudy } from "../src/features/site/data/payload-site";
import { getFallbackSiteModel } from "../src/features/site/data/payload-site";
import {
  buildArticleMetadata,
  buildCaseStudyMetadata,
  buildSiteMetadata,
} from "../src/features/site/metadata";

describe("site metadata helpers", () => {
  it("builds root metadata from site settings defaults", () => {
    const site = getFallbackSiteModel();

    expect(buildSiteMetadata(site)).toMatchObject({
      title: {
        default: "imberg.dev",
        template: "%s | imberg.dev",
      },
      description:
        "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
      openGraph: {
        title: "imberg.dev",
      },
      twitter: {
        card: "summary_large_image",
      },
    });
  });

  it("builds article metadata from article content with site defaults as fallback", () => {
    const site = getFallbackSiteModel();
    const article: SiteArticle = {
      content: null,
      excerpt: "A practical article about building software through real projects.",
      keywords: [],
      publishedAt: "2026-05-03T10:00:00.000Z",
      references: [],
      title: "Started Through Real Projects",
      topic: "writing",
    };

    expect(buildArticleMetadata(site, article)).toMatchObject({
      title: "Started Through Real Projects",
      description:
        "A practical article about building software through real projects.",
      openGraph: {
        type: "article",
        title: "Started Through Real Projects",
      },
    });
  });

  it("builds case study metadata from case study content with site defaults as fallback", () => {
    const site = getFallbackSiteModel();
    const caseStudy: SiteCaseStudy = {
      background: "Initial business context.",
      content: null,
      links: [],
      problem: "A delivery and workflow problem.",
      process: "Iterative implementation and testing.",
      results: "A stronger process and clearer output.",
      solution: "A practical software solution.",
      summary: "An applied case study about delivering practical results.",
      tags: [],
      title: "SOLIS Smart Light",
      whatILearned: "Lower-level systems thinking.",
    };

    expect(buildCaseStudyMetadata(site, caseStudy)).toMatchObject({
      title: "SOLIS Smart Light",
      description:
        "An applied case study about delivering practical results.",
      openGraph: {
        type: "article",
        title: "SOLIS Smart Light",
      },
    });
  });
});
