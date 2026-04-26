import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseArticleFile, type ParsedArticle } from "./article-frontmatter";
import {
  caseStudyIndexSchema,
  homeDocumentSchema,
  navigationSchema,
  siteSettingsSchema,
  writingTopicsSchema,
  type CaseStudy,
  type HomeDocument,
  type Navigation,
  type SiteSettings,
  type WritingTopic,
} from "./schema";

function resolveContentPath(rootDir: string, ...segments: string[]) {
  return path.join(rootDir, "content", ...segments);
}

async function readJsonFile<T>(filePath: string, parser: { parse(input: unknown): T }) {
  const raw = await readFile(filePath, "utf8");
  return parser.parse(JSON.parse(raw));
}

export async function getHomeDocument(rootDir = process.cwd()): Promise<HomeDocument> {
  return readJsonFile(resolveContentPath(rootDir, "home", "home.json"), homeDocumentSchema);
}

export async function getCaseStudyIndex(rootDir = process.cwd()) {
  return readJsonFile(
    resolveContentPath(rootDir, "case-studies", "index.json"),
    caseStudyIndexSchema,
  );
}

export async function getCaseStudies(rootDir = process.cwd()): Promise<CaseStudy[]> {
  const index = await getCaseStudyIndex(rootDir);
  return index.items;
}

export async function getSiteSettings(rootDir = process.cwd()): Promise<SiteSettings> {
  return readJsonFile(resolveContentPath(rootDir, "settings", "site.json"), siteSettingsSchema);
}

export async function getNavigation(rootDir = process.cwd()): Promise<Navigation> {
  return readJsonFile(
    resolveContentPath(rootDir, "settings", "navigation.json"),
    navigationSchema,
  );
}

export async function getWritingTopics(rootDir = process.cwd()): Promise<WritingTopic[]> {
  const topicFile = await readJsonFile(
    resolveContentPath(rootDir, "writing", "topics.json"),
    writingTopicsSchema,
  );
  return topicFile.topics;
}

export async function getAllArticles(rootDir = process.cwd()): Promise<ParsedArticle[]> {
  const topics = await getWritingTopics(rootDir);
  const articles = await Promise.all(
    topics.map(async (topic) => {
      const topicDir = resolveContentPath(rootDir, "writing", topic.slug);
      let entries: string[] = [];

      try {
        entries = await readdir(topicDir);
      } catch {
        return [];
      }

      const files = entries.filter((entry) => entry.endsWith(".md"));
      const loaded = await Promise.all(
        files.map(async (fileName) => {
          const raw = await readFile(path.join(topicDir, fileName), "utf8");
          return parseArticleFile(raw);
        }),
      );

      return loaded;
    }),
  );

  return articles
    .flat()
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getPublishedArticles(rootDir = process.cwd()) {
  const articles = await getAllArticles(rootDir);
  return articles.filter((article) => article.published);
}

export async function getPublishedCaseStudies(rootDir = process.cwd()) {
  const caseStudies = await getCaseStudies(rootDir);
  return caseStudies.filter((caseStudy) => caseStudy.published);
}

export async function getPublishedArticlesByTopic(topic: string, rootDir = process.cwd()) {
  const articles = await getPublishedArticles(rootDir);
  return articles.filter((article) => article.topic === topic);
}

export async function getArticleByTopicAndSlug(
  topic: string,
  slug: string,
  rootDir = process.cwd(),
) {
  const articles = await getAllArticles(rootDir);
  return articles.find((article) => article.topic === topic && article.slug === slug);
}

export async function getUploadedMediaPaths(rootDir = process.cwd()) {
  const uploadDir = path.join(rootDir, "public", "uploads");

  try {
    const entries = await readdir(uploadDir);
    return entries
      .filter((entry) => entry !== ".gitkeep")
      .map((entry) => `/uploads/${entry}`)
      .sort();
  } catch {
    return [];
  }
}
