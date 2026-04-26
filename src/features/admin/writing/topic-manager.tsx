"use client";

import type { WritingTopic } from "@/lib/content/schema";

export function TopicManager({
  onSave,
  topics,
  updateTopics,
}: {
  onSave: () => Promise<void>;
  topics: WritingTopic[];
  updateTopics: (topics: WritingTopic[]) => void;
}) {
  return (
    <section className="admin-panel section-stack">
      <div className="meta-row">
        <h2 className="content-card-title">Topics</h2>
        <button className="button-primary" onClick={onSave} type="button">
          Save topics
        </button>
      </div>
      {topics.map((topic, index) => (
        <div className="admin-grid" key={topic.slug}>
          <div className="field">
            <label htmlFor={`topic-slug-${topic.slug}`}>Slug</label>
            <input
              id={`topic-slug-${topic.slug}`}
              onChange={(event) => {
                const next = [...topics];
                next[index] = { ...topic, slug: event.target.value };
                updateTopics(next);
              }}
              value={topic.slug}
            />
          </div>
          <div className="field">
            <label htmlFor={`topic-title-${topic.slug}`}>Title</label>
            <input
              id={`topic-title-${topic.slug}`}
              onChange={(event) => {
                const next = [...topics];
                next[index] = { ...topic, title: event.target.value };
                updateTopics(next);
              }}
              value={topic.title}
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor={`topic-description-${topic.slug}`}>Description</label>
            <textarea
              id={`topic-description-${topic.slug}`}
              onChange={(event) => {
                const next = [...topics];
                next[index] = { ...topic, description: event.target.value };
                updateTopics(next);
              }}
              value={topic.description}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
