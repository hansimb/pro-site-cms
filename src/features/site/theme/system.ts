import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const siteThemeConfig = defineConfig({
  globalCss: {
    html: {
      colorPalette: "accent",
    },
    body: {
      bg: "canvas",
      color: "text",
      letterSpacing: "0",
    },
    "::selection": {
      bg: "accent",
      color: "black",
    },
  },
  theme: {
    tokens: {
      colors: {
        accent: { value: "#00ff88" },
        canvas: { value: "#030303" },
        edge: { value: "#262626" },
        muted: { value: "#9a9a9a" },
        surface: { value: "#0a0a0a" },
        surfaceRaised: { value: "#111111" },
        text: { value: "#f4f4f4" },
      },
      fonts: {
        body: { value: "var(--font-sans), sans-serif" },
        heading: { value: "var(--font-sans), sans-serif" },
      },
      radii: {
        panel: { value: "4px" },
        control: { value: "3px" },
        sharp: { value: "0" },
      },
      spacing: {
        page: { value: "clamp(1rem, 2vw, 1.5rem)" },
      },
    },
  },
});

export const siteSystem = createSystem(defaultConfig, siteThemeConfig);
