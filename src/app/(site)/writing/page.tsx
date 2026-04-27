import { WritingPageView } from "@/features/site/drafts/writing-page-view";
import { getPublishedArticles, getWritingTopics } from "@/lib/content/loaders";

export default async function WritingPage() {
  const [topics, articles] = await Promise.all([getWritingTopics(), getPublishedArticles()]);
  return <WritingPageView initialArticles={articles} initialTopics={topics} />;
}
