type RawLink = {
  href?: unknown;
  label?: unknown;
};

type RawHomeBlock = {
  attribution?: unknown;
  blockType?: unknown;
  body?: unknown;
  ctaLabel?: unknown;
  ctaUrl?: unknown;
  eyebrow?: unknown;
  featured?: unknown;
  heading?: unknown;
  intro?: unknown;
  items?: unknown;
  links?: unknown;
  primaryLink?: unknown;
  quote?: unknown;
  role?: unknown;
  secondaryLink?: unknown;
  summary?: unknown;
  period?: unknown;
  title?: unknown;
};

type RawHighlightItem = {
  body?: unknown;
  eyebrow?: unknown;
  title?: unknown;
};

type RawTimelineItem = {
  period?: unknown;
  summary?: unknown;
  title?: unknown;
};

type RawCaseStudyItem = {
  slug?: unknown;
  summary?: unknown;
  title?: unknown;
};

export type HomeLink = {
  href: string;
  label: string;
};

export type HomeHero = {
  body: string;
  eyebrow: string;
  heading: string;
  primaryLink?: HomeLink;
  showFeatured: boolean;
};

export type HomeTextBlock = {
  blockType: "text";
  body: string;
  heading: string;
};

export type HomeQuoteBlock = {
  attribution?: string;
  blockType: "quote";
  role?: string;
  quote: string;
};

export type HomeHighlightsBlock = {
  blockType: "highlights";
  heading: string;
  intro?: string;
  items: Array<{
    body: string;
    eyebrow?: string;
    title: string;
  }>;
};

export type HomeTimelineBlock = {
  blockType: "timeline";
  heading: string;
  intro?: string;
  items: Array<{
    period: string;
    summary: string;
    title: string;
  }>;
};

export type HomeContactCtaBlock = {
  blockType: "contactCta";
  body: string;
  heading: string;
  primaryLink?: HomeLink;
  secondaryLink?: HomeLink;
};

export type HomeFeaturedCaseStudiesBlock = {
  blockType: "featuredCaseStudies";
  heading: string;
  intro?: string;
  items: Array<{
    href: string;
    summary: string;
    title: string;
  }>;
};

export type HomeGithubProfileBlock = {
  blockType: "githubProfile";
  ctaLabel: string;
  ctaUrl: string;
  heading: string;
  intro?: string;
};

export type HomeCalloutBlock = {
  blockType: "callout";
  body: string;
  heading: string;
};

export type HomeLinkListBlock = {
  blockType: "linkList";
  heading: string;
  links: HomeLink[];
};

export type HomePageContent = {
  blocks: Array<
    | HomeTextBlock
    | HomeQuoteBlock
    | HomeHighlightsBlock
    | HomeTimelineBlock
    | HomeContactCtaBlock
    | HomeFeaturedCaseStudiesBlock
    | HomeGithubProfileBlock
    | HomeCalloutBlock
    | HomeLinkListBlock
  >;
  hero: HomeHero;
};

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeLink(value: unknown): HomeLink | undefined {
  const link = value as RawLink | null | undefined;

  if (!link?.label || !link?.href) {
    return undefined;
  }

  return {
    href: String(link.href),
    label: String(link.label),
  };
}

function normalizeHighlightItem(value: unknown) {
  const item = value as RawHighlightItem | null | undefined;

  if (!item?.title || !item?.body) {
    return undefined;
  }

  return {
    body: readString(item.body),
    eyebrow: item.eyebrow ? readString(item.eyebrow) : undefined,
    title: readString(item.title),
  };
}

function normalizeTimelineItem(value: unknown) {
  const item = value as RawTimelineItem | null | undefined;

  if (!item?.period || !item?.title || !item?.summary) {
    return undefined;
  }

  return {
    period: readString(item.period),
    summary: readString(item.summary),
    title: readString(item.title),
  };
}

function normalizeFeaturedCaseStudyItem(value: unknown) {
  const item = value as RawCaseStudyItem | string | number | null | undefined;

  if (!item || typeof item === "string" || typeof item === "number") {
    return undefined;
  }

  if (!item.slug || !item.title || !item.summary) {
    return undefined;
  }

  return {
    href: `/case-studies/${encodeURIComponent(readString(item.slug))}`,
    summary: readString(item.summary),
    title: readString(item.title),
  };
}

export function getDefaultHomePage(): HomePageContent {
  return {
    hero: {
      eyebrow: "Payload-backed publishing system",
      heading: "Minimal dark CMS architecture for a sharper professional site.",
      body: "The legacy custom CMS has been replaced by a Payload-first foundation. The interface is intentionally compact, angular, and product-like.",
      showFeatured: true,
    },
    blocks: [],
  };
}

export function mapHomePageData(doc: unknown): HomePageContent {
  const fallback = getDefaultHomePage();
  const source = doc as { blocks?: unknown } | null | undefined;
  const rawBlocks = Array.isArray(source?.blocks)
    ? (source.blocks as RawHomeBlock[])
    : [];
  const heroBlock = rawBlocks.find((block) => block?.blockType === "hero");

  const hero: HomeHero = heroBlock
    ? {
        eyebrow: readString(heroBlock.eyebrow, fallback.hero.eyebrow),
        heading: readString(heroBlock.heading, fallback.hero.heading),
        body: readString(heroBlock.body, fallback.hero.body),
        primaryLink: normalizeLink(heroBlock.primaryLink),
        showFeatured:
          typeof heroBlock.featured === "boolean"
            ? heroBlock.featured
            : fallback.hero.showFeatured,
      }
    : fallback.hero;

  const blocks = rawBlocks.reduce<HomePageContent["blocks"]>((result, block) => {
    switch (block?.blockType) {
      case "text":
        if (block.heading && block.body) {
          result.push({
            blockType: "text",
            heading: readString(block.heading),
            body: readString(block.body),
          });
        }
        break;

      case "callout":
        if (block.heading && block.body) {
          result.push({
            blockType: "callout",
            heading: readString(block.heading),
            body: readString(block.body),
          });
        }
        break;

      case "quote":
        if (block.quote) {
          result.push({
            blockType: "quote",
            attribution: block.attribution
              ? readString(block.attribution)
              : undefined,
            quote: readString(block.quote),
            role: block.role ? readString(block.role) : undefined,
          });
        }
        break;

      case "highlights":
        if (block.heading) {
          result.push({
            blockType: "highlights",
            heading: readString(block.heading),
            intro: block.intro ? readString(block.intro) : undefined,
            items: Array.isArray(block.items)
              ? block.items
                  .map(normalizeHighlightItem)
                  .filter((value): value is NonNullable<typeof value> =>
                    Boolean(value),
                  )
              : [],
          });
        }
        break;

      case "timeline":
        if (block.heading) {
          result.push({
            blockType: "timeline",
            heading: readString(block.heading),
            intro: block.intro ? readString(block.intro) : undefined,
            items: Array.isArray(block.items)
              ? block.items
                  .map(normalizeTimelineItem)
                  .filter((value): value is NonNullable<typeof value> =>
                    Boolean(value),
                  )
              : [],
          });
        }
        break;

      case "contactCta":
        if (block.heading && block.body) {
          result.push({
            blockType: "contactCta",
            body: readString(block.body),
            heading: readString(block.heading),
            primaryLink: normalizeLink(block.primaryLink),
            secondaryLink: normalizeLink(block.secondaryLink),
          });
        }
        break;

      case "featuredCaseStudies":
        if (block.heading) {
          result.push({
            blockType: "featuredCaseStudies",
            heading: readString(block.heading),
            intro: block.intro ? readString(block.intro) : undefined,
            items: Array.isArray(block.items)
              ? block.items
                  .map(normalizeFeaturedCaseStudyItem)
                  .filter((value): value is NonNullable<typeof value> =>
                    Boolean(value),
                  )
              : [],
          });
        }
        break;

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

      case "linkList":
        if (block.heading) {
          result.push({
            blockType: "linkList",
            heading: readString(block.heading),
            links: Array.isArray(block.links)
              ? block.links
                  .map(normalizeLink)
                  .filter((value): value is HomeLink => Boolean(value))
              : [],
          });
        }
        break;
    }

    return result;
  }, []);

  return {
    hero,
    blocks,
  };
}
