import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const heroBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  visible: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  primaryLink: linkSchema.optional(),
  secondaryLink: linkSchema.optional(),
});

const richTextBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("richText"),
  visible: z.boolean(),
  title: z.string().min(1).optional(),
  body: z.string().min(1),
});

const quoteBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("quote"),
  visible: z.boolean(),
  quote: z.string().min(1),
  attribution: z.string().min(1).optional(),
});

const linksBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("links"),
  visible: z.boolean(),
  title: z.string().min(1),
  items: z.array(linkSchema),
});

const featuredArticlesBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("featuredArticles"),
  visible: z.boolean(),
  title: z.string().min(1),
  intro: z.string().optional(),
  limit: z.number().int().min(1).max(12).default(3),
});

const featuredCaseStudiesBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("featuredCaseStudies"),
  visible: z.boolean(),
  title: z.string().min(1),
  intro: z.string().optional(),
  limit: z.number().int().min(1).max(12).default(3),
});

const timelineItemSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  period: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

const timelineBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("timeline"),
  visible: z.boolean(),
  title: z.string().min(1),
  items: z.array(timelineItemSchema),
});

const contactCtaBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("contactCta"),
  visible: z.boolean(),
  title: z.string().min(1),
  body: z.string().min(1),
  link: linkSchema,
});

const imageBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("image"),
  visible: z.boolean(),
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

const textBoxBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("textBox"),
  visible: z.boolean(),
  title: z.string().optional(),
  body: z.string().min(1),
  tone: z.enum(["default", "muted", "accent"]).default("default"),
});

export const homeBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  richTextBlockSchema,
  quoteBlockSchema,
  linksBlockSchema,
  featuredArticlesBlockSchema,
  featuredCaseStudiesBlockSchema,
  timelineBlockSchema,
  contactCtaBlockSchema,
  imageBlockSchema,
  textBoxBlockSchema,
]);

export const homeDocumentSchema = z.object({
  blocks: z.array(homeBlockSchema),
});

export const caseStudySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  background: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  process: z.string().min(1),
  results: z.string().min(1),
  links: z.array(linkSchema),
  tags: z.array(z.string().min(1)),
  published: z.boolean(),
  featured: z.boolean().default(false),
});

export const caseStudyIndexSchema = z.object({
  items: z.array(caseStudySchema),
});

export const writingTopicSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  published: z.boolean(),
});

export const writingTopicsSchema = z.object({
  topics: z.array(writingTopicSchema),
});

export const articleReferenceSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

export const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  topic: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1),
  published: z.boolean(),
  featured: z.boolean().default(false),
  references: z.array(articleReferenceSchema),
});

export const articleDocumentSchema = articleFrontmatterSchema.extend({
  body: z.string().min(1),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#07111f"),
  gradientColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#7ee081"),
  gradientStyle: z.enum(["radial", "diagonal", "soft"]).default("radial"),
  surfaceColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#122036"),
  textColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#f5f7fb"),
  mutedColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#aeb7c6"),
  typographyStyle: z.enum(["editorial", "technical", "plain"]).default("editorial"),
  radiusStyle: z.enum(["sharp", "balanced", "soft"]).default("balanced"),
  footerText: z.string().min(1).optional(),
});

export const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const navigationSchema = z.object({
  items: z.array(navigationItemSchema),
});

export type HomeBlock = z.infer<typeof homeBlockSchema>;
export type HomeDocument = z.infer<typeof homeDocumentSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type CaseStudyIndex = z.infer<typeof caseStudyIndexSchema>;
export type WritingTopic = z.infer<typeof writingTopicSchema>;
export type WritingTopics = z.infer<typeof writingTopicsSchema>;
export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type ArticleDocument = z.infer<typeof articleDocumentSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
