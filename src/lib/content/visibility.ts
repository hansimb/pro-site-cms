type PublishedLike = {
  published: boolean;
};

type TopicLike = {
  slug: string;
  published: boolean;
};

type ArticleLike = {
  topic: string;
  published: boolean;
};

export function shouldShowCaseStudies(caseStudies: PublishedLike[]) {
  return caseStudies.some((caseStudy) => caseStudy.published);
}

export function shouldShowWriting(articles: PublishedLike[]) {
  return articles.some((article) => article.published);
}

export function getVisibleTopics<TTopic extends TopicLike, TArticle extends ArticleLike>(
  topics: TTopic[],
  articles: TArticle[],
) {
  const publishedTopics = new Set(
    articles.filter((article) => article.published).map((article) => article.topic),
  );

  return topics.filter((topic) => topic.published && publishedTopics.has(topic.slug));
}

export function canRenderFeaturedArticles(articles: PublishedLike[]) {
  return shouldShowWriting(articles);
}

export function canRenderFeaturedCaseStudies(caseStudies: PublishedLike[]) {
  return shouldShowCaseStudies(caseStudies);
}
