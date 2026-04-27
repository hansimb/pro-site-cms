import { serializeArticleFile } from "./article-frontmatter";
import {
  getAllArticles,
  getCaseStudies,
  getHomeDocument,
  getSiteSettings,
  getWritingTopics,
} from "./loaders";
import { publishDraftPayloadSchema, type PublishDraftPayload } from "./draft-schema";
import { commitGitHubFileMap } from "@/lib/github/commits";

function serializeJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildPublishFileMap(input: {
  articles: PublishDraftPayload extends never ? never : Awaited<ReturnType<typeof getAllArticles>>;
  caseStudies: Awaited<ReturnType<typeof getCaseStudies>>;
  currentArticlePaths: string[];
  home: Awaited<ReturnType<typeof getHomeDocument>>;
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
  topics: Awaited<ReturnType<typeof getWritingTopics>>;
}) {
  const nextEntries: Record<string, string | null> = {
    "content/case-studies/index.json": serializeJson({ items: input.caseStudies }),
    "content/home/home.json": serializeJson(input.home),
    "content/settings/site.json": serializeJson(input.settings),
    "content/writing/topics.json": serializeJson({ topics: input.topics }),
  };

  const nextArticlePaths = new Set<string>();

  for (const article of input.articles) {
    const relativePath = `content/writing/${article.topic}/${article.slug}.md`;
    nextEntries[relativePath] = serializeArticleFile(article);
    nextArticlePaths.add(relativePath);
  }

  for (const currentPath of input.currentArticlePaths) {
    if (!nextArticlePaths.has(currentPath)) {
      nextEntries[currentPath] = null;
    }
  }

  return nextEntries;
}

export async function publishDraftPayload(payload: PublishDraftPayload, rootDir = process.cwd()) {
  const parsed = publishDraftPayloadSchema.parse(payload);
  const [currentHome, currentCaseStudies, currentTopics, currentArticles, currentSettings] =
    await Promise.all([
      getHomeDocument(rootDir),
      getCaseStudies(rootDir),
      getWritingTopics(rootDir),
      getAllArticles(rootDir),
      getSiteSettings(rootDir),
    ]);

  const home = parsed.home ?? currentHome;
  const caseStudies = parsed.caseStudies ?? currentCaseStudies;
  const topics = parsed.writing?.topics ?? currentTopics;
  const articles = parsed.writing?.articles ?? currentArticles;
  const settings = parsed.settings ?? currentSettings;

  const currentArticlePaths = currentArticles.map(
    (article) => `content/writing/${article.topic}/${article.slug}.md`,
  );

  const fileMap = buildPublishFileMap({
    articles,
    caseStudies,
    currentArticlePaths,
    home,
    settings,
    topics,
  });

  await commitGitHubFileMap(fileMap, "content: publish draft");
}
