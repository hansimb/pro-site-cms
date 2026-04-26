import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles, getWritingTopics } from "@/lib/content/loaders";
import { getVisibleTopics } from "@/lib/content/visibility";

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const [topics, articles] = await Promise.all([getWritingTopics(), getPublishedArticles()]);
  const visibleTopics = getVisibleTopics(topics, articles);
  const currentTopic = visibleTopics.find((entry) => entry.slug === topic);

  if (!currentTopic) {
    notFound();
  }

  const topicArticles = articles.filter((article) => article.topic === topic);

  return (
    <main className="page-stack">
      <header className="page-header">
        <div className="eyebrow">Topic</div>
        <h1 className="page-title">{currentTopic.title}</h1>
        <p>{currentTopic.description}</p>
      </header>

      <div className="article-grid">
        {topicArticles.map((article) => (
          <Link
            className="article-card"
            href={`/writing/${article.topic}/${article.slug}`}
            key={article.slug}
          >
            <div className="meta-row">
              <span>{article.publishedAt}</span>
              {article.featured ? <span>Featured</span> : null}
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
