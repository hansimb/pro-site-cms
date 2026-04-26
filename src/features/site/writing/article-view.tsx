import ReactMarkdown from "react-markdown";
import type { ParsedArticle } from "@/lib/content/article-frontmatter";

export function ArticleView({ article }: { article: ParsedArticle }) {
  return (
    <article className="page-stack">
      <header className="page-header">
        <div className="eyebrow">{article.topic}</div>
        <h1 className="page-title">{article.title}</h1>
        <p>{article.excerpt}</p>
        <div className="meta-row">
          <span>Published {article.publishedAt}</span>
          <span>Updated {article.updatedAt}</span>
        </div>
      </header>

      <section className="content-card prose">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </section>

      {article.references.length > 0 ? (
        <section className="content-card section-stack">
          <h2 className="content-card-title">References</h2>
          <div className="link-list">
            {article.references.map((reference) => (
              <a
                className="link-item"
                href={reference.url}
                key={`${article.slug}-${reference.url}`}
                rel="noreferrer"
                target="_blank"
              >
                <span>{reference.label}</span>
                <span>Source</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
