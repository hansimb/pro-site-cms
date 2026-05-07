import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getArticleBySlug, getSiteModel } from "@/features/site/data/payload-site";
import { ArticleCitationBox } from "@/app/(site)/components/article-citation-box";
import { buildArticleMetadata } from "@/features/site/metadata";
import { buildReferenceHref, formatArticleCitation } from "@/features/site/article-citations";
import { RichTextContent } from "@/app/(site)/components/rich-text-content";

interface ArticlePageProps {
  params: Promise<{ topic: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { topic, slug } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const decodedSlug = decodeURIComponent(slug);

  const [site, article] = await Promise.all([
    getSiteModel(),
    getArticleBySlug(decodedTopic, decodedSlug),
  ]);

  if (!article) {
    return buildArticleMetadata(site, {
      content: null,
      excerpt: site.settings.siteDescription,
      keywords: [],
      references: [],
      title: decodedSlug,
      topic: decodedTopic,
    });
  }

  return buildArticleMetadata(site, article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { topic, slug } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const decodedSlug = decodeURIComponent(slug);

  const [site, article] = await Promise.all([
    getSiteModel(),
    getArticleBySlug(decodedTopic, decodedSlug),
  ]);

  if (!article) {
    notFound();
  }

  const articleUrl = `${site.settings.seo.siteUrl.replace(/\/$/, "")}/writing/${encodeURIComponent(decodedTopic)}/${encodeURIComponent(decodedSlug)}`;
  const citation = formatArticleCitation({
    articleUrl,
    citationAuthors: article.citationAuthors,
    publishedAt: article.publishedAt,
    siteTitle: site.settings.siteTitle,
    title: article.title,
  });

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="4xl">
        <Button asChild variant="ghost" alignSelf="start" size="sm">
          <NextLink href={`/writing/${encodeURIComponent(decodedTopic)}`}>
            ← Back to {decodedTopic}
          </NextLink>
        </Button>
        <Heading as="h1" fontSize={{ base: "xl", md: "3xl" }} letterSpacing="0">
          {article.title}
        </Heading>
        <Text color="muted" fontSize="lg">
          {article.excerpt}
        </Text>
        {article.publishedAt && (
          <Text color="muted" fontSize="sm">
            Published {new Date(article.publishedAt).toLocaleDateString()}
            {article.updatedAt
              ? ` • Updated ${new Date(article.updatedAt).toLocaleDateString()}`
              : ""}
          </Text>
        )}
        {article.keywords.length > 0 && (
          <Text color="muted" fontSize="sm">
            {article.keywords.join(" • ")}
          </Text>
        )}
      </Stack>

      <ArticleCitationBox citation={citation} />

      <RichTextContent
        content={article.content}
        referenceCount={article.references.length}
      />

      {article.references && article.references.length > 0 && (
        <Stack gap={3} maxW="4xl">
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            References
          </Heading>
          <Stack as="ol" gap={3} ps={5}>
            {article.references.map((reference, index) => (
              <Box
                as="li"
                id={buildReferenceHref(index + 1).slice(1)}
                key={`${reference.label}-${reference.url}`}
              >
                <Link
                  color="accent"
                  href={reference.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {reference.label}
                </Link>
                {(reference.publisher || reference.publishedAt || reference.accessedAt) && (
                  <Text color="muted" fontSize="sm" mt={1}>
                    {[
                      reference.publisher,
                      reference.publishedAt
                        ? new Date(reference.publishedAt).toLocaleDateString()
                        : undefined,
                      reference.accessedAt
                        ? `Accessed ${new Date(reference.accessedAt).toLocaleDateString()}`
                        : undefined,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
