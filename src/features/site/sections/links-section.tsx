import Link from "next/link";
import type { HomeBlock } from "@/lib/content/schema";

type LinksBlock = Extract<HomeBlock, { type: "links" }>;

export function LinksSection({ block }: { block: LinksBlock }) {
  return (
    <section className="content-card section-stack">
      <h2 className="content-card-title">{block.title}</h2>
      <div className="link-list">
        {block.items.map((item) => (
          <Link className="link-item" href={item.href} key={`${block.id}-${item.href}`}>
            <span>{item.label}</span>
            <span>Open</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
