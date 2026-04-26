import type { HomeBlock } from "@/lib/content/schema";

type QuoteBlock = Extract<HomeBlock, { type: "quote" }>;

export function QuoteSection({ block }: { block: QuoteBlock }) {
  return (
    <section className="content-card section-stack">
      <blockquote className="prose">
        <p>{block.quote}</p>
      </blockquote>
      {block.attribution ? <p>{block.attribution}</p> : null}
    </section>
  );
}
