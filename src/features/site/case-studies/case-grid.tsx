import Link from "next/link";
import type { CaseStudy } from "@/lib/content/schema";

export function CaseGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return (
    <div className="case-grid">
      {caseStudies.map((caseStudy) => (
        <article className="case-card" key={caseStudy.id}>
          <div className="meta-row">
            {caseStudy.tags.map((tag) => (
              <span key={`${caseStudy.id}-${tag}`}>{tag}</span>
            ))}
          </div>
          <h3>{caseStudy.title}</h3>
          <p>{caseStudy.summary}</p>
          <div className="case-card-body">
            <div className="case-field">
              <strong>Background</strong>
              <p>{caseStudy.background}</p>
            </div>
            <div className="case-field">
              <strong>Problem</strong>
              <p>{caseStudy.problem}</p>
            </div>
            <div className="case-field">
              <strong>Solution</strong>
              <p>{caseStudy.solution}</p>
            </div>
            <div className="case-field">
              <strong>Process</strong>
              <p>{caseStudy.process}</p>
            </div>
            <div className="case-field">
              <strong>Results</strong>
              <p>{caseStudy.results}</p>
            </div>
          </div>
          <div className="meta-row">
            {caseStudy.links.map((link) => (
              <Link className="accent-link" href={link.href} key={`${caseStudy.id}-${link.href}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
