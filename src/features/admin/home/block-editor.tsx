"use client";

import { useMemo, useState } from "react";
import type { HomeBlock, HomeDocument } from "@/lib/content/schema";
import { BlockFormSwitch } from "./block-form-switch";
import { BlockList } from "./block-list";

function createBlock(type: HomeBlock["type"]): HomeBlock {
  const id = `${type}-${crypto.randomUUID()}`;

  switch (type) {
    case "hero":
      return {
        id,
        type,
        visible: true,
        eyebrow: "New hero",
        heading: "Add a clear professional heading.",
        body: "Write a concise introduction.",
        primaryLink: { href: "/writing", label: "Read writing" },
        secondaryLink: { href: "/case-studies", label: "View work" },
      };
    case "richText":
      return { id, type, visible: true, body: "Add a section body.", title: "Rich text section" };
    case "quote":
      return { id, type, visible: true, quote: "Add a quotation.", attribution: "" };
    case "links":
      return { id, type, visible: true, title: "Links", items: [] };
    case "featuredArticles":
      return { id, type, visible: true, title: "Featured writing", intro: "", limit: 3 };
    case "featuredCaseStudies":
      return { id, type, visible: true, title: "Featured case studies", intro: "", limit: 3 };
    case "timeline":
      return { id, type, visible: true, title: "Timeline", items: [] };
    case "contactCta":
      return {
        id,
        type,
        visible: true,
        title: "Get in touch",
        body: "Add a contact call to action.",
        link: { href: "mailto:hello@example.com", label: "Email me" },
      };
    case "image":
      return { id, type, visible: true, src: "/uploads/placeholder.jpg", alt: "Placeholder image", caption: "" };
    case "textBox":
      return { id, type, visible: true, title: "Text box", body: "Add a supporting note.", tone: "default" };
  }
}

function moveItem<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
  const currentIndex = items.findIndex((item) => item.id === id);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
  return next;
}

export function BlockEditor({ initialDocument }: { initialDocument: HomeDocument }) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState(initialDocument.blocks[0]?.id ?? null);
  const [status, setStatus] = useState("Idle");

  const selectedBlock = useMemo(
    () => document.blocks.find((block) => block.id === selectedBlockId) ?? null,
    [document.blocks, selectedBlockId],
  );

  function updateBlock(nextBlock: HomeBlock) {
    setDocument((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === nextBlock.id ? nextBlock : block)),
    }));
  }

  async function saveDocument() {
    setStatus("Saving...");
    const response = await fetch("/api/admin/home", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(document),
    });

    setStatus(response.ok ? "Saved." : "Save failed.");
  }

  return (
    <div className="split-layout">
      <BlockList
        blocks={document.blocks}
        onAddBlock={(type) => {
          const nextBlock = createBlock(type);
          setDocument((current) => ({ ...current, blocks: [...current.blocks, nextBlock] }));
          setSelectedBlockId(nextBlock.id);
        }}
        onMoveDown={(id) => setDocument((current) => ({ ...current, blocks: moveItem(current.blocks, id, 1) }))}
        onMoveUp={(id) => setDocument((current) => ({ ...current, blocks: moveItem(current.blocks, id, -1) }))}
        onRemoveBlock={(id) =>
          setDocument((current) => ({
            ...current,
            blocks: current.blocks.filter((block) => block.id !== id),
          }))
        }
        onSelectBlock={setSelectedBlockId}
        onToggleVisible={(id) =>
          setDocument((current) => ({
            ...current,
            blocks: current.blocks.map((block) =>
              block.id === id ? { ...block, visible: !block.visible } : block,
            ),
          }))
        }
        selectedBlockId={selectedBlockId}
      />

      <section className="admin-panel">
        <div className="meta-row">
          <h2 className="content-card-title">Edit block</h2>
          <span className="status-text">{status}</span>
        </div>
        {selectedBlock ? (
          <>
            <BlockFormSwitch block={selectedBlock} onChange={updateBlock} />
            <div className="meta-row">
              <button className="button-primary" onClick={saveDocument} type="button">
                Save home page
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">Select a block from the left to edit it.</div>
        )}
      </section>
    </div>
  );
}
