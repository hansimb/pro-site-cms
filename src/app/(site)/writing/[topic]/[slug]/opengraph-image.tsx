import { ImageResponse } from "next/og";
import { getArticleBySlug, getSiteModel } from "@/features/site/data/payload-site";

export const alt = "Article preview";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

interface ArticleSocialImageProps {
  params: Promise<{ topic: string; slug: string }>;
}

function clampText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export default async function ArticleOpenGraphImage({
  params,
}: ArticleSocialImageProps) {
  const { topic, slug } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const decodedSlug = decodeURIComponent(slug);

  const [site, article] = await Promise.all([
    getSiteModel(),
    getArticleBySlug(decodedTopic, decodedSlug),
  ]);

  const title = clampText(article?.title ?? decodedSlug, 88);
  const excerpt = clampText(
    article?.excerpt ?? site.settings.siteDescription,
    170,
  );
  const byline = article?.citationAuthors?.trim();

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
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {decodedTopic}
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
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
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
              fontSize: 32,
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
    size,
  );
}
