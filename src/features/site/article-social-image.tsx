import { ImageResponse } from "next/og";
import { getArticleBySlug, getSiteModel } from "@/features/site/data/payload-site";

export const articleSocialImageAlt = "Article preview";
export const articleSocialImageContentType = "image/png";
export const articleSocialImageSize = {
  width: 1200,
  height: 630,
};

function clampText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

function getTopicFontSize(topic: string) {
  if (topic.length > 28) {
    return 20;
  }

  return 24;
}

function getTitleFontSize(title: string) {
  if (title.length > 78) {
    return 58;
  }

  if (title.length > 58) {
    return 64;
  }

  return 72;
}

function getExcerptFontSize(excerpt: string) {
  if (excerpt.length > 150) {
    return 28;
  }

  return 32;
}

export async function buildArticleSocialImageResponse(
  topic: string,
  slug: string,
) {
  const [site, article] = await Promise.all([
    getSiteModel(),
    getArticleBySlug(topic, slug),
  ]);

  const title = clampText(article?.title ?? slug, 88);
  const excerpt = clampText(
    article?.excerpt ?? site.settings.siteDescription,
    150,
  );
  const byline = article?.citationAuthors?.trim();
  const topicFontSize = getTopicFontSize(topic);
  const titleFontSize = getTitleFontSize(title);
  const excerptFontSize = getExcerptFontSize(excerpt);

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,255,136,0.22), transparent 32%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.08), transparent 28%), linear-gradient(135deg, #020202 0%, #0a0a0a 52%, #111111 100%)",
          color: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "24px",
            maxWidth: 980,
          }}
        >
          <div
            style={{
              border: "2px solid #00ff88",
              color: "#f4f4f4",
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontSize: 60,
              fontWeight: 700,
              height: 120,
              justifyContent: "center",
              letterSpacing: "-0.08em",
              width: 120,
            }}
          >
            <div style={{ alignSelf: "center" }}>HI</div>
          </div>
          <div
            style={{
              color: "#00ff88",
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontSize: topicFontSize,
              fontWeight: 700,
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              maxWidth: 780,
              textTransform: "uppercase",
            }}
          >
            {topic}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontSize: titleFontSize,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
              maxWidth: 960,
            }}
          >
            {title}
          </div>

          {byline ? (
            <div
              style={{
                color: "#d0d0d0",
                display: "flex",
                fontFamily: "Arial, sans-serif",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              By {byline}
            </div>
          ) : null}

          <div
            style={{
              color: "#b7b7b7",
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontSize: excerptFontSize,
              lineHeight: 1.3,
              maxWidth: 920,
            }}
          >
            {excerpt}
          </div>
        </div>

        <div
          style={{
            color: "#8f8f8f",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex" }}>{site.settings.siteTitle}</div>
          <div style={{ display: "flex" }}>imberg.dev</div>
        </div>
      </div>
    ),
    articleSocialImageSize,
  );
}
