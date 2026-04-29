import type { ReactNode } from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Manrope, Newsreader } from "next/font/google";
import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";
import { SiteThemeProvider } from "@/features/site/theme/provider";
import "../globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Pro Site CMS",
    template: "%s | Pro Site CMS",
  },
  description: "A dark, modern Payload CMS site powered by Neon Postgres.",
};

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const site = await getSiteModel();

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        <SiteThemeProvider>
          <Box minH="100vh" bg="canvas" color="text">
            <Container maxW="6xl" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <Flex
                as="nav"
                align="center"
                borderBottomWidth="1px"
                borderColor="edge"
                gap={6}
                justify="space-between"
                pb={4}
              >
                <Link asChild color="text" fontSize="sm" fontWeight="700" letterSpacing="0" textDecoration="none">
                  <NextLink href="/">{site.settings.siteTitle}</NextLink>
                </Link>
                <Flex align="center" gap={{ base: 3, md: 5 }} wrap="wrap">
                  {site.navigation.map((item) => (
                    <Link
                      asChild
                      color="muted"
                      fontSize="sm"
                      key={item.href}
                      textDecoration="none"
                      _hover={{ color: "accent" }}
                    >
                      <NextLink href={item.href}>{item.label}</NextLink>
                    </Link>
                  ))}
                  <Link asChild color="accent" fontSize="sm" textDecoration="none">
                    <NextLink href="/admin">Admin</NextLink>
                  </Link>
                </Flex>
              </Flex>

              <Box as="main" py={{ base: 10, md: 14 }}>
                {children}
              </Box>

              <Flex
                as="footer"
                borderTopWidth="1px"
                borderColor="edge"
                color="muted"
                fontSize="sm"
                justify="space-between"
                pt={4}
              >
                <Text>{site.settings.siteDescription}</Text>
                <Text>Payload + Neon</Text>
              </Flex>
            </Container>
          </Box>
        </SiteThemeProvider>
      </body>
    </html>
  );
}
