import NextLink from "next/link";
import { Box, Grid, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

const interactivePanelProps = {
  position: "relative" as const,
  overflow: "hidden" as const,
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 220ms ease, background-color 220ms ease",
  _before: {
    content: '""',
    position: "absolute" as const,
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.022), transparent 40%, transparent 100%)",
    pointerEvents: "none" as const,
  },
  _after: {
    content: '""',
    position: "absolute" as const,
    top: "-1px",
    left: "-22%",
    width: "22%",
    height: "1px",
    transform: "none",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
    opacity: 0,
    pointerEvents: "none" as const,
  },
  _hover: {
    transform: "translateY(-2px)",
    borderColor: "rgba(255, 255, 255, 0.16)",
    boxShadow: "0 16px 28px rgba(0, 0, 0, 0.22)",
    _after: {
      opacity: 1,
      animation: "panel-border-glide 900ms cubic-bezier(0.22, 1, 0.36, 1)",
    },
  },
};

const linkHoverProps = {
  borderRadius: "control",
  px: 2,
  py: 1,
  marginInline: "-0.5rem",
  transition: "color 160ms ease, background-color 160ms ease",
  _hover: {
    color: "text",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
};

export default async function HomePage() {
  const site = await getSiteModel();
  const { hero, blocks } = site.homePage;

  return (
    <Stack gap={{ base: 14, md: 20 }} position="relative">
        <Stack gap={{ base: 8, md: 10 }}>
          <Stack gap={6} maxW="3xl">
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
              <Link asChild color="accent" fontSize="sm" textDecoration="none" {...linkHoverProps}>
                <NextLink href={hero.primaryLink.href}>{hero.primaryLink.label}</NextLink>
              </Link>
            )}
          </Stack>

          {hero.showFeatured && (
            <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}>
              <Box borderWidth="1px" borderColor="edge" bg="surface" p={{ base: 6, md: 7 }} rounded="panel" {...interactivePanelProps}>
                <Stack gap={3}>
                  <Heading as="h2" fontSize="md" letterSpacing="0">
                    Writing
                  </Heading>
                  <Text color="muted" fontSize="sm">
                    {site.articles.length} articles ready from the new content surface.
                  </Text>
                  <Link asChild color="accent" fontSize="sm" textDecoration="none" transition="color 160ms ease" _hover={{ color: "text" }}>
                    <NextLink href="/writing">Open writing</NextLink>
                  </Link>
                </Stack>
              </Box>
              <Box borderWidth="1px" borderColor="edge" bg="surface" p={{ base: 6, md: 7 }} rounded="panel" {...interactivePanelProps}>
                <Stack gap={3}>
                  <Heading as="h2" fontSize="md" letterSpacing="0">
                    Case studies
                  </Heading>
                  <Text color="muted" fontSize="sm">
                    {site.caseStudies.length} case studies ready from the new content surface.
                  </Text>
                  <Link asChild color="accent" fontSize="sm" textDecoration="none" transition="color 160ms ease" _hover={{ color: "text" }}>
                    <NextLink href="/case-studies">Open case studies</NextLink>
                  </Link>
                </Stack>
              </Box>
            </Grid>
          )}
        </Stack>

        {blocks.length > 0 && (
          <Stack gap={{ base: 10, md: 14 }}>
            {blocks.map((block, index) => {
              switch (block.blockType) {
                case "text":
                  return (
                    <Stack gap={4} key={`${block.blockType}-${index}`} maxW="3xl">
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
                      p={{ base: 6, md: 7 }}
                      rounded="panel"
                      {...interactivePanelProps}
                    >
                      <Stack gap={3} maxW="3xl">
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
                      {...interactivePanelProps}
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
                    <Stack gap={6} key={`${block.blockType}-${index}`}>
                      <Stack gap={3} maxW="3xl">
                        <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                          {block.heading}
                        </Heading>
                        {block.intro && (
                          <Text color="muted" lineHeight="1.8">
                            {block.intro}
                          </Text>
                        )}
                      </Stack>
                      <Grid gap={{ base: 5, md: 6 }} templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}>
                        {block.items.map((item, itemIndex) => (
                          <Box
                            key={`${item.title}-${itemIndex}`}
                            borderWidth="1px"
                            borderColor="edge"
                            bg="surface"
                            p={{ base: 6, md: 7 }}
                            rounded="panel"
                            {...interactivePanelProps}
                          >
                            <Stack gap={3}>
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
                    <Stack gap={6} key={`${block.blockType}-${index}`}>
                      <Stack gap={3} maxW="3xl">
                        <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                          {block.heading}
                        </Heading>
                        {block.intro && (
                          <Text color="muted" lineHeight="1.8">
                            {block.intro}
                          </Text>
                        )}
                      </Stack>
                      <Stack gap={6}>
                        {block.items.map((item, itemIndex) => (
                        <Box
                          key={`${item.period}-${item.title}-${itemIndex}`}
                          borderLeftWidth="1px"
                          borderColor="edge"
                          pl={{ base: 5, md: 6 }}
                            position="relative"
                            _before={{
                              content: '""',
                              position: "absolute",
                              left: "-5px",
                              top: "0.6rem",
                              width: "9px",
                              height: "9px",
                              borderRadius: "999px",
                              bg: "accent",
                              opacity: 0.96,
                              boxShadow: "0 0 0 2px rgba(0, 255, 136, 0.1), 0 0 14px rgba(0, 255, 136, 0.28)",
                              animationName: "timeline-flow",
                              animationDuration: `${Math.max(block.items.length, 1) * 0.78}s`,
                              animationTimingFunction: "linear",
                              animationIterationCount: "infinite",
                              animationDelay: `${itemIndex * 0.78}s`,
                            }}
                          >
                            <Stack gap={2} py={1}>
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
                      p={{ base: 6, md: 8 }}
                      rounded="panel"
                    >
                      <Stack gap={5} maxW="3xl">
                        <Stack gap={3}>
                          <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                            {block.heading}
                          </Heading>
                          <Text color="muted" lineHeight="1.8">
                            {block.body}
                          </Text>
                        </Stack>
                        <Stack direction={{ base: "column", md: "row" }} gap={3}>
                          {block.primaryLink && (
                            <Link asChild color="accent" fontSize="sm" textDecoration="none" {...linkHoverProps}>
                              <NextLink href={block.primaryLink.href}>{block.primaryLink.label}</NextLink>
                            </Link>
                          )}
                          {block.secondaryLink && (
                            <Link asChild color="muted" fontSize="sm" textDecoration="none" {...linkHoverProps}>
                              <NextLink href={block.secondaryLink.href}>{block.secondaryLink.label}</NextLink>
                            </Link>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  );

                case "featuredCaseStudies":
                  return (
                    <Stack gap={6} key={`${block.blockType}-${index}`}>
                      <Stack gap={3} maxW="3xl">
                        <Heading as="h2" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0">
                          {block.heading}
                        </Heading>
                        {block.intro && (
                          <Text color="muted" lineHeight="1.8">
                          {block.intro}
                        </Text>
                      )}
                    </Stack>
                    <Grid
                      gap={{ base: 5, md: 6 }}
                      templateColumns={{
                        base: "1fr",
                        md:
                          block.items.length === 3
                            ? "repeat(3, minmax(0, 1fr))"
                            : "repeat(2, minmax(0, 1fr))",
                      }}
                    >
                      {block.items.map((item) => (
                        <Box
                          borderWidth="1px"
                            borderColor="edge"
                            bg="surface"
                            key={item.href}
                            p={{ base: 6, md: 7 }}
                            rounded="panel"
                            {...interactivePanelProps}
                          >
                            <Stack gap={3}>
                              <Heading as="h3" fontSize="md" letterSpacing="0">
                                <Link asChild textDecoration="none" transition="color 160ms ease" _hover={{ color: "accent" }}>
                                  <NextLink href={item.href}>{item.title}</NextLink>
                                </Link>
                              </Heading>
                              <Text color="muted" fontSize="sm" lineHeight="1.8">
                                {item.summary}
                              </Text>
                              <Link asChild color="accent" fontSize="sm" textDecoration="none" transition="color 160ms ease" _hover={{ color: "text" }}>
                                <NextLink href={item.href}>Open case study</NextLink>
                              </Link>
                            </Stack>
                          </Box>
                        ))}
                      </Grid>
                    </Stack>
                  );

                case "linkList":
                  return (
                    <Box
                      key={`${block.blockType}-${index}`}
                      borderWidth="1px"
                      borderColor="edge"
                      bg="surface"
                      p={{ base: 6, md: 7 }}
                      rounded="panel"
                      {...interactivePanelProps}
                    >
                      <Stack gap={4}>
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
                              {...linkHoverProps}
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
