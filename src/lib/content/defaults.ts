import type {
  CaseStudyIndex,
  HomeDocument,
  Navigation,
  SiteSettings,
  WritingTopics,
} from "./schema";

export const defaultHomeDocument: HomeDocument = {
  blocks: [
    {
      id: "hero-1",
      type: "hero",
      visible: true,
      eyebrow: "Strategy, systems, and writing",
      heading: "A thoughtful digital home for analytical work.",
      body: "This starter is designed for a modern personal site with structured writing, carefully framed work, and a flexible home page.",
      primaryLink: {
        label: "Explore writing",
        href: "/writing",
      },
      secondaryLink: {
        label: "See case studies",
        href: "/case-studies",
      },
    },
    {
      id: "text-box-1",
      type: "textBox",
      visible: true,
      title: "System premise",
      body: "Keep the experience dark, calm, fast, and driven by content rather than templates that force filler.",
      tone: "accent",
    },
  ],
};

export const defaultCaseStudyIndex: CaseStudyIndex = {
  items: [],
};

export const defaultWritingTopics: WritingTopics = {
  topics: [
    {
      slug: "business-economics",
      title: "Business & Economics",
      description: "Analytical writing on incentives, markets, strategy, and institutions.",
      published: true,
    },
    {
      slug: "tech",
      title: "Tech",
      description: "Essays and notes on software, systems, and technical judgment.",
      published: true,
    },
  ],
};

export const defaultSiteSettings: SiteSettings = {
  siteTitle: "Pro Site CMS",
  siteDescription: "A dark editorial starter for a professional personal site.",
  accentColor: "#7ee081",
  backgroundColor: "#07111f",
  gradientColor: "#7ee081",
  gradientStyle: "radial",
  surfaceColor: "#122036",
  textColor: "#f5f7fb",
  mutedColor: "#aeb7c6",
  typographyStyle: "editorial",
  radiusStyle: "balanced",
  footerText: "Built with intent.",
};

export const defaultNavigation: Navigation = {
  items: [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Writing", href: "/writing" },
  ],
};
