import { describe, expect, it } from "vitest";
import { buildPublishFileMap } from "../src/lib/content/publish";
import {
  defaultCaseStudyIndex,
  defaultHomeDocument,
  defaultSiteSettings,
  defaultWritingTopics,
} from "../src/lib/content/defaults";

describe("publish file map", () => {
  it("writes current draft files and deletes removed articles in one batch", () => {
    const entries = buildPublishFileMap({
      articles: [
        {
          title: "Fresh note",
          slug: "fresh-note",
          topic: "tech",
          excerpt: "A concise note.",
          publishedAt: "2026-04-27",
          updatedAt: "2026-04-27",
          published: true,
          featured: false,
          references: [],
          body: "Hello draft world.",
        },
      ],
      caseStudies: defaultCaseStudyIndex.items,
      currentArticlePaths: [
        "content/writing/tech/old-note.md",
        "content/writing/tech/fresh-note.md",
      ],
      home: defaultHomeDocument,
      settings: defaultSiteSettings,
      topics: defaultWritingTopics.topics,
    });

    expect(entries["content/home/home.json"]).toContain("\"blocks\"");
    expect(entries["content/settings/site.json"]).toContain("\"siteTitle\"");
    expect(entries["content/case-studies/index.json"]).toContain("\"items\"");
    expect(entries["content/writing/topics.json"]).toContain("\"topics\"");
    expect(entries["content/writing/tech/fresh-note.md"]).toContain("Fresh note");
    expect(entries["content/writing/tech/old-note.md"]).toBeNull();
  });
});
