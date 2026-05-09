import type { Metadata } from "next";
import NextLink from "next/link";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArticleTopicEyebrow } from "@/app/(site)/components/article-topic-eyebrow";
import { getSiteModel } from "@/features/site/data/payload-site";
import { buildSimplePageMetadata } from "@/features/site/metadata";

function clampKeywords(keywords: string[], maxChars = 44) {
  const selected: string[] = [];
  let used = 0;

  for (const keyword of keywords) {
    const separatorLength = selected.length > 0 ? 2 : 0;
    const nextLength = used + separatorLength + keyword.length;

    if (nextLength > maxChars) {
      break;
    }

    selected.push(keyword);
    used = nextLength;
  }

  return selected;
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteModel();

  return buildSimplePageMetadata(
    site,
    "Writing",
    "Articles, notes, and technical thinking around software, systems, and practical learning.",
  );
}

export default async function WritingPage() {
  const site = await getSiteModel();

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="2xl">
        <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0">
          Writing
        </Heading>
        <Text color="muted">Articles organized by topic.</Text>
      </Stack>

      <Stack gap={4}>
        <Heading as="h2" fontSize="lg" letterSpacing="0">
          Topics
        </Heading>

        {site.topics.length === 0 ? (
          <Box
            borderColor="edge"
            borderWidth="1px"
            color="muted"
            p={5}
            rounded="panel"
          >
            No topics yet.
          </Box>
        ) : (
          <Grid
            gap={3}
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
          >
            {site.topics.map((topic) => (
              <Button
                _hover={{
                  bg: "surfaceRaised",
                  borderColor: "edge",
                  color: "text",
                }}
                asChild
                bg="surface"
                borderColor="edge"
                h="auto"
                justifyContent="start"
                key={topic}
                p={4}
                size="lg"
                variant="outline"
              >
                <NextLink href={`/writing/${encodeURIComponent(topic)}`}>
                  <Stack gap={1}>
                    <Text fontWeight="semibold">{topic}</Text>
                    <Text fontSize="sm" opacity={0.8}>
                      {
                        site.articles.filter(
                          (article) => article.topic === topic,
                        ).length
                      }{" "}
                      articles
                    </Text>
                  </Stack>
                </NextLink>
              </Button>
            ))}
          </Grid>
        )}
      </Stack>

      {site.articles.length > 0 && (
        <Stack gap={4}>
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            All Articles
          </Heading>
          <Stack gap={3}>
            {site.articles.map((article) => (
              <Link
                _hover={{ textDecoration: "none" }}
                asChild
                color="text"
                key={article.href}
                textDecoration="none"
              >
                <NextLink href={article.href}>
                  {(() => {
                    const visibleKeywords = clampKeywords(article.keywords);

                    return (
                      <Box
                        _hover={{ bg: "surfaceRaised", borderColor: "accent" }}
                        as="article"
                        bg="surface"
                        borderColor="edge"
                        borderWidth="1px"
                        p={5}
                        rounded="panel"
                        w="100%"
                      >
                        <ArticleTopicEyebrow linked={false} topic={article.topic} />
                        <Heading as="h2" fontSize="md" letterSpacing="0">
                          {article.title}
                        </Heading>
                        {visibleKeywords.length > 0 && (
                          <HStack flexWrap="wrap" gap={2} mt={2}>
                            {visibleKeywords.map((keyword) => (
                              <Text
                                bg="surfaceRaised"
                                border="1px solid"
                                borderColor="edge"
                                borderRadius="full"
                                color="muted"
                                fontSize="xs"
                                key={keyword}
                                px={2.5}
                                py={1}
                              >
                                {keyword}
                              </Text>
                            ))}
                          </HStack>
                        )}
                        <Text color="muted" fontSize="sm" mt={1}>
                          {article.excerpt}
                        </Text>
                      </Box>
                    );
                  })()}
                </NextLink>
              </Link>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
