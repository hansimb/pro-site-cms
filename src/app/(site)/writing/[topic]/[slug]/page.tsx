import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Box, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { getArticleBySlug } from "@/features/site/data/payload-site";

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

      <Box maxW="4xl">
        {/* TODO: Render rich text content */}
        <Text color="muted">
          Article content rendering will be implemented.
        </Text>
      </Box>

      {article.references && article.references.length > 0 && (
        <Stack gap={3} maxW="4xl">
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            References
          </Heading>
          {/* TODO: Render references */}
          <Text color="muted">References rendering will be implemented.</Text>
        </Stack>
      )}
    </Stack>
  );
}
