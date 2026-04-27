import { CaseStudyForm } from "@/features/admin/case-studies/case-study-form";
import { getCaseStudies } from "@/lib/content/loaders";
import { getEditMode } from "@/lib/env";

export default async function AdminCaseStudiesPage() {
  const caseStudies = await getCaseStudies();
  const editMode = getEditMode();

  return (
    <div className="admin-page">
      <header className="page-header">
        <div className="eyebrow">Admin</div>
        <h1 className="page-title">Case studies</h1>
        <p>
          Keep every case study consistent by filling the same compact fields for
          background, problem, solution, process, results, and links.
        </p>
      </header>
      <CaseStudyForm editMode={editMode} initialCaseStudies={caseStudies} />
    </div>
  );
}
