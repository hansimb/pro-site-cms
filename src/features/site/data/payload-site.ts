import configPromise from "@payload-config";
import payload from "payload";
import {
  getDefaultHomePage,
  mapHomePageData,
  type HomePageContent,
} from "./home-page";
import {
  normalizeContactSettings,
  type SiteContactSettings,
} from "../contact";

type RawNavigationItem = {
  href?: unknown;
  label?: unknown;
};

type RawSiteSettings = {
  contact?: unknown;
  navigation?: unknown;
  seo?: unknown;
  siteDescription?: unknown;
  siteSubtitle?: unknown;
  siteTitle?: unknown;
};

type RawSiteSeo = {
  metaDescription?: unknown;
  metaTitle?: unknown;
  noIndex?: unknown;
  openGraphDescription?: unknown;
  openGraphTitle?: unknown;
  siteUrl?: unknown;
  twitterDescription?: unknown;
  twitterTitle?: unknown;
};

type RawArticleDoc = {
  canonicalUrl?: unknown;
  citationAuthors?: unknown;
  citationPublication?: unknown;
  citationTitle?: unknown;
  content?: unknown;
  excerpt?: unknown;
  keywords?: unknown;
  keywordsText?: unknown;
  publishedAt?: unknown;
  references?: unknown;
  seoDescription?: unknown;
  seoTitle?: unknown;
  slug?: unknown;
  title?: unknown;
  topic?: unknown;
  updatedAt?: unknown;
  _status?: unknown;
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
  accessedAt?: unknown;
  label?: unknown;
  publishedAt?: unknown;
  publisher?: unknown;
  url?: unknown;
};

type RawKeyword = {
  keyword?: unknown;
};

type RawMediaDoc = {
  alt?: unknown;
  filename?: unknown;
  height?: unknown;
  id?: unknown;
  mimeType?: unknown;
  url?: unknown;
  width?: unknown;
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
  keywords: string[];
  title: string;
  topic: string;
};

export type SiteCaseStudySummary = {
  href: string;
  summary: string;
  title: string;
};

export type SiteArticle = {
  canonicalUrl?: string;
  citationAuthors?: string;
  content: unknown;
  excerpt: string;
  keywords: string[];
  publishedAt?: string;
  references: Array<{
    accessedAt?: string;
    label: string;
    publishedAt?: string;
    publisher?: string;
    url: string;
  }>;
  seoDescription?: string;
  seoTitle?: string;
  title: string;
  topic: string;
  updatedAt?: string;
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
    contact: SiteContactSettings;
    seo: {
      metaDescription: string;
      metaTitle: string;
      noIndex: boolean;
      openGraphDescription: string;
      openGraphTitle: string;
      siteUrl: string;
      twitterDescription: string;
      twitterTitle: string;
    };
    siteDescription: string;
    siteSubtitle?: string;
    siteTitle: string;
  };
  topics: string[];
};

export function isPublishedArticleStatus(status: unknown) {
  return status === "published";
}

export function parseArticleKeywords(value: unknown) {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeMediaDoc(media: RawMediaDoc) {
  return {
    id:
      typeof media.id === "number" || typeof media.id === "string"
        ? media.id
        : "",
    alt: typeof media.alt === "string" ? media.alt : "",
    filename: typeof media.filename === "string" ? media.filename : "",
    mimeType: typeof media.mimeType === "string" ? media.mimeType : "",
    url: typeof media.url === "string" ? media.url : "",
    width: typeof media.width === "number" ? media.width : undefined,
    height: typeof media.height === "number" ? media.height : undefined,
  };
}

function collectLexicalUploadIds(value: unknown, ids = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectLexicalUploadIds(item, ids);
    }

    return ids;
  }

  if (!isRecord(value)) {
    return ids;
  }

  if (
    value.type === "upload" &&
    value.relationTo === "media" &&
    (typeof value.value === "number" || typeof value.value === "string")
  ) {
    ids.add(String(value.value));
  }

  for (const child of Object.values(value)) {
    collectLexicalUploadIds(child, ids);
  }

  return ids;
}

export function hydrateLexicalUploadNodes(content: unknown, mediaDocs: RawMediaDoc[]) {
  if (!content) {
    return content;
  }

  const mediaById = new Map(
    mediaDocs
      .map(normalizeMediaDoc)
      .filter((media) => String(media.id).length > 0)
      .map((media) => [String(media.id), media] as const),
  );

  const hydrate = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(hydrate);
    }

    if (!isRecord(value)) {
      return value;
    }

    const next: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(value)) {
      next[key] = hydrate(child);
    }

    if (
      next.type === "upload" &&
      next.relationTo === "media" &&
      (typeof next.value === "number" || typeof next.value === "string")
    ) {
      const hydratedMedia = mediaById.get(String(next.value));

      if (hydratedMedia) {
        next.value = hydratedMedia;
      }
    }

    return next;
  };

  return hydrate(content);
}

function normalizeSeoSettings(
  siteSettings: RawSiteSettings | null | undefined,
  siteTitle: string,
  siteDescription: string,
) {
  const seo = siteSettings?.seo as RawSiteSeo | null | undefined;

  return {
    metaTitle:
      typeof seo?.metaTitle === "string" && seo.metaTitle.trim().length > 0
        ? seo.metaTitle
        : siteTitle,
    metaDescription:
      typeof seo?.metaDescription === "string" &&
      seo.metaDescription.trim().length > 0
        ? seo.metaDescription
        : siteDescription,
    openGraphTitle:
      typeof seo?.openGraphTitle === "string" &&
      seo.openGraphTitle.trim().length > 0
        ? seo.openGraphTitle
        : siteTitle,
    openGraphDescription:
      typeof seo?.openGraphDescription === "string" &&
      seo.openGraphDescription.trim().length > 0
        ? seo.openGraphDescription
        : siteDescription,
    twitterTitle:
      typeof seo?.twitterTitle === "string" && seo.twitterTitle.trim().length > 0
        ? seo.twitterTitle
        : siteTitle,
    twitterDescription:
      typeof seo?.twitterDescription === "string" &&
      seo.twitterDescription.trim().length > 0
        ? seo.twitterDescription
        : siteDescription,
    siteUrl:
      typeof seo?.siteUrl === "string" && seo.siteUrl.trim().length > 0
        ? seo.siteUrl
        : "https://imberg.dev",
    noIndex: typeof seo?.noIndex === "boolean" ? seo.noIndex : false,
  };
}

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
  const parsedKeywords = parseArticleKeywords(article.keywordsText);

  return {
    href: `/writing/${encodeURIComponent(String(article.topic ?? ""))}/${encodeURIComponent(String(article.slug ?? ""))}`,
    title: String(article.title ?? ""),
    excerpt: String(article.excerpt ?? ""),
    keywords:
      parsedKeywords.length > 0
        ? parsedKeywords
        : Array.isArray(article.keywords)
          ? article.keywords.flatMap((item) => {
              const keyword = item as RawKeyword | null | undefined;

              return typeof keyword?.keyword === "string" &&
                keyword.keyword.trim().length > 0
                ? [keyword.keyword]
                : [];
            })
          : [],
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
      contact: {
        email: undefined,
        githubUrl: undefined,
        linkedinUrl: undefined,
      },
      siteDescription: "Software, systems, and business-aware development.",
      seo: {
        metaDescription:
          "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
        metaTitle: "imberg.dev",
        noIndex: false,
        openGraphDescription:
          "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
        openGraphTitle: "imberg.dev",
        siteUrl: "https://imberg.dev",
        twitterDescription:
          "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
        twitterTitle: "imberg.dev",
      },
      siteSubtitle: undefined,
      siteTitle: "imberg.dev",
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
    const publishedArticleDocs = articleDocs.filter((article) =>
      isPublishedArticleStatus(article._status),
    );
    const caseStudyDocs = Array.isArray(caseStudiesResponse.docs)
      ? (caseStudiesResponse.docs as RawCaseStudyDoc[])
      : [];

    // Extract unique topics from articles
    const topics = Array.from(
      new Set(
        articleDocs
          .filter((article) => isPublishedArticleStatus(article._status))
          .map((article) => String(article.topic ?? ""))
          .filter(Boolean),
      ),
    ).sort();

    const siteTitle = String(settingsData?.siteTitle ?? "imberg.dev");
    const siteDescription = String(
      settingsData?.siteDescription ??
        "Software, systems, and business-aware development.",
    );

    return {
      settings: {
        contact: normalizeContactSettings(
          (settingsData?.contact as Record<string, unknown> | null | undefined) ??
            {},
        ),
        siteTitle,
        siteSubtitle:
          typeof settingsData?.siteSubtitle === "string" &&
          settingsData.siteSubtitle.trim().length > 0
            ? settingsData.siteSubtitle
            : undefined,
        siteDescription,
        seo: normalizeSeoSettings(settingsData, siteTitle, siteDescription),
      },
      homePage: mapHomePageData(homePage),
      navigation: normalizeNavigation(settingsData?.navigation),
      articles: publishedArticleDocs.map(mapArticleSummary),
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

    return docs
      .filter((article) => isPublishedArticleStatus(article._status))
      .map(mapArticleSummary);
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
    if (!doc || !isPublishedArticleStatus(doc._status)) return null;

    const uploadIds = Array.from(collectLexicalUploadIds(doc.content));
    const mediaResponse =
      uploadIds.length > 0
        ? await instance.find({
            collection: "media",
            where: {
              id: {
                in: uploadIds,
              },
            },
            limit: uploadIds.length,
            overrideAccess: true,
          })
        : null;
    const mediaDocs = Array.isArray(mediaResponse?.docs)
      ? (mediaResponse.docs as RawMediaDoc[])
      : [];

    const parsedKeywords = parseArticleKeywords(doc.keywordsText);

    return {
      canonicalUrl:
        typeof doc.canonicalUrl === "string" && doc.canonicalUrl.trim().length > 0
          ? doc.canonicalUrl
          : undefined,
      citationAuthors:
        typeof doc.citationAuthors === "string" &&
        doc.citationAuthors.trim().length > 0
          ? doc.citationAuthors
          : undefined,
      title: String(doc.title ?? ""),
      topic: String(doc.topic ?? ""),
      excerpt: String(doc.excerpt ?? ""),
      content: hydrateLexicalUploadNodes(doc.content, mediaDocs),
      keywords:
        parsedKeywords.length > 0
          ? parsedKeywords
          : Array.isArray(doc.keywords)
            ? doc.keywords.flatMap((item) => {
                const keyword = item as RawKeyword | null | undefined;

                return typeof keyword?.keyword === "string" &&
                  keyword.keyword.trim().length > 0
                  ? [keyword.keyword]
                  : [];
              })
            : [],
      publishedAt:
        typeof doc.publishedAt === "string" ? doc.publishedAt : undefined,
      updatedAt:
        typeof doc.updatedAt === "string" ? doc.updatedAt : undefined,
      references: Array.isArray(doc.references)
        ? doc.references.flatMap((reference) =>
            (() => {
              const item = reference as RawReference | null | undefined;

              return item?.label && item?.url
                ? [
                    {
                      accessedAt:
                        typeof item.accessedAt === "string"
                          ? item.accessedAt
                          : undefined,
                      label: String(item.label),
                      publishedAt:
                        typeof item.publishedAt === "string"
                          ? item.publishedAt
                          : undefined,
                      publisher:
                        typeof item.publisher === "string" &&
                        item.publisher.trim().length > 0
                          ? item.publisher
                          : undefined,
                      url: String(item.url),
                    },
                  ]
                : [];
            })(),
          )
        : [],
      seoDescription:
        typeof doc.seoDescription === "string" &&
        doc.seoDescription.trim().length > 0
          ? doc.seoDescription
          : undefined,
      seoTitle:
        typeof doc.seoTitle === "string" && doc.seoTitle.trim().length > 0
          ? doc.seoTitle
          : undefined,
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
