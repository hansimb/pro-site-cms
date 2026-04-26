import { notFound } from "next/navigation";
import { CaseGrid } from "@/features/site/case-studies/case-grid";
import { getPublishedCaseStudies } from "@/lib/content/loaders";
import { shouldShowCaseStudies } from "@/lib/content/visibility";

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  if (!shouldShowCaseStudies(caseStudies)) {
    notFound();
  }

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

      <CaseGrid caseStudies={caseStudies} />
    </main>
  );
}
