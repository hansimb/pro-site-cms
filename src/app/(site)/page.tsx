import NextLink from "next/link";
import { Box, Grid, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function HomePage() {
  const site = await getSiteModel();
  const { hero, blocks } = site.homePage;

  return (
    <Stack gap={10}>
      <Stack gap={5} maxW="3xl">
        <Text color="accent" fontSize="sm" fontWeight="700">
          {hero.eyebrow}
        </Text>
        <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0" lineHeight="1.1">
          {hero.heading}
        </Heading>
        <Text color="muted" fontSize="md" lineHeight="1.7" maxW="2xl">
          {hero.body}
        </Text>
        {hero.primaryLink && (
          <Link asChild color="accent" fontSize="sm" textDecoration="none">
            <NextLink href={hero.primaryLink.href}>{hero.primaryLink.label}</NextLink>
          </Link>
        )}
      </Stack>

      {hero.showFeatured && (
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
      )}

      {blocks.length > 0 && (
        <Stack gap={4}>
          {blocks.map((block, index) => {
            switch (block.blockType) {
              case "text":
                return (
                  <Stack gap={3} key={`${block.blockType}-${index}`} maxW="3xl">
                    <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                      {block.heading}
                    </Heading>
                    <Text color="muted" lineHeight="1.8">
                      {block.body}
                    </Text>
                  </Stack>
                );

              case "callout":
                return (
                  <Box
                    key={`${block.blockType}-${index}`}
                    borderWidth="1px"
                    borderColor="edge"
                    bg="surfaceRaised"
                    p={5}
                    rounded="panel"
                  >
                    <Stack gap={2} maxW="3xl">
                      <Heading as="h2" fontSize="md" letterSpacing="0">
                        {block.heading}
                      </Heading>
                      <Text color="muted" lineHeight="1.8">
                        {block.body}
                      </Text>
                    </Stack>
                  </Box>
                );

              case "linkList":
                return (
                  <Box
                    key={`${block.blockType}-${index}`}
                    borderWidth="1px"
                    borderColor="edge"
                    bg="surface"
                    p={5}
                    rounded="panel"
                  >
                    <Stack gap={3}>
                      <Heading as="h2" fontSize="md" letterSpacing="0">
                        {block.heading}
                      </Heading>
                      <Stack gap={2}>
                        {block.links.map((link) => (
                          <Link
                            asChild
                            color="accent"
                            fontSize="sm"
                            key={`${link.href}-${link.label}`}
                            textDecoration="none"
                          >
                            <NextLink href={link.href}>{link.label}</NextLink>
                          </Link>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                );
            }
          })}
        </Stack>
      )}
    </Stack>
  );
}
