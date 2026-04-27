import type { ReactNode } from "react";
import {
  getNavigation,
  getPublishedArticles,
  getPublishedCaseStudies,
  getSiteSettings,
} from "@/lib/content/loaders";
import { SiteShell } from "@/features/site/drafts/site-shell";
import { ContentRefreshListener } from "@/features/site/drafts/content-refresh-listener";
import { getEditMode } from "@/lib/env";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [siteSettings, navigation, articles, caseStudies] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getPublishedArticles(),
    getPublishedCaseStudies(),
  ]);

  return (
    <>
      <SiteShell
        initialArticles={articles}
        initialCaseStudies={caseStudies}
        initialNavigation={navigation}
        initialSettings={siteSettings}
      >
        {children}
      </SiteShell>
      {getEditMode() === "LOCAL" ? <ContentRefreshListener /> : null}
    </>
  );
}
