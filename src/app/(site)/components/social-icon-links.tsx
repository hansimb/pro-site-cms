"use client";

import NextLink from "next/link";
import { Flex, IconButton, Link } from "@chakra-ui/react";

function GithubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
      <path d="M12 2a10 10 0 0 0-3.162 19.49c.5.092.683-.216.683-.48 0-.236-.008-.862-.013-1.692-2.782.605-3.37-1.18-3.37-1.18-.454-1.154-1.11-1.462-1.11-1.462-.908-.621.07-.608.07-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.34 1.087 2.91.832.091-.647.35-1.087.637-1.337-2.221-.253-4.556-1.11-4.556-4.942 0-1.091.39-1.984 1.029-2.683-.103-.254-.446-1.275.097-2.658 0 0 .84-.269 2.75 1.025a9.554 9.554 0 0 1 5.006 0c1.908-1.294 2.747-1.025 2.747-1.025.545 1.383.202 2.404.1 2.658.64.699 1.028 1.592 1.028 2.683 0 3.841-2.339 4.686-4.567 4.934.359.309.679.919.679 1.852 0 1.337-.012 2.416-.012 2.745 0 .267.18.577.688.479A10.002 10.002 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm4.16 5.5H12.6v1.57h.05c.44-.83 1.51-1.7 3.11-1.7 3.32 0 3.94 2.18 3.94 5.01V20h-3.38v-5.82c0-1.39-.03-3.18-1.94-3.18-1.94 0-2.24 1.52-2.24 3.08V20H9.4V8.5Z" />
    </svg>
  );
}

type SocialIconLinksProps = {
  githubUrl?: string;
  linkedinUrl?: string;
  size?: "xs" | "sm";
};

export function SocialIconLinks({
  githubUrl,
  linkedinUrl,
  size = "sm",
}: SocialIconLinksProps) {
  if (!githubUrl && !linkedinUrl) {
    return null;
  }

  return (
    <Flex align="center" gap={1}>
      {githubUrl && (
        <Link asChild>
          <NextLink href={githubUrl} rel="noreferrer" target="_blank">
            <IconButton aria-label="Open GitHub profile" color="muted" size={size} variant="ghost">
              <GithubIcon />
            </IconButton>
          </NextLink>
        </Link>
      )}
      {linkedinUrl && (
        <Link asChild>
          <NextLink href={linkedinUrl} rel="noreferrer" target="_blank">
            <IconButton aria-label="Open LinkedIn profile" color="muted" size={size} variant="ghost">
              <LinkedinIcon />
            </IconButton>
          </NextLink>
        </Link>
      )}
    </Flex>
  );
}
