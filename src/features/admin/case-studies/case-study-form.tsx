"use client";

import { useMemo, useState } from "react";
import type { CaseStudy } from "@/lib/content/schema";
import { CaseStudyList } from "./case-study-list";

function createCaseStudy(): CaseStudy {
  const id = `case-${crypto.randomUUID()}`;
  return {
    id,
    title: "New case study",
    summary: "",
    background: "",
    problem: "",
    solution: "",
    process: "",
    results: "",
    links: [],
    tags: [],
    published: false,
    featured: false,
  };
}

function parseLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", href = ""] = line.split("|").map((part) => part.trim());
      return { href, label };
    });
}

function serializeLinks(items: { href: string; label: string }[]) {
  return items.map((item) => `${item.label} | ${item.href}`).join("\n");
}

export function CaseStudyForm({ initialCaseStudies }: { initialCaseStudies: CaseStudy[] }) {
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [selectedId, setSelectedId] = useState<string | null>(initialCaseStudies[0]?.id ?? null);
  const [status, setStatus] = useState("Idle");

  const selectedCaseStudy = useMemo(
    () => caseStudies.find((caseStudy) => caseStudy.id === selectedId) ?? null,
    [caseStudies, selectedId],
  );

  function updateCaseStudy(nextCaseStudy: CaseStudy) {
    setCaseStudies((current) =>
      current.map((caseStudy) => (caseStudy.id === nextCaseStudy.id ? nextCaseStudy : caseStudy)),
    );
  }

  async function saveCaseStudies() {
    setStatus("Saving...");
    const response = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ items: caseStudies }),
    });

    setStatus(response.ok ? "Saved." : "Save failed.");
  }

  return (
    <div className="split-layout">
      <CaseStudyList
        caseStudies={caseStudies}
        onAdd={() => {
          const nextCaseStudy = createCaseStudy();
          setCaseStudies((current) => [...current, nextCaseStudy]);
          setSelectedId(nextCaseStudy.id);
        }}
        onSelect={setSelectedId}
        selectedId={selectedId}
      />

      <section className="admin-panel">
        <div className="meta-row">
          <h2 className="content-card-title">Edit case study</h2>
          <span className="status-text">{status}</span>
        </div>
        {selectedCaseStudy ? (
          <div className="admin-form">
            <div className="field">
              <label htmlFor="case-title">Title</label>
              <input
                id="case-title"
                onChange={(event) =>
                  updateCaseStudy({ ...selectedCaseStudy, title: event.target.value })
                }
                value={selectedCaseStudy.title}
              />
            </div>
            <div className="field">
              <label htmlFor="case-summary">Summary</label>
              <textarea
                id="case-summary"
                onChange={(event) =>
                  updateCaseStudy({ ...selectedCaseStudy, summary: event.target.value })
                }
                value={selectedCaseStudy.summary}
              />
            </div>
            {(["background", "problem", "solution", "process", "results"] as const).map((field) => (
              <div className="field" key={field}>
                <label htmlFor={`case-${field}`}>{field}</label>
                <textarea
                  id={`case-${field}`}
                  onChange={(event) =>
                    updateCaseStudy({ ...selectedCaseStudy, [field]: event.target.value })
                  }
                  value={selectedCaseStudy[field]}
                />
              </div>
            ))}
            <div className="field">
              <label htmlFor="case-links">Links, one per line: Label | URL</label>
              <textarea
                id="case-links"
                onChange={(event) =>
                  updateCaseStudy({ ...selectedCaseStudy, links: parseLinks(event.target.value) })
                }
                value={serializeLinks(selectedCaseStudy.links)}
              />
            </div>
            <div className="field">
              <label htmlFor="case-tags">Tags, comma separated</label>
              <input
                id="case-tags"
                onChange={(event) =>
                  updateCaseStudy({
                    ...selectedCaseStudy,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                value={selectedCaseStudy.tags.join(", ")}
              />
            </div>
            <div className="meta-row">
              <label>
                <input
                  checked={selectedCaseStudy.published}
                  onChange={(event) =>
                    updateCaseStudy({ ...selectedCaseStudy, published: event.target.checked })
                  }
                  type="checkbox"
                />{" "}
                Published
              </label>
              <label>
                <input
                  checked={selectedCaseStudy.featured}
                  onChange={(event) =>
                    updateCaseStudy({ ...selectedCaseStudy, featured: event.target.checked })
                  }
                  type="checkbox"
                />{" "}
                Featured
              </label>
            </div>
            <div className="meta-row">
              <button className="button-primary" onClick={saveCaseStudies} type="button">
                Save case studies
              </button>
              <button
                className="button-danger"
                onClick={() => {
                  setCaseStudies((current) =>
                    current.filter((caseStudy) => caseStudy.id !== selectedCaseStudy.id),
                  );
                  setSelectedId(caseStudies.find((caseStudy) => caseStudy.id !== selectedCaseStudy.id)?.id ?? null);
                }}
                type="button"
              >
                Delete case study
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">Add a case study to begin.</div>
        )}
      </section>
    </div>
  );
}
