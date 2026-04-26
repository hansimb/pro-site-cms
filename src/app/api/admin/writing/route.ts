import { ZodError, z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { getWritingTopics } from "@/lib/content/loaders";
import { articleDocumentSchema, writingTopicsSchema } from "@/lib/content/schema";
import {
  deleteArticleDocument,
  saveArticleDocument,
  saveWritingTopics,
} from "@/lib/content/writers";

const articleSaveSchema = z.object({
  article: articleDocumentSchema,
  kind: z.literal("article-save"),
});

const articleDeleteSchema = z.object({
  kind: z.literal("article-delete"),
  slug: z.string().min(1),
  topic: z.string().min(1),
});

const topicsSaveSchema = z.object({
  kind: z.literal("topics-save"),
  topics: writingTopicsSchema.shape.topics,
});

const writingPayloadSchema = z.discriminatedUnion("kind", [
  articleSaveSchema,
  articleDeleteSchema,
  topicsSaveSchema,
]);

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = writingPayloadSchema.parse(await request.json());

    if (payload.kind === "topics-save") {
      await saveWritingTopics(payload.topics);
      return NextResponse.json({ ok: true });
    }

    if (payload.kind === "article-delete") {
      await deleteArticleDocument(payload.topic, payload.slug);
      return NextResponse.json({ ok: true });
    }

    const topics = await getWritingTopics();
    const hasTopic = topics.some((topic) => topic.slug === payload.article.topic);

    if (!hasTopic) {
      return NextResponse.json({ error: "Article topic does not exist" }, { status: 400 });
    }

    await saveArticleDocument(payload.article);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid writing payload", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to save writing content" }, { status: 500 });
  }
}
