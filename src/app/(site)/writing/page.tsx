import { notFound } from "next/navigation";
import { TopicGrid } from "@/features/site/writing/topic-grid";
import { getPublishedArticles, getWritingTopics } from "@/lib/content/loaders";
import { getVisibleTopics, shouldShowWriting } from "@/lib/content/visibility";

export default async function WritingPage() {
  const [topics, articles] = await Promise.all([getWritingTopics(), getPublishedArticles()]);

  if (!shouldShowWriting(articles)) {
    notFound();
  }

  const visibleTopics = getVisibleTopics(topics, articles);

  return (
    <main className="page-stack">
      <header className="page-header">
        <div className="eyebrow">Writing</div>
        <h1 className="page-title">Analytical notes, essays, and articles.</h1>
        <p>
          Topic-driven writing with an analytical, source-conscious structure. Topics
          appear only when they contain published work.
        </p>
      </header>

      <TopicGrid topics={visibleTopics} />
    </main>
  );
}
