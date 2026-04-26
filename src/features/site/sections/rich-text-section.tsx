import type { HomeBlock } from "@/lib/content/schema";

type RichTextBlock = Extract<HomeBlock, { type: "richText" }>;

export function RichTextSection({ block }: { block: RichTextBlock }) {
  return (
    <section className="content-card section-stack">
      {block.title ? <h2 className="content-card-title">{block.title}</h2> : null}
      <p style={{ whiteSpace: "pre-line" }}>{block.body}</p>
    </section>
  );
}
