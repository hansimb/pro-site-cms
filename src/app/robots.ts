import type { MetadataRoute } from "next";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteModel();
  const siteUrl = site.settings.seo.siteUrl || "https://imberg.dev";

  return {
    rules: {
      allow: "/",
      disallow: site.settings.seo.noIndex ? "/" : undefined,
      userAgent: "*",
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
