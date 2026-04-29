"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { siteSystem } from "./system";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={siteSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange enableSystem={false} forcedTheme="dark">
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
