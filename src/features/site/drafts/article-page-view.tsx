"use client";

import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import { ArticleView } from "@/features/site/writing/article-view";
import { useDraftSectionValue } from "./use-draft-section-value";

export function ArticlePageView({
  initialArticle,
  initialArticles,
  slug,
  topic,
}: {
  initialArticle: ParsedArticle | null;
  initialArticles: ParsedArticle[];
  slug: string;
  topic: string;
}) {
  const writing = useDraftSectionValue("writing", {
    articles: initialArticles,
    topics: [],
  });
  const article =
    writing.articles.find((entry) => entry.slug === slug && entry.topic === topic) ??
    initialArticle;

  if (!article || !article.published) {
    return <div className="empty-state">This article is not available yet.</div>;
  }

  return <ArticleView article={article} />;
}
