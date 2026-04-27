"use client";

import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { CaseStudy, HomeDocument } from "@/lib/content/schema";
import { renderHomeBlock } from "@/features/site/sections/section-renderer";
import { useDraftSectionValue } from "./use-draft-section-value";

export function HomePageView({
  initialArticles,
  initialCaseStudies,
  initialHome,
}: {
  initialArticles: ParsedArticle[];
  initialCaseStudies: CaseStudy[];
  initialHome: HomeDocument;
}) {
  const home = useDraftSectionValue("home", initialHome);
  const caseStudies = useDraftSectionValue("caseStudies", initialCaseStudies);
  const writing = useDraftSectionValue("writing", { articles: initialArticles, topics: [] });
  const publishedArticles = writing.articles.filter((article) => article.published);
  const publishedCaseStudies = caseStudies.filter((caseStudy) => caseStudy.published);

  return (
    <main className="page-stack">
      {home.blocks
        .filter((block) => block.visible)
        .map((block) => renderHomeBlock(block, publishedArticles, publishedCaseStudies))}
    </main>
  );
}
