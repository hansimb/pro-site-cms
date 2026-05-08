"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

type ArticleBackButtonProps = {
  fallbackHref?: string;
  label?: string;
};

export function ArticleBackButton({
  fallbackHref = "/writing",
  label = "Back to writing",
}: ArticleBackButtonProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    const hasHistory = typeof window !== "undefined" && window.history.length > 1;

    if (hasHistory) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }, [fallbackHref, router]);

  return (
    <Button alignSelf="start" onClick={handleBack} size="sm" variant="ghost">
      ← {label}
    </Button>
  );
}
