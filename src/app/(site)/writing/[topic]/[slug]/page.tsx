import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Box, Heading, Link, Stack, Text, Button } from "@chakra-ui/react";
import { getArticleBySlug } from "@/features/site/data/payload-site";
import { RichTextContent } from "@/app/(site)/components/rich-text-content";

interface ArticlePageProps {
  params: Promise<{ topic: string; slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { topic, slug } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const decodedSlug = decodeURIComponent(slug);

  const article = await getArticleBySlug(decodedTopic, decodedSlug);

  if (!article) {
    notFound();
  }

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
          </Text>
        )}
      </Stack>

      <RichTextContent content={article.content} />

      {article.references && article.references.length > 0 && (
        <Stack gap={3} maxW="4xl">
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            References
          </Heading>
          <Stack gap={2}>
            {article.references.map((reference) => (
              <Box key={`${reference.label}-${reference.url}`}>
                <Link
                  color="accent"
                  href={reference.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {reference.label}
                </Link>
              </Box>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
