import { getPublishedArticles, getPublishedCaseStudies, getHomeDocument } from "@/lib/content/loaders";
import { renderHomeBlock } from "@/features/site/sections/section-renderer";

export default async function HomePage() {
  const [home, articles, caseStudies] = await Promise.all([
    getHomeDocument(),
    getPublishedArticles(),
    getPublishedCaseStudies(),
  ]);

  return (
    <main className="page-stack">
      {home.blocks
        .filter((block) => block.visible)
        .map((block) => renderHomeBlock(block, articles, caseStudies))}
    </main>
  );
}
