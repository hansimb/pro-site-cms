import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { ArticleBackButton } from "@/app/(site)/components/article-back-button";
import { ArticleCitationBox } from "@/app/(site)/components/article-citation-box";
import { ArticleShareActions } from "@/app/(site)/components/article-share-actions";
import { RichTextContent } from "@/app/(site)/components/rich-text-content";
import { buildReferenceHref, formatArticleCitation } from "@/features/site/article-citations";
import { getArticleBySlug, getSiteModel } from "@/features/site/data/payload-site";
import {
  buildArticleMetadata,
  buildArticleSocialImagePath,
} from "@/features/site/metadata";

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
  const socialImage = buildArticleSocialImagePath(decodedTopic, decodedSlug);

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

  const metadata = buildArticleMetadata(site, article);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [socialImage],
    },
    twitter: {
      ...metadata.twitter,
      images: [socialImage.replace("/opengraph-image", "/twitter-image")],
    },
  };
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
        <ArticleBackButton fallbackHref="/writing" label="Back" />
        <Heading as="h1" fontSize={{ base: "xl", md: "3xl" }} letterSpacing="0">
          {article.title}
        </Heading>
        {article.citationAuthors && (
          <Text color="muted" fontSize="sm" fontWeight="600" letterSpacing="0.02em">
            By {article.citationAuthors}
          </Text>
        )}
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
          <HStack align="start" flexWrap="wrap" gap={2}>
            {article.keywords.map((keyword) => (
              <Text
                bg="surface"
                border="1px solid"
                borderColor="border"
                borderRadius="full"
                color="muted"
                fontSize="xs"
                key={keyword}
                px={3}
                py={1}
              >
                {keyword}
              </Text>
            ))}
          </HStack>
        )}
      </Stack>

      <RichTextContent
        content={article.content}
        referenceCount={article.references.length}
      />

      <ArticleShareActions articleUrl={articleUrl} title={article.title} />

      <ArticleCitationBox citation={citation} />

      {article.references.length > 0 && (
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
