"use client";

import { useEffect, useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M12 18V6M12 6l-5 5M12 6l5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function shouldShowScrollToTop() {
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollBottom = window.scrollY + viewportHeight;
  const revealOffset = Math.min(220, viewportHeight * 0.2);

  return scrollBottom >= documentHeight - revealOffset;
}

export function ScrollToTopFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(shouldShowScrollToTop());

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Box
      bottom={4}
      display={{ base: "block", md: "none" }}
      pointerEvents={visible ? "auto" : "none"}
      position="fixed"
      right={4}
      zIndex={20}
    >
      <IconButton
        aria-label="Go to top"
        bg="rgba(12, 12, 12, 0.92)"
        borderColor="rgba(255, 255, 255, 0.1)"
        borderWidth="1px"
        boxShadow="0 12px 28px rgba(0, 0, 0, 0.35)"
        color="white"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        opacity={visible ? 1 : 0}
        size="md"
        transform={visible ? "translateY(0)" : "translateY(8px)"}
        transition="opacity 180ms ease, transform 180ms ease, background-color 160ms ease"
        variant="ghost"
        _hover={{ bg: "rgba(18, 18, 18, 0.98)" }}
      >
        <ArrowUpIcon />
      </IconButton>
    </Box>
  );
}
