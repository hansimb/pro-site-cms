import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { serializeArticleFile } from "./article-frontmatter";
import { removeGitHubFile, upsertGitHubTextFile } from "@/lib/github/commits";
import {
  articleDocumentSchema,
  caseStudyIndexSchema,
  homeDocumentSchema,
  navigationSchema,
  siteSettingsSchema,
  writingTopicsSchema,
  type ArticleDocument,
  type CaseStudy,
  type HomeDocument,
  type Navigation,
  type SiteSettings,
  type WritingTopic,
} from "./schema";

function serializeJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function ensureParentDirectory(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function persistTextFile(relativePath: string, content: string, message: string, rootDir: string) {
  const wroteToGitHub = await upsertGitHubTextFile(relativePath, content, message);

  if (!wroteToGitHub) {
    const filePath = path.join(rootDir, relativePath);
    await ensureParentDirectory(filePath);
    await writeFile(filePath, content, "utf8");
  }
}

export async function saveHomeDocument(document: HomeDocument, rootDir = process.cwd()) {
  const parsed = homeDocumentSchema.parse(document);
  await persistTextFile(
    "content/home/home.json",
    serializeJson(parsed),
    "content: update home document",
    rootDir,
  );
}

export async function saveSiteSettings(settings: SiteSettings, rootDir = process.cwd()) {
  const parsed = siteSettingsSchema.parse(settings);
  await persistTextFile(
    "content/settings/site.json",
    serializeJson(parsed),
    "content: update site settings",
    rootDir,
  );
}

export async function saveNavigation(navigation: Navigation, rootDir = process.cwd()) {
  const parsed = navigationSchema.parse(navigation);
  await persistTextFile(
    "content/settings/navigation.json",
    serializeJson(parsed),
    "content: update navigation",
    rootDir,
  );
}

export async function saveCaseStudies(caseStudies: CaseStudy[], rootDir = process.cwd()) {
  const parsed = caseStudyIndexSchema.parse({ items: caseStudies });
  await persistTextFile(
    "content/case-studies/index.json",
    serializeJson(parsed),
    "content: update case studies",
    rootDir,
  );
}

export async function saveWritingTopics(topics: WritingTopic[], rootDir = process.cwd()) {
  const parsed = writingTopicsSchema.parse({ topics });
  await persistTextFile(
    "content/writing/topics.json",
    serializeJson(parsed),
    "content: update writing topics",
    rootDir,
  );
}

export async function saveArticleDocument(article: ArticleDocument, rootDir = process.cwd()) {
  const parsed = articleDocumentSchema.parse(article);
  const relativePath = `content/writing/${parsed.topic}/${parsed.slug}.md`;
  await persistTextFile(
    relativePath,
    serializeArticleFile(parsed),
    `content: update article ${parsed.slug}`,
    rootDir,
  );
}

export async function deleteArticleDocument(
  topic: string,
  slug: string,
  rootDir = process.cwd(),
) {
  const relativePath = `content/writing/${topic}/${slug}.md`;
  const removedFromGitHub = await removeGitHubFile(relativePath, `content: delete article ${slug}`);

  if (!removedFromGitHub) {
    const filePath = path.join(rootDir, relativePath);
    await rm(filePath, { force: true });
  }
}
