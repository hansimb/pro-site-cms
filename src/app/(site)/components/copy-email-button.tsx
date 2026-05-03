"use client";

import { useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path
        d="M9 9h10v10H9z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M5 15V5h10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

type CopyEmailButtonProps = {
  email: string;
  iconOnly?: boolean;
};

export function CopyEmailButton({
  email,
  iconOnly = false,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (iconOnly) {
    return (
      <IconButton
        aria-label={copied ? "Email copied" : "Copy email"}
        color={copied ? "accent" : "muted"}
        onClick={handleCopy}
        size="xs"
        variant="ghost"
      >
        <CopyIcon />
      </IconButton>
    );
  }

  return (
    <Button color={copied ? "accent" : "text"} onClick={handleCopy} size="sm" variant="outline">
      {copied ? "Copied" : "Copy email"}
    </Button>
  );
}
