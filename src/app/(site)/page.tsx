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

              case "quote":
                return (
                  <Box
                    key={`${block.blockType}-${index}`}
                    borderWidth="1px"
                    borderColor="edge"
                    bg="surface"
                    p={{ base: 5, md: 6 }}
                    rounded="panel"
                  >
                    <Stack gap={3} maxW="3xl">
                      <Text color="accent" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7">
                        &ldquo;{block.quote}&rdquo;
                      </Text>
                      {(block.attribution || block.role) && (
                        <Text color="muted" fontSize="sm">
                          {[block.attribution, block.role].filter(Boolean).join(" · ")}
                        </Text>
                      )}
                    </Stack>
                  </Box>
                );

              case "highlights":
                return (
                  <Stack gap={4} key={`${block.blockType}-${index}`}>
                    <Stack gap={2} maxW="3xl">
                      <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                        {block.heading}
                      </Heading>
                      {block.intro && (
                        <Text color="muted" lineHeight="1.8">
                          {block.intro}
                        </Text>
                      )}
                    </Stack>
                    <Grid gap={4} templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}>
                      {block.items.map((item, itemIndex) => (
                        <Box
                          key={`${item.title}-${itemIndex}`}
                          borderWidth="1px"
                          borderColor="edge"
                          bg="surface"
                          p={5}
                          rounded="panel"
                        >
                          <Stack gap={2}>
                            {item.eyebrow && (
                              <Text color="accent" fontSize="xs" fontWeight="700" textTransform="uppercase">
                                {item.eyebrow}
                              </Text>
                            )}
                            <Heading as="h3" fontSize="md" letterSpacing="0">
                              {item.title}
                            </Heading>
                            <Text color="muted" fontSize="sm" lineHeight="1.8">
                              {item.body}
                            </Text>
                          </Stack>
                        </Box>
                      ))}
                    </Grid>
                  </Stack>
                );

              case "timeline":
                return (
                  <Stack gap={4} key={`${block.blockType}-${index}`}>
                    <Stack gap={2} maxW="3xl">
                      <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                        {block.heading}
                      </Heading>
                      {block.intro && (
                        <Text color="muted" lineHeight="1.8">
                          {block.intro}
                        </Text>
                      )}
                    </Stack>
                    <Stack gap={3}>
                      {block.items.map((item, itemIndex) => (
                        <Box
                          key={`${item.period}-${item.title}-${itemIndex}`}
                          borderLeftWidth="1px"
                          borderColor="edge"
                          pl={4}
                        >
                          <Stack gap={1} py={1}>
                            <Text color="accent" fontSize="xs" fontWeight="700" textTransform="uppercase">
                              {item.period}
                            </Text>
                            <Heading as="h3" fontSize="md" letterSpacing="0">
                              {item.title}
                            </Heading>
                            <Text color="muted" fontSize="sm" lineHeight="1.8" maxW="3xl">
                              {item.summary}
                            </Text>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                );

              case "contactCta":
                return (
                  <Box
                    key={`${block.blockType}-${index}`}
                    borderWidth="1px"
                    borderColor="edge"
                    bg="surfaceRaised"
                    p={{ base: 5, md: 6 }}
                    rounded="panel"
                  >
                    <Stack gap={4} maxW="3xl">
                      <Stack gap={2}>
                        <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                          {block.heading}
                        </Heading>
                        <Text color="muted" lineHeight="1.8">
                          {block.body}
                        </Text>
                      </Stack>
                      <Stack direction={{ base: "column", md: "row" }} gap={3}>
                        {block.primaryLink && (
                          <Link asChild color="accent" fontSize="sm" textDecoration="none">
                            <NextLink href={block.primaryLink.href}>{block.primaryLink.label}</NextLink>
                          </Link>
                        )}
                        {block.secondaryLink && (
                          <Link asChild color="muted" fontSize="sm" textDecoration="none">
                            <NextLink href={block.secondaryLink.href}>{block.secondaryLink.label}</NextLink>
                          </Link>
                        )}
                      </Stack>
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
