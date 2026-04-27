import { z } from "zod";
import {
  articleDocumentSchema,
  caseStudyIndexSchema,
  homeDocumentSchema,
  siteSettingsSchema,
  writingTopicsSchema,
} from "./schema";

export const writingDraftSchema = z.object({
  articles: z.array(articleDocumentSchema),
  topics: writingTopicsSchema.shape.topics,
});

export const publishDraftPayloadSchema = z.object({
  caseStudies: caseStudyIndexSchema.shape.items.optional(),
  home: homeDocumentSchema.optional(),
  settings: siteSettingsSchema.optional(),
  writing: writingDraftSchema.optional(),
});

export type WritingDraft = z.infer<typeof writingDraftSchema>;
export type PublishDraftPayload = z.infer<typeof publishDraftPayloadSchema>;
