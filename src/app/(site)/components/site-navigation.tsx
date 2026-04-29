"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Flex, Link } from "@chakra-ui/react";
import type { SiteNavigationItem } from "@/features/site/data/payload-site";

interface SiteNavigationProps {
  navigation: SiteNavigationItem[];
}

export function SiteNavigation({ navigation }: SiteNavigationProps) {
  const pathname = usePathname();

  return (
    <Flex align="center" gap={{ base: 3, md: 5 }} wrap="wrap">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            asChild
            color={isActive ? "accent" : "muted"}
            fontSize="sm"
            key={item.href}
            textDecoration="none"
            _hover={{ color: "accent" }}
          >
            <NextLink href={item.href}>{item.label}</NextLink>
          </Link>
        );
      })}
    </Flex>
  );
}
