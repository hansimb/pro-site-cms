"use client";

import type { ArticleDocument } from "@/lib/content/schema";

export function ArticleList({
  articles,
  onAdd,
  onSelect,
  selectedSlug,
}: {
  articles: ArticleDocument[];
  onAdd: () => void;
  onSelect: (slug: string) => void;
  selectedSlug: string | null;
}) {
  return (
    <div className="list-stack">
      <div className="admin-panel">
        <h2 className="content-card-title">Articles</h2>
        <button className="button-primary" onClick={onAdd} type="button">
          + Add article
        </button>
      </div>
      <div className="item-list">
        {articles.map((article) => (
          <button
            className={`item-card ${selectedSlug === article.slug ? "item-card-active" : ""}`}
            key={article.slug}
            onClick={() => onSelect(article.slug)}
            type="button"
          >
            <strong>{article.title}</strong>
            <span>{article.topic}</span>
            <div className="meta-row">
              <span>{article.published ? "Published" : "Draft"}</span>
              {article.featured ? <span>Featured</span> : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
