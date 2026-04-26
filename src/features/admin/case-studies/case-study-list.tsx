"use client";

import type { CaseStudy } from "@/lib/content/schema";

export function CaseStudyList({
  caseStudies,
  onAdd,
  onSelect,
  selectedId,
}: {
  caseStudies: CaseStudy[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <div className="list-stack">
      <div className="admin-panel">
        <h2 className="content-card-title">Case studies</h2>
        <button className="button-primary" onClick={onAdd} type="button">
          + Add case study
        </button>
      </div>

      <div className="item-list">
        {caseStudies.map((caseStudy) => (
          <button
            className={`item-card ${selectedId === caseStudy.id ? "item-card-active" : ""}`}
            key={caseStudy.id}
            onClick={() => onSelect(caseStudy.id)}
            type="button"
          >
            <strong>{caseStudy.title}</strong>
            <span>{caseStudy.summary}</span>
            <div className="meta-row">
              <span>{caseStudy.published ? "Published" : "Draft"}</span>
              {caseStudy.featured ? <span>Featured</span> : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
