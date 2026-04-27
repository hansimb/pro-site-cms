"use client";

import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { WritingTopic } from "@/lib/content/schema";
import { TopicGrid } from "@/features/site/writing/topic-grid";
import { getVisibleTopics } from "@/lib/content/visibility";
import { useDraftSectionValue } from "./use-draft-section-value";

export function WritingPageView({
  initialArticles,
  initialTopics,
}: {
  initialArticles: ParsedArticle[];
  initialTopics: WritingTopic[];
}) {
  const writing = useDraftSectionValue("writing", {
    articles: initialArticles,
    topics: initialTopics,
  });
  const visibleTopics = getVisibleTopics(
    writing.topics,
    writing.articles.filter((article) => article.published),
  );

  return (
    <main className="page-stack">
      <header className="page-header">
        <div className="eyebrow">Writing</div>
        <h1 className="page-title">Analytical notes, essays, and articles.</h1>
        <p>
          Topic-driven writing with an analytical, source-conscious structure. Topics
          appear only when they contain published work.
        </p>
      </header>

      {visibleTopics.length > 0 ? (
        <TopicGrid topics={visibleTopics} />
      ) : (
        <div className="empty-state">No published topics yet.</div>
      )}
    </main>
  );
}
