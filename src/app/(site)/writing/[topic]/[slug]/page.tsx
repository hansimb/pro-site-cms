import { notFound } from "next/navigation";
import { ArticleView } from "@/features/site/writing/article-view";
import { getArticleByTopicAndSlug } from "@/lib/content/loaders";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
    topic: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, topic } = await params;
  const article = await getArticleByTopicAndSlug(topic, slug);

  if (!article || !article.published) {
    notFound();
  }

  return <ArticleView article={article} />;
}
