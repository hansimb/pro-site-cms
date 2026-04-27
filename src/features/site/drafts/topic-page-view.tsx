"use client";

import Link from "next/link";
import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { WritingTopic } from "@/lib/content/schema";
import { getVisibleTopics } from "@/lib/content/visibility";
import { useDraftSectionValue } from "./use-draft-section-value";

export function TopicPageView({
  initialArticles,
  initialTopics,
  topic,
}: {
  initialArticles: ParsedArticle[];
  initialTopics: WritingTopic[];
  topic: string;
}) {
  const writing = useDraftSectionValue("writing", {
    articles: initialArticles,
    topics: initialTopics,
  });
  const publishedArticles = writing.articles.filter((article) => article.published);
  const visibleTopics = getVisibleTopics(writing.topics, publishedArticles);
  const currentTopic = visibleTopics.find((entry) => entry.slug === topic);
  const topicArticles = publishedArticles.filter((article) => article.topic === topic);

  if (!currentTopic) {
    return <div className="empty-state">This topic is not available yet.</div>;
  }

  return (
    <main className="page-stack">
      <header className="page-header">
        <div className="eyebrow">Topic</div>
        <h1 className="page-title">{currentTopic.title}</h1>
        <p>{currentTopic.description}</p>
      </header>

      <div className="article-grid">
        {topicArticles.map((article) => (
          <Link
            className="article-card"
            href={`/writing/${article.topic}/${article.slug}`}
            key={article.slug}
          >
            <div className="meta-row">
              <span>{article.publishedAt}</span>
              {article.featured ? <span>Featured</span> : null}
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
