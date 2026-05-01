import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Box, Heading, Link, Stack, Text, Button } from "@chakra-ui/react";
import {
  getArticlesByTopic,
  getSiteModel,
} from "@/features/site/data/payload-site";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);

  const [articles, site] = await Promise.all([
    getArticlesByTopic(decodedTopic),
    getSiteModel(),
  ]);

  // Check if topic exists
  if (!site.topics.includes(decodedTopic)) {
    notFound();
  }

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="2xl">
        <Button asChild variant="ghost" alignSelf="start" size="sm">
          <NextLink href="/writing">← Back to Writing</NextLink>
        </Button>
        <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0">
          {decodedTopic}
        </Heading>
        <Text color="muted">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this
          topic.
        </Text>
      </Stack>

      <Stack gap={3}>
        {articles.length === 0 ? (
          <Box
            borderWidth="1px"
            borderColor="edge"
            color="muted"
            p={5}
            rounded="panel"
          >
            No articles in this topic yet.
          </Box>
        ) : (
          articles.map((article) => (
            <Link
              key={article.href}
              asChild
              color="text"
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
            >
              <NextLink href={article.href}>
                <Box
                  as="article"
                  w="100%"
                  borderWidth="1px"
                  borderColor="edge"
                  p={5}
                  rounded="panel"
                  bg="surface"
                  _hover={{ bg: "surfaceRaised", borderColor: "accent" }}
                >
                  <Heading as="h2" fontSize="md" letterSpacing="0">
                    {article.title}
                  </Heading>
                  <Text color="muted" fontSize="sm" mt={1}>
                    {article.excerpt}
                  </Text>
                </Box>
              </NextLink>
            </Link>
          ))
        )}
      </Stack>
    </Stack>
  );
}
