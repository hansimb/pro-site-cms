"use client";

import { useMemo, useState } from "react";
import type { ArticleDocument, WritingTopic } from "@/lib/content/schema";
import { ArticleList } from "./article-list";
import { TopicManager } from "./topic-manager";

function parseReferences(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", url = ""] = line.split("|").map((part) => part.trim());
      return { label, url };
    });
}

function serializeReferences(items: { label: string; url: string }[]) {
  return items.map((item) => `${item.label} | ${item.url}`).join("\n");
}

export function WritingEditor({
  initialArticles,
  initialTopics,
}: {
  initialArticles: ArticleDocument[];
  initialTopics: WritingTopic[];
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [topics, setTopics] = useState(initialTopics);
  const [selectedSlug, setSelectedSlug] = useState(initialArticles[0]?.slug ?? null);
  const [status, setStatus] = useState("Idle");

  const selectedArticle = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) ?? null,
    [articles, selectedSlug],
  );

  function updateArticle(nextArticle: ArticleDocument) {
    setArticles((current) =>
      current.map((article) => (article.slug === nextArticle.slug ? nextArticle : article)),
    );
  }

  async function saveTopics() {
    setStatus("Saving topics...");
    const response = await fetch("/api/admin/writing", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "topics-save",
        topics,
      }),
    });

    setStatus(response.ok ? "Topics saved." : "Topic save failed.");
  }

  async function saveArticle() {
    if (!selectedArticle) {
      return;
    }

    setStatus("Saving article...");
    const response = await fetch("/api/admin/writing", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "article-save",
        article: selectedArticle,
      }),
    });

    setStatus(response.ok ? "Article saved." : "Article save failed.");
  }

  async function deleteArticle() {
    if (!selectedArticle) {
      return;
    }

    setStatus("Deleting article...");
    const response = await fetch("/api/admin/writing", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "article-delete",
        slug: selectedArticle.slug,
        topic: selectedArticle.topic,
      }),
    });

    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }

    const remaining = articles.filter((article) => article.slug !== selectedArticle.slug);
    setArticles(remaining);
    setSelectedSlug(remaining[0]?.slug ?? null);
    setStatus("Article deleted.");
  }

  return (
    <div className="admin-page">
      <TopicManager onSave={saveTopics} topics={topics} updateTopics={setTopics} />

      <div className="split-layout">
        <ArticleList
          articles={articles}
          onAdd={() => {
            const defaultTopic = topics[0]?.slug ?? "tech";
            const article: ArticleDocument = {
              title: "New article",
              slug: `article-${crypto.randomUUID().slice(0, 8)}`,
              topic: defaultTopic,
              excerpt: "",
              publishedAt: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 10),
              published: false,
              featured: false,
              references: [],
              body: "",
            };
            setArticles((current) => [...current, article]);
            setSelectedSlug(article.slug);
          }}
          onSelect={setSelectedSlug}
          selectedSlug={selectedSlug}
        />

        <section className="admin-panel">
          <div className="meta-row">
            <h2 className="content-card-title">Edit article</h2>
            <span className="status-text">{status}</span>
          </div>
          {selectedArticle ? (
            <div className="admin-form">
              <div className="field">
                <label htmlFor="article-title">Title</label>
                <input
                  id="article-title"
                  onChange={(event) =>
                    updateArticle({ ...selectedArticle, title: event.target.value })
                  }
                  value={selectedArticle.title}
                />
              </div>
              <div className="admin-grid">
                <div className="field">
                  <label htmlFor="article-slug">Slug</label>
                  <input
                    id="article-slug"
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, slug: event.target.value })
                    }
                    value={selectedArticle.slug}
                  />
                </div>
                <div className="field">
                  <label htmlFor="article-topic">Topic</label>
                  <select
                    id="article-topic"
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, topic: event.target.value })
                    }
                    value={selectedArticle.topic}
                  >
                    {topics.map((topic) => (
                      <option key={topic.slug} value={topic.slug}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="article-excerpt">Excerpt</label>
                <textarea
                  id="article-excerpt"
                  onChange={(event) =>
                    updateArticle({ ...selectedArticle, excerpt: event.target.value })
                  }
                  value={selectedArticle.excerpt}
                />
              </div>
              <div className="admin-grid">
                <div className="field">
                  <label htmlFor="article-published-at">Published at</label>
                  <input
                    id="article-published-at"
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, publishedAt: event.target.value })
                    }
                    value={selectedArticle.publishedAt}
                  />
                </div>
                <div className="field">
                  <label htmlFor="article-updated-at">Updated at</label>
                  <input
                    id="article-updated-at"
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, updatedAt: event.target.value })
                    }
                    value={selectedArticle.updatedAt}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="article-references">References, one per line: Label | URL</label>
                <textarea
                  id="article-references"
                  onChange={(event) =>
                    updateArticle({
                      ...selectedArticle,
                      references: parseReferences(event.target.value),
                    })
                  }
                  value={serializeReferences(selectedArticle.references)}
                />
              </div>
              <div className="field">
                <label htmlFor="article-body">Markdown body</label>
                <textarea
                  id="article-body"
                  onChange={(event) =>
                    updateArticle({ ...selectedArticle, body: event.target.value })
                  }
                  value={selectedArticle.body}
                />
              </div>
              <div className="meta-row">
                <label>
                  <input
                    checked={selectedArticle.published}
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, published: event.target.checked })
                    }
                    type="checkbox"
                  />{" "}
                  Published
                </label>
                <label>
                  <input
                    checked={selectedArticle.featured}
                    onChange={(event) =>
                      updateArticle({ ...selectedArticle, featured: event.target.checked })
                    }
                    type="checkbox"
                  />{" "}
                  Featured
                </label>
              </div>
              <div className="meta-row">
                <button className="button-primary" onClick={saveArticle} type="button">
                  Save article
                </button>
                <button className="button-danger" onClick={deleteArticle} type="button">
                  Delete article
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">Create or select an article to edit it.</div>
          )}
        </section>
      </div>
    </div>
  );
}
