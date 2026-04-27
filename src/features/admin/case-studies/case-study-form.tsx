"use client";

import { useMemo, useState } from "react";
import { readDraftSection, writeDraftSection } from "@/lib/content/draft-storage";
import { confirmDelete } from "@/features/admin/shared/delete-confirm";
import { useAdminAction } from "@/features/admin/shared/use-admin-action";
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

export function CaseStudyForm({
  editMode,
  initialCaseStudies,
}: {
  editMode: "LOCAL" | "GITHUB";
  initialCaseStudies: CaseStudy[];
}) {
  const startingCaseStudies =
    editMode === "GITHUB"
      ? readDraftSection<CaseStudy[]>("caseStudies") ?? initialCaseStudies
      : initialCaseStudies;
  const [caseStudies, setCaseStudies] = useState(startingCaseStudies);
  const [selectedId, setSelectedId] = useState<string | null>(startingCaseStudies[0]?.id ?? null);
  const action = useAdminAction("Idle");

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
    if (editMode === "GITHUB") {
      await action.run(async () => {
        writeDraftSection("caseStudies", caseStudies);
      }, {
        pending: "Saving draft...",
        success: "Draft saved.",
        error: "Draft save failed.",
      });
      return;
    }

    await action.run(async () => {
      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ items: caseStudies }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }
    }, {
      pending: "Saving...",
      success: "Saved.",
      error: "Save failed.",
    });
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
          <span className="status-text">{action.message}</span>
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
              <button
                className="button-primary"
                data-status={action.state}
                onClick={saveCaseStudies}
                type="button"
              >
                {editMode === "GITHUB" ? "Save draft" : "Save case studies"}
              </button>
              <button
                className="button-danger"
                onClick={() => {
                  if (!confirmDelete("Delete this case study?")) {
                    return;
                  }

                  const next = caseStudies.filter((caseStudy) => caseStudy.id !== selectedCaseStudy.id);
                  setCaseStudies(next);
                  setSelectedId(next[0]?.id ?? null);
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
