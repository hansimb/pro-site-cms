import matter from "gray-matter";
import { articleDocumentSchema, articleFrontmatterSchema, type ArticleFrontmatter } from "./schema";

export type ParsedArticle = ArticleFrontmatter & {
  body: string;
};

export type ArticleDocument = ParsedArticle;

function normalizeFrontmatterDates(input: Record<string, unknown>) {
  const normalized = { ...input };

  for (const key of ["publishedAt", "updatedAt"] as const) {
    const value = normalized[key];
    if (value instanceof Date) {
      normalized[key] = value.toISOString().slice(0, 10);
    }
  }

  return normalized;
}

export function parseArticleFile(source: string): ParsedArticle {
  const { content, data } = matter(source);
  const frontmatter = articleFrontmatterSchema.parse(normalizeFrontmatterDates(data));

  return {
    ...frontmatter,
    body: content.trim(),
  };
}

export function serializeArticleFile(article: ArticleDocument) {
  const parsed = articleDocumentSchema.parse(article);
  const { body, ...frontmatter } = parsed;
  return matter.stringify(body.trim(), frontmatter);
}
