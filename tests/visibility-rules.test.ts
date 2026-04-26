import { describe, expect, it } from "vitest";
import {
  canRenderFeaturedArticles,
  canRenderFeaturedCaseStudies,
  getVisibleTopics,
  shouldShowCaseStudies,
  shouldShowWriting,
} from "../src/lib/content/visibility";

describe("visibility rules", () => {
  it("shows case studies only when at least one case is published", () => {
    expect(
      shouldShowCaseStudies([
        {
          published: false,
        },
      ]),
    ).toBe(false);

    expect(
      shouldShowCaseStudies([
        {
          published: true,
        },
      ]),
    ).toBe(true);
  });

  it("shows writing only when at least one article is published", () => {
    expect(
      shouldShowWriting([
        {
          published: false,
        },
      ]),
    ).toBe(false);

    expect(
      shouldShowWriting([
        {
          published: true,
        },
      ]),
    ).toBe(true);
  });

  it("returns only topics that have published articles", () => {
    const topics = [
      {
        slug: "business-economics",
        title: "Business & Economics",
        description: "Markets and institutions.",
        published: true,
      },
      {
        slug: "tech",
        title: "Tech",
        description: "Systems and software.",
        published: true,
      },
    ];

    const visibleTopics = getVisibleTopics(topics, [
      {
        topic: "tech",
        published: true,
      },
      {
        topic: "business-economics",
        published: false,
      },
    ]);

    expect(visibleTopics).toHaveLength(1);
    expect(visibleTopics[0]?.slug).toBe("tech");
  });

  it("keeps featured sections hidden when there is no published content", () => {
    expect(canRenderFeaturedArticles([])).toBe(false);
    expect(canRenderFeaturedCaseStudies([])).toBe(false);
  });
});
