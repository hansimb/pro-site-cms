"use client";

import { Box, Popover, Portal, Stack, Text } from "@chakra-ui/react";

function InfoGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
    >
      <circle
        cx="8"
        cy="8"
        r="6.25"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <path
        d="M8 6.3V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="4.6" fill="currentColor" r="0.8" />
    </svg>
  );
}

type StatDetailsTooltipProps = {
  details: string[];
  label: string;
};

export function StatDetailsTooltip({
  details,
  label,
}: StatDetailsTooltipProps) {
  if (details.length === 0) {
    return null;
  }

  return (
    <Popover.Root lazyMount positioning={{ placement: "top-start" }}>
      <Popover.Trigger asChild>
        <Box
          aria-label={`${label}. Included repositories: ${details.join(", ")}`}
          as="button"
          color="fg.subtle"
          cursor="help"
          display="inline-flex"
          h="16px"
          justifyContent="center"
          ml={2}
          transition="color 160ms ease, opacity 160ms ease"
          verticalAlign="middle"
          w="16px"
          _focusVisible={{
            outline: "none",
            color: "fg.default",
            boxShadow: "0 0 0 3px rgba(0, 255, 136, 0.08)",
            borderRadius: "999px",
          }}
          _hover={{
            color: "fg.default",
            opacity: 0.9,
          }}
        >
          <InfoGlyph />
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            bg="rgba(12, 12, 12, 0.98)"
            borderColor="rgba(255, 255, 255, 0.12)"
            borderRadius="16px"
            borderWidth="1px"
            boxShadow="0 18px 50px rgba(0, 0, 0, 0.45)"
            color="fg.default"
            maxW="320px"
            px={3.5}
            py={3.5}
          >
            <Popover.Body p={0}>
              <Stack gap={2}>
              <Box
                color="fg.default"
                fontSize="xs"
                fontWeight="700"
                lineHeight="1.5"
              >
                Included personal projects deployed to production:
              </Box>
              <Stack gap={1}>
                {details.map((detail) => (
                  <Text
                    as="div"
                    color="fg.muted"
                    fontFamily="mono"
                    fontSize="xs"
                    key={detail}
                    lineHeight="1.5"
                  >
                    {detail}
                  </Text>
                ))}
              </Stack>
              </Stack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
