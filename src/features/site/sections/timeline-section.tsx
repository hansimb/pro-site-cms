import type { HomeBlock } from "@/lib/content/schema";

type TimelineBlock = Extract<HomeBlock, { type: "timeline" }>;

export function TimelineSection({ block }: { block: TimelineBlock }) {
  return (
    <section className="content-card section-stack">
      <h2 className="content-card-title">{block.title}</h2>
      <div className="content-grid">
        {block.items.map((item, index) => (
          <article className="hero-card" key={`${block.id}-${index}`}>
            <div className="eyebrow">{item.label}</div>
            <h3>{item.title}</h3>
            {item.period ? <p>{item.period}</p> : null}
            {item.description ? <p>{item.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
