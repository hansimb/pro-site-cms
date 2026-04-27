"use client";

import { useMemo, useState } from "react";
import { confirmDelete } from "@/features/admin/shared/delete-confirm";
import { useAdminAction } from "@/features/admin/shared/use-admin-action";
import { readDraftSection, writeDraftSection } from "@/lib/content/draft-storage";
import type { ArticleDocument, WritingTopic } from "@/lib/content/schema";
import { ArticleList } from "./article-list";
import { TopicManager } from "./topic-manager";

function createTopic(): WritingTopic {
  const id = crypto.randomUUID().slice(0, 8);
  return {
    description: "Add a short topic description.",
    published: true,
    slug: `topic-${id}`,
    title: "New topic",
  };
}

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
  editMode,
  initialArticles,
  initialTopics,
}: {
  editMode: "LOCAL" | "GITHUB";
  initialArticles: ArticleDocument[];
  initialTopics: WritingTopic[];
}) {
  const startingDraft =
    editMode === "GITHUB"
      ? readDraftSection<{ articles: ArticleDocument[]; topics: WritingTopic[] }>("writing")
      : null;
  const [articles, setArticles] = useState(startingDraft?.articles ?? initialArticles);
  const [topics, setTopics] = useState(startingDraft?.topics ?? initialTopics);
  const [selectedSlug, setSelectedSlug] = useState(
    startingDraft?.articles[0]?.slug ?? initialArticles[0]?.slug ?? null,
  );
  const action = useAdminAction("Idle");

  const selectedArticle = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) ?? null,
    [articles, selectedSlug],
  );

  function updateArticle(nextArticle: ArticleDocument) {
    setArticles((current) =>
      current.map((article) => (article.slug === nextArticle.slug ? nextArticle : article)),
    );
  }

  async function saveWritingDraft(label: string) {
    await action.run(async () => {
      writeDraftSection("writing", { articles, topics });
    }, {
      pending: `Saving ${label} draft...`,
      success: `${label} draft saved.`,
      error: `${label} draft save failed.`,
    });
  }

  async function saveTopics() {
    if (editMode === "GITHUB") {
      await saveWritingDraft("topic");
      return;
    }

    await action.run(async () => {
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

      if (!response.ok) {
        throw new Error("Topic save failed");
      }
    }, {
      pending: "Saving topics...",
      success: "Topics saved.",
      error: "Topic save failed.",
    });
  }

  async function saveArticle() {
    if (!selectedArticle) {
      return;
    }

    if (editMode === "GITHUB") {
      await saveWritingDraft("article");
      return;
    }

    await action.run(async () => {
      const topicResponse = await fetch("/api/admin/writing", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          kind: "topics-save",
          topics,
        }),
      });

      if (!topicResponse.ok) {
        throw new Error("Topic save failed");
      }

      const response = await fetch("/api/admin/writing", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          article: selectedArticle,
          kind: "article-save",
        }),
      });

      if (!response.ok) {
        throw new Error("Article save failed");
      }
    }, {
      pending: "Saving article...",
      success: "Article saved.",
      error: "Article save failed.",
    });
  }

  async function deleteArticle() {
    if (!selectedArticle || !confirmDelete("Delete this article?")) {
      return;
    }

    if (editMode === "GITHUB") {
      const remaining = articles.filter((article) => article.slug !== selectedArticle.slug);
      setArticles(remaining);
      setSelectedSlug(remaining[0]?.slug ?? null);
      action.reset("Article removed from draft.");
      return;
    }

    await action.run(async () => {
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
        throw new Error("Delete failed");
      }

      const remaining = articles.filter((article) => article.slug !== selectedArticle.slug);
      setArticles(remaining);
      setSelectedSlug(remaining[0]?.slug ?? null);
    }, {
      pending: "Deleting article...",
      success: "Article deleted.",
      error: "Delete failed.",
    });
  }

  return (
    <div className="admin-page">
      <TopicManager
        onAdd={() => setTopics((current) => [...current, createTopic()])}
        onDelete={(slug) => {
          if (!confirmDelete("Delete this topic and its articles?")) {
            return;
          }

          const nextTopics = topics.filter((topic) => topic.slug !== slug);
          const nextArticles = articles.filter((article) => article.topic !== slug);
          setTopics(nextTopics);
          setArticles(nextArticles);
          setSelectedSlug(nextArticles[0]?.slug ?? null);
          action.reset("Topic removed.");
        }}
        onSave={saveTopics}
        topics={topics}
        updateTopics={setTopics}
      />

      <div className="split-layout">
        <ArticleList
          articles={articles}
          onAdd={() => {
            const defaultTopic = topics[0]?.slug ?? createTopic().slug;

            if (topics.length === 0) {
              setTopics([{
                description: "Add a short topic description.",
                published: true,
                slug: defaultTopic,
                title: "New topic",
              }]);
            }

            const article: ArticleDocument = {
              title: "New article",
              slug: `article-${crypto.randomUUID().slice(0, 8)}`,
              topic: defaultTopic,
              excerpt: "Add a concise excerpt.",
              publishedAt: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 10),
              published: false,
              featured: false,
              references: [],
              body: "Write the first draft here.",
            };
            setArticles((current) => [...current, article]);
            setSelectedSlug(article.slug);
            action.reset("Article added.");
          }}
          onSelect={setSelectedSlug}
          selectedSlug={selectedSlug}
        />

        <section className="admin-panel">
          <div className="meta-row">
            <h2 className="content-card-title">Edit article</h2>
            <span className="status-text">{action.message}</span>
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
                <button
                  className="button-primary"
                  data-status={action.state}
                  onClick={saveArticle}
                  type="button"
                >
                  {editMode === "GITHUB" ? "Save draft" : "Save article"}
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
