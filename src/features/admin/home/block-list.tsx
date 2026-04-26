"use client";

import type { HomeBlock } from "@/lib/content/schema";

export function BlockList({
  blocks,
  onAddBlock,
  onMoveDown,
  onMoveUp,
  onRemoveBlock,
  onSelectBlock,
  onToggleVisible,
  selectedBlockId,
}: {
  blocks: HomeBlock[];
  onAddBlock: (type: HomeBlock["type"]) => void;
  onMoveDown: (id: string) => void;
  onMoveUp: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onSelectBlock: (id: string) => void;
  onToggleVisible: (id: string) => void;
  selectedBlockId: string | null;
}) {
  return (
    <div className="list-stack">
      <div className="admin-panel">
        <h2 className="content-card-title">Blocks</h2>
        <div className="admin-grid">
          {[
            "hero",
            "richText",
            "quote",
            "links",
            "featuredArticles",
            "featuredCaseStudies",
            "timeline",
            "contactCta",
            "image",
            "textBox",
          ].map((type) => (
            <button
              className="button-secondary"
              key={type}
              onClick={() => onAddBlock(type as HomeBlock["type"])}
              type="button"
            >
              + {type}
            </button>
          ))}
        </div>
      </div>

      <div className="item-list">
        {blocks.map((block, index) => (
          <div
            className={`item-card ${selectedBlockId === block.id ? "item-card-active" : ""}`}
            key={block.id}
          >
            <button onClick={() => onSelectBlock(block.id)} type="button">
              <strong>{block.type}</strong>
            </button>
            <div className="meta-row">
              <span>{block.visible ? "Visible" : "Hidden"}</span>
              <span>#{index + 1}</span>
            </div>
            <div className="meta-row">
              <button className="button-secondary" onClick={() => onMoveUp(block.id)} type="button">
                Up
              </button>
              <button className="button-secondary" onClick={() => onMoveDown(block.id)} type="button">
                Down
              </button>
              <button
                className="button-secondary"
                onClick={() => onToggleVisible(block.id)}
                type="button"
              >
                {block.visible ? "Hide" : "Show"}
              </button>
              <button className="button-danger" onClick={() => onRemoveBlock(block.id)} type="button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
