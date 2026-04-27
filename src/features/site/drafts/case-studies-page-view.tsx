"use client";

import type { CaseStudy } from "@/lib/content/schema";
import { CaseGrid } from "@/features/site/case-studies/case-grid";
import { useDraftSectionValue } from "./use-draft-section-value";

export function CaseStudiesPageView({ initialCaseStudies }: { initialCaseStudies: CaseStudy[] }) {
  const caseStudies = useDraftSectionValue("caseStudies", initialCaseStudies).filter(
    (entry) => entry.published,
  );

  return (
    <main className="page-stack">
      <header className="page-header">
        <div className="eyebrow">Selected work</div>
        <h1 className="page-title">Case Studies</h1>
        <p>
          Compact, structured case studies with the same framing for background,
          problem, solution, process, results, and links.
        </p>
      </header>

      {caseStudies.length > 0 ? (
        <CaseGrid caseStudies={caseStudies} />
      ) : (
        <div className="empty-state">No published case studies yet.</div>
      )}
    </main>
  );
}
