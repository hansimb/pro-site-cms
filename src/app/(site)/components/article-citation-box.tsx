"use client";

import { useState } from "react";
import { Box, Button, Code, Stack, Text } from "@chakra-ui/react";

type ArticleCitationBoxProps = {
  citation: string;
};

export function ArticleCitationBox({ citation }: ArticleCitationBoxProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Box
      borderColor="border"
      borderRadius="xl"
      borderWidth="1px"
      maxW="4xl"
      p={{ base: 4, md: 5 }}
    >
      <Stack gap={3}>
        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
          Cite this analysis
        </Text>
        <Code
          display="block"
          fontSize="sm"
          lineHeight="1.7"
          p={4}
          whiteSpace="pre-wrap"
        >
          {citation}
        </Code>
        <Button
          alignSelf="start"
          color={copied ? "accent" : "text"}
          onClick={handleCopy}
          size="sm"
          variant="outline"
        >
          {copied ? "Copied" : "Copy citation"}
        </Button>
      </Stack>
    </Box>
  );
}
