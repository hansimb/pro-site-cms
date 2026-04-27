"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { CaseStudy, Navigation, SiteSettings } from "@/lib/content/schema";
import { useDraftSectionValue } from "./use-draft-section-value";
import { shouldShowCaseStudies, shouldShowWriting } from "@/lib/content/visibility";

function filterNavigation(
  items: Navigation["items"],
  options: { showCaseStudies: boolean; showWriting: boolean },
) {
  return items.filter((item) => {
    if (item.href === "/case-studies") {
      return options.showCaseStudies;
    }

    if (item.href === "/writing") {
      return options.showWriting;
    }

    return true;
  });
}

function getBackgroundImage(settings: SiteSettings) {
  switch (settings.gradientStyle) {
    case "diagonal":
      return `linear-gradient(135deg, ${settings.gradientColor}22 0%, transparent 35%), linear-gradient(180deg, ${settings.backgroundColor} 0%, #050c16 100%)`;
    case "soft":
      return `radial-gradient(circle at 20% 0%, ${settings.gradientColor}33 0%, transparent 32rem), linear-gradient(180deg, ${settings.backgroundColor} 0%, #050c16 100%)`;
    default:
      return `radial-gradient(circle at top, ${settings.gradientColor}29 0%, transparent 32rem), linear-gradient(180deg, ${settings.backgroundColor} 0%, #050c16 100%)`;
  }
}

function getRadiusScale(settings: SiteSettings) {
  switch (settings.radiusStyle) {
    case "sharp":
      return {
        lg: "0.7rem",
        md: "0.45rem",
        pill: "0.85rem",
      };
    case "soft":
      return {
        lg: "1.6rem",
        md: "1.1rem",
        pill: "999px",
      };
    default:
      return {
        lg: "1.2rem",
        md: "0.9rem",
        pill: "999px",
      };
  }
}

function getTypography(settings: SiteSettings) {
  switch (settings.typographyStyle) {
    case "plain":
      return {
        body: "system-ui, sans-serif",
        display: "system-ui, sans-serif",
      };
    case "technical":
      return {
        body: "var(--font-sans), sans-serif",
        display: "ui-monospace, SFMono-Regular, Menlo, monospace",
      };
    default:
      return {
        body: "var(--font-sans), sans-serif",
        display: "var(--font-serif), serif",
      };
  }
}

export function SiteShell({
  children,
  initialArticles,
  initialCaseStudies,
  initialNavigation,
  initialSettings,
}: {
  children: ReactNode;
  initialArticles: ParsedArticle[];
  initialCaseStudies: CaseStudy[];
  initialNavigation: Navigation;
  initialSettings: SiteSettings;
}) {
  const settings = useDraftSectionValue("settings", initialSettings);
  const caseStudies = useDraftSectionValue("caseStudies", initialCaseStudies);
  const writing = useDraftSectionValue("writing", { articles: initialArticles, topics: [] });
  const articles = writing.articles ?? initialArticles;
  const visibleNavigation = filterNavigation(initialNavigation.items, {
    showCaseStudies: shouldShowCaseStudies(caseStudies.filter((entry) => entry.published)),
    showWriting: shouldShowWriting(articles.filter((entry) => entry.published)),
  });
  const radius = getRadiusScale(settings);
  const typography = getTypography(settings);
  const themeStyle = {
    "--accent": settings.accentColor,
    "--background": settings.backgroundColor,
    "--background-elevated": settings.surfaceColor,
    "--foreground": settings.textColor,
    "--muted": settings.mutedColor,
    "--site-background-image": getBackgroundImage(settings),
    "--radius-lg": radius.lg,
    "--radius-md": radius.md,
    "--radius-pill": radius.pill,
    "--font-body-family": typography.body,
    "--font-display-family": typography.display,
  } as CSSProperties;

  return (
    <div className="site-frame" style={themeStyle}>
      <div className="site-shell">
        <nav aria-label="Primary" className="site-nav">
          <Link className="site-brand" href="/">
            {settings.siteTitle}
          </Link>
          <div className="site-nav-links">
            {visibleNavigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/admin">Admin</Link>
          </div>
        </nav>

        {children}

        <footer className="footer">
          <span>{settings.footerText ?? settings.siteDescription}</span>
          <span>{settings.siteDescription}</span>
        </footer>
      </div>
    </div>
  );
}
