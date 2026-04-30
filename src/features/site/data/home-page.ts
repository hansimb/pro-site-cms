type RawLink = {
  href?: unknown;
  label?: unknown;
};

type RawHomeBlock = {
  blockType?: unknown;
  body?: unknown;
  eyebrow?: unknown;
  featured?: unknown;
  heading?: unknown;
  links?: unknown;
  primaryLink?: unknown;
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
  blocks: Array<HomeTextBlock | HomeCalloutBlock | HomeLinkListBlock>;
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
