import NextLink from "next/link";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function WritingPage() {
  const site = await getSiteModel();

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="2xl">
        <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0">
          Writing
        </Heading>
        <Text color="muted">Articles will be managed from Payload once the first editor content is created.</Text>
      </Stack>

      <Stack gap={3}>
        {site.articles.length === 0 ? (
          <Box borderWidth="1px" borderColor="edge" color="muted" p={5} rounded="panel">
            No articles yet.
          </Box>
        ) : (
          site.articles.map((article) => (
            <Box borderWidth="1px" borderColor="edge" key={article.href} p={5} rounded="panel">
              <Heading as="h2" fontSize="md" letterSpacing="0">
                <Link asChild color="text" textDecoration="none" _hover={{ color: "accent" }}>
                  <NextLink href={article.href}>{article.title}</NextLink>
                </Link>
              </Heading>
              <Text color="muted" fontSize="sm">
                {article.excerpt}
              </Text>
            </Box>
          ))
        )}
      </Stack>
    </Stack>
  );
}
