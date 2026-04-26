import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getAllArticles, getHomeDocument } from "../src/lib/content/loaders";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function createFixtureSite() {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "pro-site-cms-"));
  tempDirs.push(rootDir);

  await mkdir(path.join(rootDir, "content/home"), { recursive: true });
  await mkdir(path.join(rootDir, "content/writing/business-economics"), { recursive: true });
  await mkdir(path.join(rootDir, "content/writing"), { recursive: true });

  await writeFile(
    path.join(rootDir, "content/home/home.json"),
    JSON.stringify({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          visible: true,
          eyebrow: "Analytical systems",
          heading: "Thoughtful work, clearly presented.",
          body: "A dark CMS for a professional personal site.",
          primaryLink: {
            label: "Writing",
            href: "/writing",
          },
        },
      ],
    }),
  );

  await writeFile(
    path.join(rootDir, "content/writing/topics.json"),
    JSON.stringify({
      topics: [
        {
          slug: "business-economics",
          title: "Business & Economics",
          description: "Analytical writing on institutions and incentives.",
          published: true,
        },
        {
          slug: "tech",
          title: "Tech",
          description: "Technical systems and engineering judgment.",
          published: true,
        },
      ],
    }),
  );

  await writeFile(
    path.join(rootDir, "content/writing/business-economics/industrial-policy.md"),
    `---
title: Industrial policy after fragmentation
slug: industrial-policy-after-fragmentation
topic: business-economics
excerpt: A short note on resilience and industrial policy.
publishedAt: 2026-04-26
updatedAt: 2026-04-26
published: true
featured: true
references:
  - label: OECD report
    url: https://example.com/oecd
---

Trade fragmentation changes the shape of industrial policy.
`,
  );

  return rootDir;
}

describe("content loaders", () => {
  it("loads the home document from content/home/home.json", async () => {
    const rootDir = await createFixtureSite();

    const home = await getHomeDocument(rootDir);
    const firstBlock = home.blocks[0];

    expect(firstBlock?.type).toBe("hero");
    if (!firstBlock || firstBlock.type !== "hero") {
      throw new Error("Expected the first home block to be a hero block.");
    }
    expect(firstBlock.heading).toBe("Thoughtful work, clearly presented.");
  });

  it("loads Markdown articles from topic directories", async () => {
    const rootDir = await createFixtureSite();

    const articles = await getAllArticles(rootDir);

    expect(articles).toHaveLength(1);
    expect(articles[0]?.slug).toBe("industrial-policy-after-fragmentation");
    expect(articles[0]?.body).toContain("Trade fragmentation");
    expect(articles[0]?.references[0]?.label).toBe("OECD report");
  });
});
