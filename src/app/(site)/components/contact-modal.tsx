"use client";

import NextLink from "next/link";
import {
  Button,
  Dialog,
  Link,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CopyEmailButton } from "./copy-email-button";

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
            <Dialog.Header>
              <Stack gap={1}>
                <Dialog.Title>Contact</Dialog.Title>
                <Text color="muted" fontSize="sm">
                  Reach out directly or copy the address for later.
                </Text>
              </Stack>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <Stack gap={5}>
                {email && (
                  <Stack gap={3}>
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
                )}
                {linkedinUrl && (
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
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
