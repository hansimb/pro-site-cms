import { ArticlePageView } from "@/features/site/drafts/article-page-view";
import { getArticleByTopicAndSlug, getAllArticles } from "@/lib/content/loaders";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
    topic: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, topic } = await params;
  const [article, articles] = await Promise.all([
    getArticleByTopicAndSlug(topic, slug),
    getAllArticles(),
  ]);

  return (
    <ArticlePageView
      initialArticle={article ?? null}
      initialArticles={articles}
      slug={slug}
      topic={topic}
    />
  );
}
