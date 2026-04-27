import { TopicPageView } from "@/features/site/drafts/topic-page-view";
import { getPublishedArticles, getWritingTopics } from "@/lib/content/loaders";

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const [topics, articles] = await Promise.all([getWritingTopics(), getPublishedArticles()]);
  return <TopicPageView initialArticles={articles} initialTopics={topics} topic={topic} />;
}
