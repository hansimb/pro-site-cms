import NextLink from "next/link";
import {
  Box,
  Heading,
  Link,
  Stack,
  Text,
  Grid,
  Button,
} from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

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
            borderWidth="1px"
            borderColor="edge"
            color="muted"
            p={5}
            rounded="panel"
          >
            No topics yet.
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={3}
          >
            {site.topics.map((topic) => (
              <Button
                key={topic}
                asChild
                variant="outline"
                size="lg"
                h="auto"
                p={4}
                justifyContent="start"
                bg="surface"
                borderColor="edge"
                _hover={{ bg: "surfaceRaised", borderColor: "edge", color: "text" }}
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
                      {article.topic} • {article.excerpt}
                    </Text>
                  </Box>
                </NextLink>
              </Link>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
