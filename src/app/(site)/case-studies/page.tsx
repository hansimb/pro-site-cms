import NextLink from "next/link";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";

export default async function CaseStudiesPage() {
  const site = await getSiteModel();

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="2xl">
        <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0">
          Case studies
        </Heading>
        <Text color="muted">Project writeups will be managed from Payload once content is added.</Text>
      </Stack>

      <Stack gap={3}>
        {site.caseStudies.length === 0 ? (
          <Box borderWidth="1px" borderColor="edge" color="muted" p={5} rounded="panel">
            No case studies yet.
          </Box>
        ) : (
          site.caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.href}
              asChild
              color="text"
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
            >
              <NextLink href={caseStudy.href}>
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
                    {caseStudy.title}
                  </Heading>
                  <Text color="muted" fontSize="sm">
                    {caseStudy.summary}
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
