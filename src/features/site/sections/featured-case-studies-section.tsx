import Link from "next/link";
import type { CaseStudy, HomeBlock } from "@/lib/content/schema";

type FeaturedCaseStudiesBlock = Extract<HomeBlock, { type: "featuredCaseStudies" }>;

export function FeaturedCaseStudiesSection({
  block,
  caseStudies,
}: {
  block: FeaturedCaseStudiesBlock;
  caseStudies: CaseStudy[];
}) {
  return (
    <section className="content-card section-stack">
      <h2 className="content-card-title">{block.title}</h2>
      {block.intro ? <p>{block.intro}</p> : null}
      <div className="case-grid">
        {caseStudies.slice(0, block.limit).map((caseStudy) => (
          <article className="case-card" key={caseStudy.id}>
            <div className="meta-row card-meta-row">
              {caseStudy.tags.map((tag) => (
                <span key={`${caseStudy.id}-${tag}`}>{tag}</span>
              ))}
            </div>
            <h3>{caseStudy.title}</h3>
            <p>{caseStudy.summary}</p>
            <div className="meta-row card-meta-row">
              {caseStudy.links.map((link) => (
                <Link className="accent-link" href={link.href} key={`${caseStudy.id}-${link.href}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
