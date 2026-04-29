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

export type SiteModel = {
  articles: SiteArticleSummary[];
  caseStudies: SiteCaseStudySummary[];
  navigation: SiteNavigationItem[];
  settings: {
    siteDescription: string;
    siteTitle: string;
  };
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
  };
}

export async function getSiteModel() {
  return getFallbackSiteModel();
}
