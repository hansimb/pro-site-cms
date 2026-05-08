import type { Metadata } from "next";
import type {
  SiteArticle,
  SiteCaseStudy,
  SiteModel,
} from "./data/payload-site";

function trimToUndefined(value?: string) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getSiteUrl(site: SiteModel) {
  const raw = trimToUndefined(site.settings.seo.siteUrl) ?? "https://imberg.dev";

  try {
    return new URL(raw);
  } catch {
    return new URL("https://imberg.dev");
  }
}

export function buildArticleSocialImagePath(topic: string, slug: string) {
  return `/writing/${encodeURIComponent(topic)}/${encodeURIComponent(slug)}/opengraph-image`;
}

function buildMetadataBase(site: SiteModel) {
  const metaTitle = trimToUndefined(site.settings.seo.metaTitle) ?? site.settings.siteTitle;
  const metaDescription =
    trimToUndefined(site.settings.seo.metaDescription) ?? site.settings.siteDescription;
  const openGraphTitle =
    trimToUndefined(site.settings.seo.openGraphTitle) ?? metaTitle;
  const openGraphDescription =
    trimToUndefined(site.settings.seo.openGraphDescription) ?? metaDescription;
  const twitterTitle =
    trimToUndefined(site.settings.seo.twitterTitle) ?? openGraphTitle;
  const twitterDescription =
    trimToUndefined(site.settings.seo.twitterDescription) ?? openGraphDescription;

  return {
    metaDescription,
    metaTitle,
    openGraphDescription,
    openGraphTitle,
    twitterDescription,
    twitterTitle,
  };
}

export function buildSiteMetadata(site: SiteModel): Metadata {
  const siteUrl = getSiteUrl(site);
  const metadataBase = buildMetadataBase(site);

  return {
    metadataBase: siteUrl,
    title: {
      default: metadataBase.metaTitle,
      template: `%s | ${site.settings.siteTitle}`,
    },
    description: metadataBase.metaDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      description: metadataBase.openGraphDescription,
      images: ["/opengraph-image"],
      siteName: site.settings.siteTitle,
      title: metadataBase.openGraphTitle,
      type: "website",
      url: "/",
    },
    robots: {
      index: !site.settings.seo.noIndex,
      follow: !site.settings.seo.noIndex,
    },
    twitter: {
      card: "summary_large_image",
      description: metadataBase.twitterDescription,
      images: ["/twitter-image"],
      title: metadataBase.twitterTitle,
    },
  };
}

export function buildArticleMetadata(
  site: SiteModel,
  article: SiteArticle,
): Metadata {
  const title = trimToUndefined(article.seoTitle) ?? article.title;
  const description =
    trimToUndefined(article.seoDescription) ??
    trimToUndefined(article.excerpt) ??
    trimToUndefined(site.settings.seo.metaDescription) ??
    site.settings.siteDescription;

  return {
    title,
    description,
    alternates: article.canonicalUrl
      ? {
          canonical: article.canonicalUrl,
        }
      : undefined,
    openGraph: {
      description,
      title,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export function buildCaseStudyMetadata(
  site: SiteModel,
  caseStudy: SiteCaseStudy,
): Metadata {
  const description =
    trimToUndefined(caseStudy.summary) ??
    trimToUndefined(site.settings.seo.metaDescription) ??
    site.settings.siteDescription;

  return {
    title: caseStudy.title,
    description,
    openGraph: {
      description,
      title: caseStudy.title,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      description,
      title: caseStudy.title,
    },
  };
}

export function buildSimplePageMetadata(
  site: SiteModel,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      description,
      title,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}
