import {
  buildArticleSocialImageResponse,
} from "@/features/site/article-social-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ArticleImageRouteContext {
  params: Promise<{ topic: string; slug: string }>;
}

export async function GET(
  _request: Request,
  context: ArticleImageRouteContext,
) {
  const { topic, slug } = await context.params;

  return buildArticleSocialImageResponse(
    decodeURIComponent(topic),
    decodeURIComponent(slug),
  );
}
