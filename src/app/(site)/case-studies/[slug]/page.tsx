import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Box, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { getCaseStudyBySlug } from "@/features/site/data/payload-site";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const caseStudy = await getCaseStudyBySlug(decodedSlug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <Stack gap={6}>
      <Stack gap={3} maxW="4xl">
        <Button asChild variant="ghost" alignSelf="start" size="sm">
          <NextLink href="/case-studies">← Back to Case Studies</NextLink>
        </Button>
        <Heading as="h1" fontSize={{ base: "xl", md: "3xl" }} letterSpacing="0">
          {caseStudy.title}
        </Heading>
        <Text color="muted" fontSize="lg">
          {caseStudy.summary}
        </Text>
      </Stack>

      <Box maxW="4xl">
        {/* TODO: Render rich text content */}
        <Text color="muted">
          Case study content rendering will be implemented.
        </Text>
      </Box>

      {caseStudy.tags && caseStudy.tags.length > 0 && (
        <Stack gap={2} maxW="4xl">
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            Tags
          </Heading>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {caseStudy.tags.map((tag) => (
              <Box
                key={tag.id}
                px={3}
                py={1}
                bg="accent"
                color="accent.fg"
                rounded="md"
                fontSize="sm"
              >
                {tag.label}
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      {caseStudy.links && caseStudy.links.length > 0 && (
        <Stack gap={3} maxW="4xl">
          <Heading as="h2" fontSize="lg" letterSpacing="0">
            Links
          </Heading>
          <Stack gap={2}>
            {caseStudy.links.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                justifyContent="start"
              >
                <NextLink
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </NextLink>
              </Button>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
