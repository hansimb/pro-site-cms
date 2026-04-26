import type { HomeBlock } from "@/lib/content/schema";

type TextBoxBlock = Extract<HomeBlock, { type: "textBox" }>;

export function TextBoxSection({ block }: { block: TextBoxBlock }) {
  return (
    <section className="content-card section-stack">
      {block.title ? <h2 className="content-card-title">{block.title}</h2> : null}
      <p style={{ whiteSpace: "pre-line" }}>{block.body}</p>
    </section>
  );
}
