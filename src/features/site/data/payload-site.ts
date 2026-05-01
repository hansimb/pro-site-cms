import configPromise from "@payload-config";
import payload from "payload";
import {
  getDefaultHomePage,
  mapHomePageData,
  type HomePageContent,
} from "./home-page";

type RawNavigationItem = {
  href?: unknown;
  label?: unknown;
};

type RawSiteSettings = {
  navigation?: unknown;
  siteDescription?: unknown;
  siteSubtitle?: unknown;
  siteTitle?: unknown;
};

type RawArticleDoc = {
  content?: unknown;
  excerpt?: unknown;
  publishedAt?: unknown;
  references?: unknown;
  slug?: unknown;
  title?: unknown;
  topic?: unknown;
};

type RawCaseStudyDoc = {
  background?: unknown;
  content?: unknown;
  links?: unknown;
  problem?: unknown;
  process?: unknown;
  results?: unknown;
  slug?: unknown;
  solution?: unknown;
  summary?: unknown;
  tags?: unknown;
  title?: unknown;
  whatILearned?: unknown;
};

type RawReference = {
  label?: unknown;
  url?: unknown;
};

type RawCaseStudyLink = {
  href?: unknown;
  label?: unknown;
};

type RawCaseStudyTag = {
  label?: unknown;
};

export type SiteNavigationItem = {
  href: string;
  label: string;
};

export type SiteArticleSummary = {
  excerpt: string;
  href: string;
  title: string;
  topic: string;
};

export type SiteCaseStudySummary = {
  href: string;
  summary: string;
  title: string;
};

export type SiteArticle = {
  content: unknown;
  excerpt: string;
  publishedAt?: string;
  references?: Array<{ label: string; url: string }>;
  title: string;
  topic: string;
};

export type SiteCaseStudy = {
  background: string;
  content: unknown;
  links?: Array<{ label: string; href: string }>;
  problem: string;
  process: string;
  results: string;
  summary: string;
  solution: string;
  tags?: Array<{ label: string }>;
  title: string;
  whatILearned: string;
};

export type SiteModel = {
  articles: SiteArticleSummary[];
  caseStudies: SiteCaseStudySummary[];
  homePage: HomePageContent;
  navigation: SiteNavigationItem[];
  settings: {
    siteDescription: string;
    siteSubtitle?: string;
    siteTitle: string;
  };
  topics: string[];
};

function normalizeNavigation(items: unknown): SiteNavigationItem[] {
  if (!Array.isArray(items)) {
    return [
      { href: "/", label: "Home" },
      { href: "/writing", label: "Writing" },
      { href: "/case-studies", label: "Case studies" },
    ];
  }

  const normalized = items.flatMap((item) => {
    const navigationItem = item as RawNavigationItem | null | undefined;

    if (!navigationItem?.href || !navigationItem?.label) {
      return [];
    }

    return [
      {
        href: String(navigationItem.href),
        label: String(navigationItem.label),
      },
    ];
  });

  return normalized.length > 0
    ? normalized
    : [
        { href: "/", label: "Home" },
        { href: "/writing", label: "Writing" },
        { href: "/case-studies", label: "Case studies" },
      ];
}

function mapArticleSummary(article: RawArticleDoc): SiteArticleSummary {
  return {
    href: `/writing/${encodeURIComponent(String(article.topic ?? ""))}/${encodeURIComponent(String(article.slug ?? ""))}`,
    title: String(article.title ?? ""),
    excerpt: String(article.excerpt ?? ""),
    topic: String(article.topic ?? ""),
  };
}

function mapCaseStudySummary(caseStudy: RawCaseStudyDoc): SiteCaseStudySummary {
  return {
    href: `/case-studies/${encodeURIComponent(String(caseStudy.slug ?? ""))}`,
    title: String(caseStudy.title ?? ""),
    summary: String(caseStudy.summary ?? ""),
  };
}

export function getFallbackSiteModel(): SiteModel {
  return {
    articles: [],
    caseStudies: [],
    homePage: getDefaultHomePage(),
    navigation: [
      { href: "/", label: "Home" },
      { href: "/writing", label: "Writing" },
      { href: "/case-studies", label: "Case studies" },
    ],
    settings: {
      siteDescription: "A minimal dark CMS-backed site.",
      siteSubtitle: undefined,
      siteTitle: "Pro Site CMS",
    },
    topics: [],
  };
}

let payloadInstance: typeof payload | null = null;

async function getPayloadInstance() {
  if (payloadInstance) {
    return payloadInstance;
  }

  payloadInstance = await payload.init({
    config: await configPromise,
  });

  return payloadInstance;
}

export async function getSiteModel() {
  try {
    const instance = await getPayloadInstance();

    const [settings, homePage, articlesResponse, caseStudiesResponse] = await Promise.all(
      [
        instance.findGlobal({
          slug: "site-settings",
          overrideAccess: true,
        }),
        instance.findGlobal({
          slug: "home-page",
          overrideAccess: true,
        }),
        instance.find({
          collection: "articles",
          limit: 50,
          sort: "-publishedAt",
          overrideAccess: true,
        }),
        instance.find({
          collection: "case-studies",
          limit: 50,
          sort: "-createdAt",
          overrideAccess: true,
        }),
      ],
    );

    const settingsData = settings as RawSiteSettings | null | undefined;
    const articleDocs = Array.isArray(articlesResponse.docs)
      ? (articlesResponse.docs as RawArticleDoc[])
      : [];
    const caseStudyDocs = Array.isArray(caseStudiesResponse.docs)
      ? (caseStudiesResponse.docs as RawCaseStudyDoc[])
      : [];

    // Extract unique topics from articles
    const topics = Array.from(
      new Set(
        articleDocs
          .map((article) => String(article.topic ?? ""))
          .filter(Boolean),
      ),
    ).sort();

    return {
      settings: {
        siteTitle: String(settingsData?.siteTitle ?? "Pro Site CMS"),
        siteSubtitle:
          typeof settingsData?.siteSubtitle === "string" &&
          settingsData.siteSubtitle.trim().length > 0
            ? settingsData.siteSubtitle
            : undefined,
        siteDescription: String(
          settingsData?.siteDescription ?? "A minimal dark CMS-backed site.",
        ),
      },
      homePage: mapHomePageData(homePage),
      navigation: normalizeNavigation(settingsData?.navigation),
      articles: articleDocs.map(mapArticleSummary),
      caseStudies: caseStudyDocs.map(mapCaseStudySummary),
      topics,
    };
  } catch (error) {
    console.error("Failed to load Payload site model", error);
    return getFallbackSiteModel();
  }
}

export async function getArticlesByTopic(
  topic: string,
): Promise<SiteArticleSummary[]> {
  try {
    const instance = await getPayloadInstance();

    const response = await instance.find({
      collection: "articles",
      where: {
        topic: {
          equals: topic,
        },
      },
      limit: 50,
      sort: "-publishedAt",
      overrideAccess: true,
    });

    const docs = Array.isArray(response.docs)
      ? (response.docs as RawArticleDoc[])
      : [];

    return docs.map(mapArticleSummary);
  } catch (error) {
    console.error(`Failed to load articles for topic ${topic}`, error);
    return [];
  }
}

export async function getArticleBySlug(
  topic: string,
  slug: string,
): Promise<SiteArticle | null> {
  try {
    const instance = await getPayloadInstance();

    const response = await instance.find({
      collection: "articles",
      where: {
        topic: {
          equals: topic,
        },
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    const doc = response.docs?.[0] as RawArticleDoc | undefined;
    if (!doc) return null;

    return {
      title: String(doc.title ?? ""),
      topic: String(doc.topic ?? ""),
      excerpt: String(doc.excerpt ?? ""),
      content: doc.content,
      publishedAt:
        typeof doc.publishedAt === "string" ? doc.publishedAt : undefined,
      references: Array.isArray(doc.references)
        ? doc.references.flatMap((reference) =>
            (() => {
              const item = reference as RawReference | null | undefined;

              return item?.label && item?.url
                ? [{ label: String(item.label), url: String(item.url) }]
                : [];
            })(),
          )
        : [],
    };
  } catch (error) {
    console.error(`Failed to load article ${topic}/${slug}`, error);
    return null;
  }
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<SiteCaseStudy | null> {
  try {
    const instance = await getPayloadInstance();

    const response = await instance.find({
      collection: "case-studies",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    const doc = response.docs?.[0] as RawCaseStudyDoc | undefined;
    if (!doc) return null;

    return {
      background: String(doc.background ?? ""),
      title: String(doc.title ?? ""),
      summary: String(doc.summary ?? ""),
      content: doc.content,
      problem: String(doc.problem ?? ""),
      process: String(doc.process ?? ""),
      results: String(doc.results ?? ""),
      solution: String(doc.solution ?? ""),
      links: Array.isArray(doc.links)
        ? doc.links.flatMap((link) =>
            (() => {
              const item = link as RawCaseStudyLink | null | undefined;

              return item?.label && item?.href
                ? [{ label: String(item.label), href: String(item.href) }]
                : [];
            })(),
          )
        : [],
      whatILearned: String(doc.whatILearned ?? ""),
      tags: Array.isArray(doc.tags)
        ? doc.tags.flatMap((tag) =>
            (() => {
              const item = tag as RawCaseStudyTag | null | undefined;

              return item?.label
                ? [{ label: String(item.label) }]
                : [];
            })(),
          )
        : [],
    };
  } catch (error) {
    console.error(`Failed to load case study ${slug}`, error);
    return null;
  }
}
