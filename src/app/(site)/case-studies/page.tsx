import { CaseStudiesPageView } from "@/features/site/drafts/case-studies-page-view";
import { getPublishedCaseStudies } from "@/lib/content/loaders";

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();
  return <CaseStudiesPageView initialCaseStudies={caseStudies} />;
}
