import { describe, expect, it } from "vitest";
import { HomeBlocks } from "../src/payload/blocks/home-blocks";
import {
  getDefaultHomePage,
  mapHomePageData,
} from "../src/features/site/data/home-page";

describe("home page content mapping", () => {
  it("keeps the current hero as a fallback when CMS hero content is missing", () => {
    expect(getDefaultHomePage().hero).toMatchObject({
      body: "The legacy custom CMS has been replaced by a Payload-first foundation. The interface is intentionally compact, angular, and product-like.",
      eyebrow: "Payload-backed publishing system",
      heading: "Minimal dark CMS architecture for a sharper professional site.",
      showFeatured: true,
    });
  });

  it("maps the hero featured switch and supplemental blocks from Payload", () => {
    const homePage = mapHomePageData({
      blocks: [
        {
          blockType: "hero",
          eyebrow: "Studio",
          heading: "Custom hero",
          body: "Custom body",
          featured: false,
          primaryLink: {
            href: "/writing",
            label: "Open writing",
          },
        },
        {
          blockType: "text",
          heading: "Intro",
          body: "Text body",
        },
        {
          blockType: "callout",
          heading: "Signal",
          body: "Callout body",
        },
        {
          blockType: "quote",
          quote: "Less hype, more doing.",
          attribution: "Hans Imberg",
          role: "Builder",
        },
        {
          blockType: "highlights",
          heading: "Highlights",
          intro: "What I bring quickly.",
          items: [
            {
              eyebrow: "Capability",
              title: "Systems thinking",
              body: "From architecture to delivery.",
            },
          ],
        },
        {
          blockType: "timeline",
          heading: "Timeline",
          items: [
            {
              period: "Now",
              title: "CS + applied projects",
              summary: "Building real systems across domains.",
            },
          ],
        },
        {
          blockType: "contactCta",
          heading: "Let us build",
          body: "Open to interesting projects.",
          primaryLink: {
            label: "Contact",
          },
        },
        {
          blockType: "githubProfile",
          heading: "GitHub",
          intro: "Selected public work and coding signal.",
          contributionWindow: "allTime",
          ctaLabel: "Open profile",
          ctaUrl: "https://github.com/example",
          statsRepoUrl: "https://github.com/hansimb/pro-site-cms",
          showPublicRepos: true,
          showContributions: false,
          showCodingTime: true,
          showProductionDeployments: true,
        },
        {
          blockType: "linkList",
          heading: "Explore",
          links: [
            {
              href: "/case-studies",
              label: "Case studies",
            },
          ],
        },
      ],
    });

    expect(homePage.hero).toMatchObject({
      eyebrow: "Studio",
      heading: "Custom hero",
      body: "Custom body",
      showFeatured: false,
    });
    expect(homePage.blocks).toEqual([
      {
        blockType: "text",
        body: "Text body",
        heading: "Intro",
      },
      {
        blockType: "callout",
        body: "Callout body",
        heading: "Signal",
      },
      {
        attribution: "Hans Imberg",
        blockType: "quote",
        quote: "Less hype, more doing.",
        role: "Builder",
      },
      {
        blockType: "highlights",
        heading: "Highlights",
        intro: "What I bring quickly.",
        items: [
          {
            body: "From architecture to delivery.",
            eyebrow: "Capability",
            title: "Systems thinking",
          },
        ],
      },
      {
        blockType: "timeline",
        heading: "Timeline",
        items: [
          {
            period: "Now",
            summary: "Building real systems across domains.",
            title: "CS + applied projects",
          },
        ],
      },
      {
        blockType: "contactCta",
        body: "Open to interesting projects.",
        buttonLabel: "Contact",
        heading: "Let us build",
      },
      {
        blockType: "githubProfile",
        contributionWindow: "allTime",
        ctaLabel: "Open profile",
        ctaUrl: "https://github.com/example",
        heading: "GitHub",
        intro: "Selected public work and coding signal.",
        showCodingTime: true,
        showContributions: false,
        showProductionDeployments: true,
        showPublicRepos: true,
        statsRepoUrl: "https://github.com/hansimb/pro-site-cms",
      },
      {
        blockType: "linkList",
        heading: "Explore",
        links: [
          {
            href: "/case-studies",
            label: "Case studies",
          },
        ],
      },
    ]);
  });

  it("registers the extra home page block choices in Payload", () => {
    expect(HomeBlocks.map((block) => block.slug)).toEqual([
      "hero",
      "text",
      "quote",
      "highlights",
      "timeline",
      "contactCta",
      "featuredCaseStudies",
      "githubProfile",
      "callout",
      "linkList",
    ]);
  });
});
