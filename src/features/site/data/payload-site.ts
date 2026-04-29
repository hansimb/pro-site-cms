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
  title: string;
  topic: string;
  excerpt: string;
  content: any;
  publishedAt?: string;
  references?: any[];
};

export type SiteCaseStudy = {
  title: string;
  summary: string;
  content: any;
  links?: Array<{ label: string; href: string }>;
  tags?: string[];
};

export type SiteModel = {
  articles: SiteArticleSummary[];
  caseStudies: SiteCaseStudySummary[];
  navigation: SiteNavigationItem[];
  settings: {
    siteDescription: string;
    siteTitle: string;
  };
  topics: string[];
};

export function getFallbackSiteModel(): SiteModel {
  return {
    articles: [],
    caseStudies: [],
    navigation: [
      { href: "/", label: "Home" },
      { href: "/writing", label: "Writing" },
      { href: "/case-studies", label: "Case studies" },
    ],
    settings: {
      siteDescription: "A minimal dark CMS-backed site.",
      siteTitle: "Pro Site CMS",
    },
    topics: [],
  };
}

import configPromise from "@payload-config";
import payload from "payload";

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

    const [settings, articlesResponse, caseStudiesResponse] = await Promise.all(
      [
        instance.findGlobal({
          slug: "site-settings",
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

    const articleDocs = Array.isArray(articlesResponse.docs)
      ? articlesResponse.docs
      : [];
    const caseStudyDocs = Array.isArray(caseStudiesResponse.docs)
      ? caseStudiesResponse.docs
      : [];

    // Extract unique topics from articles
    const topics = Array.from(
      new Set(articleDocs.map((article: any) => article.topic).filter(Boolean)),
    ).sort();

    return {
      settings: {
        siteTitle: settings?.siteTitle ?? "Pro Site CMS",
        siteDescription:
          settings?.siteDescription ?? "A minimal dark CMS-backed site.",
      },
      navigation:
        settings?.navigation?.length > 0
          ? settings.navigation.map(
              (item: { href: string; label: string }) => ({
                href: item.href,
                label: item.label,
              }),
            )
          : [
              { href: "/", label: "Home" },
              { href: "/writing", label: "Writing" },
              { href: "/case-studies", label: "Case studies" },
            ],
      articles: articleDocs.map((article: any) => ({
        href: `/writing/${encodeURIComponent(article.topic ?? "")}/${encodeURIComponent(article.slug ?? "")}`,
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        topic: article.topic ?? "",
      })),
      caseStudies: caseStudyDocs.map((caseStudy: any) => ({
        href: `/case-studies/${encodeURIComponent(caseStudy.slug ?? "")}`,
        title: caseStudy.title ?? "",
        summary: caseStudy.summary ?? "",
      })),
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

    const docs = Array.isArray(response.docs) ? response.docs : [];

    return docs.map((article: any) => ({
      href: `/writing/${encodeURIComponent(article.topic ?? "")}/${encodeURIComponent(article.slug ?? "")}`,
      title: article.title ?? "",
      excerpt: article.excerpt ?? "",
      topic: article.topic ?? "",
    }));
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

    const doc = response.docs?.[0];
    if (!doc) return null;

    return {
      title: doc.title ?? "",
      topic: doc.topic ?? "",
      excerpt: doc.excerpt ?? "",
      content: doc.content,
      publishedAt: doc.publishedAt,
      references: doc.references,
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

    const doc = response.docs?.[0];
    if (!doc) return null;

    return {
      title: doc.title ?? "",
      summary: doc.summary ?? "",
      content: doc.content,
      links: doc.links,
      tags: doc.tags,
    };
  } catch (error) {
    console.error(`Failed to load case study ${slug}`, error);
    return null;
  }
}
