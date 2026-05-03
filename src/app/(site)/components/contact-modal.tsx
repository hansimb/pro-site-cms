"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Link,
  Portal,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CopyEmailButton } from "./copy-email-button";

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export type ContactModalProps = {
  email?: string;
  linkedinUrl?: string;
  onClose: () => void;
  open: boolean;
};

export function ContactModal({
  email,
  linkedinUrl,
  onClose,
  open,
}: ContactModalProps) {
  return (
    <Dialog.Root
      lazyMount
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      open={open}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(3, 3, 3, 0.76)" />
        <Dialog.Positioner px={4}>
          <Dialog.Content
            bg="surfaceRaised"
            borderColor="edge"
            borderWidth="1px"
            maxW="md"
            rounded="panel"
          >
            <Dialog.Header
              alignItems="flex-start"
              display="flex"
              justifyContent="space-between"
              gap={4}
            >
              <Stack gap={1}>
                <Dialog.Title>Contact</Dialog.Title>
                <Text color="muted" fontSize="sm">
                  Reach out directly or copy the address for later.
                </Text>
              </Stack>
              <Dialog.CloseTrigger asChild>
                <IconButton
                  aria-label="Close contact modal"
                  color="white"
                  flexShrink={0}
                  size="sm"
                  variant="ghost"
                >
                  <CloseIcon />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <Stack gap={5}>
                {email && (
                  <Box
                    bg="surface"
                    borderColor="edge"
                    borderWidth="1px"
                    p={4}
                    rounded="panel"
                  >
                    <Stack gap={3}>
                      <Text color="accent" fontSize="xs" fontWeight="700" textTransform="uppercase">
                        Send email
                      </Text>
                      <Text color="text" fontSize="md">
                        {email}
                      </Text>
                      <Stack direction={{ base: "column", sm: "row" }} gap={3}>
                        <CopyEmailButton email={email} />
                        <Button asChild size="sm" variant="subtle">
                          <NextLink href={`mailto:${email}`}>Open email app</NextLink>
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                )}
                {email && linkedinUrl && <Separator borderColor="edge" />}
                {linkedinUrl && (
                  <Box
                    bg="surface"
                    borderColor="edge"
                    borderWidth="1px"
                    p={4}
                    rounded="panel"
                  >
                    <Stack gap={3}>
                      <Text color="accent" fontSize="xs" fontWeight="700" textTransform="uppercase">
                        Contact on LinkedIn
                      </Text>
                      <Text color="muted" fontSize="sm" lineHeight="1.7">
                        If LinkedIn is the better context, you can also reach out there directly.
                      </Text>
                      <Link
                        asChild
                        color="accent"
                        fontSize="sm"
                        textDecoration="none"
                        _hover={{ color: "text" }}
                      >
                        <NextLink href={linkedinUrl} rel="noreferrer" target="_blank">
                          Open LinkedIn
                        </NextLink>
                      </Link>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
