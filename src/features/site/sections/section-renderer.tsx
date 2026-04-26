import type { ParsedArticle } from "@/lib/content/article-frontmatter";
import type { CaseStudy, HomeBlock } from "@/lib/content/schema";
import { ContactCtaSection } from "./contact-cta-section";
import { FeaturedArticlesSection } from "./featured-articles-section";
import { FeaturedCaseStudiesSection } from "./featured-case-studies-section";
import { HeroSection } from "./hero-section";
import { ImageSection } from "./image-section";
import { LinksSection } from "./links-section";
import { QuoteSection } from "./quote-section";
import { RichTextSection } from "./rich-text-section";
import { TextBoxSection } from "./text-box-section";
import { TimelineSection } from "./timeline-section";

function pickFeaturedArticles(articles: ParsedArticle[], limit: number) {
  const featured = articles.filter((article) => article.featured);
  const source = featured.length > 0 ? featured : articles;
  return source.slice(0, limit);
}

function pickFeaturedCaseStudies(caseStudies: CaseStudy[], limit: number) {
  const featured = caseStudies.filter((caseStudy) => caseStudy.featured);
  const source = featured.length > 0 ? featured : caseStudies;
  return source.slice(0, limit);
}

export function renderHomeBlock(
  block: HomeBlock,
  articles: ParsedArticle[],
  caseStudies: CaseStudy[],
) {
  switch (block.type) {
    case "hero":
      return <HeroSection block={block} key={block.id} />;
    case "richText":
      return <RichTextSection block={block} key={block.id} />;
    case "quote":
      return <QuoteSection block={block} key={block.id} />;
    case "links":
      return <LinksSection block={block} key={block.id} />;
    case "featuredArticles": {
      const selected = pickFeaturedArticles(articles, block.limit);
      if (selected.length === 0) {
        return null;
      }
      return <FeaturedArticlesSection articles={selected} block={block} key={block.id} />;
    }
    case "featuredCaseStudies": {
      const selected = pickFeaturedCaseStudies(caseStudies, block.limit);
      if (selected.length === 0) {
        return null;
      }
      return <FeaturedCaseStudiesSection block={block} caseStudies={selected} key={block.id} />;
    }
    case "timeline":
      return <TimelineSection block={block} key={block.id} />;
    case "contactCta":
      return <ContactCtaSection block={block} key={block.id} />;
    case "image":
      return <ImageSection block={block} key={block.id} />;
    case "textBox":
      return <TextBoxSection block={block} key={block.id} />;
    default:
      return null;
  }
}
