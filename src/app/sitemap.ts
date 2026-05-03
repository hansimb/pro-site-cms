import type { MetadataRoute } from "next";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteModel();
  const baseUrl = (site.settings.seo.siteUrl || "https://imberg.dev").replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
    },
    {
      url: `${baseUrl}/writing`,
    },
    {
      url: `${baseUrl}/case-studies`,
    },
    ...site.topics.map((topic) => ({
      url: `${baseUrl}/writing/${encodeURIComponent(topic)}`,
    })),
  ];

  const articleRoutes = site.articles.map((article) => ({
    url: `${baseUrl}${article.href}`,
  }));

  const caseStudyRoutes = site.caseStudies.map((caseStudy) => ({
    url: `${baseUrl}${caseStudy.href}`,
  }));

  return [...staticRoutes, ...articleRoutes, ...caseStudyRoutes];
}
