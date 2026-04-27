import { getPublishedArticles, getPublishedCaseStudies, getHomeDocument } from "@/lib/content/loaders";
import { HomePageView } from "@/features/site/drafts/home-page-view";

export default async function HomePage() {
  const [home, articles, caseStudies] = await Promise.all([
    getHomeDocument(),
    getPublishedArticles(),
    getPublishedCaseStudies(),
  ]);

  return (
    <HomePageView
      initialArticles={articles}
      initialCaseStudies={caseStudies}
      initialHome={home}
    />
  );
}
