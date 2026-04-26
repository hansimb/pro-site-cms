import Link from "next/link";
import type { HomeBlock } from "@/lib/content/schema";

type ContactCtaBlock = Extract<HomeBlock, { type: "contactCta" }>;

export function ContactCtaSection({ block }: { block: ContactCtaBlock }) {
  return (
    <section className="content-card section-stack">
      <h2 className="content-card-title">{block.title}</h2>
      <p>{block.body}</p>
      <div>
        <Link className="accent-link" href={block.link.href}>
          {block.link.label}
        </Link>
      </div>
    </section>
  );
}
