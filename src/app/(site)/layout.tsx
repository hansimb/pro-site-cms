import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  getNavigation,
  getPublishedArticles,
  getPublishedCaseStudies,
  getSiteSettings,
} from "@/lib/content/loaders";
import { shouldShowCaseStudies, shouldShowWriting } from "@/lib/content/visibility";

function filterNavigation(
  items: Awaited<ReturnType<typeof getNavigation>>["items"],
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

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [siteSettings, navigation, articles, caseStudies] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getPublishedArticles(),
    getPublishedCaseStudies(),
  ]);

  const visibleNavigation = filterNavigation(navigation.items, {
    showCaseStudies: shouldShowCaseStudies(caseStudies),
    showWriting: shouldShowWriting(articles),
  });

  const themeStyle = {
    "--accent": siteSettings.accentColor,
  } as CSSProperties;

  return (
    <div className="site-frame" style={themeStyle}>
      <div className="site-shell">
        <nav aria-label="Primary" className="site-nav">
          <Link className="site-brand" href="/">
            {siteSettings.siteTitle}
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
          <span>{siteSettings.footerText ?? siteSettings.siteDescription}</span>
          <span>{siteSettings.siteDescription}</span>
        </footer>
      </div>
    </div>
  );
}
