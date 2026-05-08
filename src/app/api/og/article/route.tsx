import { buildArticleSocialImageResponse } from "@/features/site/article-social-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const slug = searchParams.get("slug");

  if (!topic || !slug) {
    return new Response("Missing topic or slug", { status: 400 });
  }

  return buildArticleSocialImageResponse(topic, slug);
}
