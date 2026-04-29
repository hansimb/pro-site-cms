import NextLink from "next/link";
import { Box, Grid, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function HomePage() {
  const site = await getSiteModel();

  return (
    <Stack gap={10}>
      <Stack gap={5} maxW="3xl">
        <Text color="accent" fontSize="sm" fontWeight="700">
          Payload-backed publishing system
        </Text>
        <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0" lineHeight="1.1">
          Minimal dark CMS architecture for a sharper professional site.
        </Heading>
        <Text color="muted" fontSize="md" lineHeight="1.7" maxW="2xl">
          The legacy custom CMS has been replaced by a Payload-first foundation. The interface is intentionally
          compact, angular, and product-like.
        </Text>
      </Stack>

      <Grid gap={4} templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}>
        <Box borderWidth="1px" borderColor="edge" bg="surface" p={5} rounded="panel">
          <Stack gap={3}>
            <Heading as="h2" fontSize="md" letterSpacing="0">
              Writing
            </Heading>
            <Text color="muted" fontSize="sm">
              {site.articles.length} articles ready from the new content surface.
            </Text>
            <Link asChild color="accent" fontSize="sm" textDecoration="none">
              <NextLink href="/writing">Open writing</NextLink>
            </Link>
          </Stack>
        </Box>
        <Box borderWidth="1px" borderColor="edge" bg="surface" p={5} rounded="panel">
          <Stack gap={3}>
            <Heading as="h2" fontSize="md" letterSpacing="0">
              Case studies
            </Heading>
            <Text color="muted" fontSize="sm">
              {site.caseStudies.length} case studies ready from the new content surface.
            </Text>
            <Link asChild color="accent" fontSize="sm" textDecoration="none">
              <NextLink href="/case-studies">Open case studies</NextLink>
            </Link>
          </Stack>
        </Box>
      </Grid>
    </Stack>
  );
}
