import type { ReactNode } from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Newsreader } from "next/font/google";
import { Box, Container, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { getSiteModel } from "@/features/site/data/payload-site";
import { buildSiteMetadata } from "@/features/site/metadata";
import { SiteThemeProvider } from "@/features/site/theme/provider";
import {
  ContactModalProvider,
  ContactModalTrigger,
} from "./components/contact-actions";
import { CopyEmailButton } from "./components/copy-email-button";
import { MobileNav } from "./components/mobile-nav";
import { SiteNavigation } from "./components/site-navigation";
import { SocialIconLinks } from "./components/social-icon-links";
import { ScrollToTopFloatingButton } from "./components/scroll-to-top-floating-button";
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

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteModel();

  return buildSiteMetadata(site);
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const site = await getSiteModel();

  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SiteThemeProvider>
          <ContactModalProvider
            email={site.settings.contact.email}
            linkedinUrl={site.settings.contact.linkedinUrl}
          >
            <Box
              minH="100vh"
              bg="canvas"
              color="text"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-4rem",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
                height: { base: "42rem", md: "48rem" },
                background:
                  "radial-gradient(72% 62% at 18% 10%, rgba(0, 255, 136, 0.14) 0%, rgba(0, 255, 136, 0.08) 34%, rgba(0, 255, 136, 0.035) 56%, transparent 76%), radial-gradient(46% 42% at 82% 10%, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.038) 42%, transparent 74%)",
                filter: "blur(28px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
              _after={{
                content: '""',
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
                height: { base: "28rem", md: "34rem" },
                background:
                  "radial-gradient(44% 34% at 50% 0%, rgba(255,255,255,0.022) 0%, transparent 78%)",
                filter: "blur(24px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <Container
                maxW="6xl"
                px={{ base: 4, md: 6 }}
                py={{ base: 4, md: 6 }}
                position="relative"
                zIndex={1}
              >
                <Flex
                  as="nav"
                  align="center"
                  borderBottomWidth="1px"
                  borderColor="edge"
                  gap={{ base: 3, md: 6 }}
                  justify="space-between"
                  pb={4}
                  wrap="nowrap"
                >
                  <Link
                    asChild
                    color="text"
                    css={{ WebkitTapHighlightColor: "transparent" }}
                    fontSize="sm"
                    fontWeight="700"
                    letterSpacing="0"
                    textDecoration="none"
                    flex="1 1 auto"
                    minW={0}
                    _focus={{ boxShadow: "none", outline: "none" }}
                    _focusVisible={{ boxShadow: "none", outline: "none" }}
                  >
                    <NextLink href="/">
                      <Box
                        as="span"
                        display="inline-block"
                        lineHeight="1.15"
                        maxW="100%"
                      >
                        <Box as="span" display="block">
                          {site.settings.siteTitle}
                        </Box>
                        {site.settings.siteSubtitle && (
                          <Text
                            as="span"
                            color="muted"
                            display="block"
                            fontSize={{ base: "10px", md: "xs" }}
                            fontWeight="400"
                            mt="1"
                            pr={{ base: 2, md: 0 }}
                          >
                            {site.settings.siteSubtitle}
                          </Text>
                        )}
                      </Box>
                    </NextLink>
                  </Link>
                  <Flex
                    align="center"
                    display={{ base: "none", md: "flex" }}
                    gap={4}
                  >
                    <SiteNavigation navigation={site.navigation} />
                    <ContactModalTrigger />
                    <SocialIconLinks
                      githubUrl={site.settings.contact.githubUrl}
                      linkedinUrl={site.settings.contact.linkedinUrl}
                    />
                  </Flex>
                  <Flex
                    align="center"
                    display={{ base: "flex", md: "none" }}
                    gap={1}
                  >
                    <SocialIconLinks
                      githubUrl={site.settings.contact.githubUrl}
                      linkedinUrl={site.settings.contact.linkedinUrl}
                      size="xs"
                    />
                    <MobileNav navigation={site.navigation} />
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
                  gap={4}
                  justify="space-between"
                  pt={4}
                  wrap={{ base: "wrap", md: "nowrap" }}
                >
                  <Stack gap={2}>
                    <Text>{site.settings.siteDescription}</Text>
                    {site.settings.contact.email && (
                      <Flex align="center" gap={2}>
                        <Text color="text">{site.settings.contact.email}</Text>
                        <CopyEmailButton
                          email={site.settings.contact.email}
                          iconOnly
                        />
                      </Flex>
                    )}
                  </Stack>
                  <Text>Payload + Neon</Text>
                </Flex>
                <ScrollToTopFloatingButton />
              </Container>
            </Box>
          </ContactModalProvider>
        </SiteThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
