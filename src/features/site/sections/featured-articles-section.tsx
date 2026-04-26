import Link from "next/link";
import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { HomeBlock } from "@/lib/content/schema";

type FeaturedArticlesBlock = Extract<HomeBlock, { type: "featuredArticles" }>;

export function FeaturedArticlesSection({
  articles,
  block,
}: {
  articles: ParsedArticle[];
  block: FeaturedArticlesBlock;
}) {
  return (
    <section className="content-card section-stack">
      <h2 className="content-card-title">{block.title}</h2>
      {block.intro ? <p>{block.intro}</p> : null}
      <div className="article-grid">
        {articles.slice(0, block.limit).map((article) => (
          <Link
            className="article-card"
            href={`/writing/${article.topic}/${article.slug}`}
            key={article.slug}
          >
            <div className="meta-row">
              <span>{article.topic}</span>
              <span>{article.publishedAt}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
