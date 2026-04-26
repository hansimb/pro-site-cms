import Link from "next/link";
import type { HomeBlock } from "@/lib/content/schema";

type HeroBlock = Extract<HomeBlock, { type: "hero" }>;

export function HeroSection({ block }: { block: HeroBlock }) {
  return (
    <section className="site-hero">
      <div className="eyebrow">{block.eyebrow}</div>
      <h1 className="hero-title">{block.heading}</h1>
      <p className="hero-copy">{block.body}</p>

      {(block.primaryLink || block.secondaryLink) ? (
        <div className="meta-row">
          {block.primaryLink ? (
            <Link className="accent-link" href={block.primaryLink.href}>
              {block.primaryLink.label}
            </Link>
          ) : null}
          {block.secondaryLink ? <Link href={block.secondaryLink.href}>{block.secondaryLink.label}</Link> : null}
        </div>
      ) : null}
    </section>
  );
}
