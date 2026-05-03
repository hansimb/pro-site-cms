"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  Flex,
  IconButton,
  Link,
  Portal,
  Stack,
} from "@chakra-ui/react";
import type { SiteNavigationItem } from "@/features/site/data/payload-site";
import { ContactModalTrigger } from "./contact-actions";

function MenuIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

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

type MobileNavProps = {
  navigation: SiteNavigationItem[];
};

export function MobileNav({ navigation }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root
      lazyMount
      onOpenChange={(details) => setOpen(details.open)}
      open={open}
      placement="end"
    >
      <Drawer.Trigger asChild>
        <IconButton
          aria-label="Open menu"
          color="white"
          display={{ base: "inline-flex", md: "none" }}
          size="md"
          variant="ghost"
        >
          <MenuIcon />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop bg="rgba(3, 3, 3, 0.7)" />
        <Drawer.Positioner>
          <Drawer.Content
            bg="surface"
            borderColor="edge"
            borderLeftWidth="1px"
            maxW="xs"
          >
            <Drawer.Header alignItems="center" display="flex" justifyContent="space-between">
              <Drawer.Title>Menu</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton aria-label="Close menu" color="white" size="sm" variant="ghost">
                  <CloseIcon />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap={5}>
                <Stack gap={3}>
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                      <Link
                        asChild
                        color={isActive ? "accent" : "text"}
                        fontSize="sm"
                        key={item.href}
                        onClick={() => setOpen(false)}
                        textDecoration="none"
                        _hover={{ color: "accent" }}
                      >
                        <NextLink href={item.href}>{item.label}</NextLink>
                      </Link>
                    );
                  })}
                </Stack>
                <Flex>
                  <ContactModalTrigger color="text" label="Contact" />
                </Flex>
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
