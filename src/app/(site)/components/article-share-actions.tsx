"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button, HStack, Stack, Text } from "@chakra-ui/react";

type ArticleShareActionsProps = {
  articleUrl: string;
  title: string;
};

export function ArticleShareActions({
  articleUrl,
  title,
}: ArticleShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);
  const xHref = `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Stack gap={3} maxW="4xl">
      <Text color="muted" fontSize="sm" fontWeight="semibold" textTransform="uppercase">
        Share
      </Text>
      <HStack align="stretch" flexWrap="wrap" gap={3}>
        <Button asChild size="sm" variant="outline">
          <NextLink href={xHref} rel="noopener noreferrer" target="_blank">
            Share on X
          </NextLink>
        </Button>
        <Button asChild size="sm" variant="outline">
          <NextLink href={linkedinHref} rel="noopener noreferrer" target="_blank">
            Share on LinkedIn
          </NextLink>
        </Button>
        <Button
          color={copied ? "accent" : "text"}
          onClick={handleCopy}
          size="sm"
          variant="outline"
        >
          {copied ? "Copied" : "Copy link"}
        </Button>
      </HStack>
    </Stack>
  );
}
