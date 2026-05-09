import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { ContactModalTrigger } from "./contact-actions";

export function ArticleFeedbackCta() {
  return (
    <Box
      bg="surfaceRaised"
      borderColor="edge"
      borderWidth="1px"
      maxW="4xl"
      p={{ base: 5, md: 6 }}
      rounded="panel"
    >
      <Stack gap={3}>
        <Heading as="h2" fontSize="lg" letterSpacing="0">
          Any thoughts or feedback?
        </Heading>
        <Text color="muted" lineHeight="1.8">
          Send me a message and let&apos;s discuss. Go ahead, prove me wrong.
        </Text>
        <ContactModalTrigger
          alignSelf="start"
          color="accent"
          fontSize="sm"
          label="Contact"
        />
      </Stack>
    </Box>
  );
}
