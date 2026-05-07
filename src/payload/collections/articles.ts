import type { CollectionConfig } from "payload";
import { revalidatePublicSite } from "../hooks/revalidate-site";

export function formatArticleSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeKeywordList(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    defaultColumns: ["title", "topic", "published", "updatedAt"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) {
          return data;
        }

        if (typeof data.title === "string" && data.title.trim().length > 0) {
          const nextSlug = formatArticleSlug(data.title);
          data.slug = nextSlug;
        }

        if (typeof data.keywordsText === "string") {
          data.keywords = normalizeKeywordList(data.keywordsText).map((keyword) => ({
            keyword,
          }));
        }

        return data;
      },
    ],
    afterRead: [
      async ({ doc }) => {
        if (!doc) {
          return doc;
        }

        if (
          typeof doc.keywordsText !== "string" ||
          doc.keywordsText.trim().length === 0
        ) {
          const keywords = Array.isArray(doc.keywords)
            ? doc.keywords.flatMap((item: unknown) =>
                item &&
                typeof item === "object" &&
                "keyword" in item &&
                typeof item.keyword === "string" &&
                item.keyword.trim().length > 0
                  ? [item.keyword.trim()]
                  : [],
              )
            : [];

          doc.keywordsText = keywords.join(", ");
        }

        return doc;
      },
    ],
    afterChange: [async () => revalidatePublicSite()],
    afterDelete: [async () => revalidatePublicSite()],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      admin: {
        hidden: true,
        readOnly: true,
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "topic",
      type: "text",
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "seoTitle",
      type: "text",
      admin: {
        description: "Optional. If empty, the article title is used automatically.",
      },
    },
    {
      name: "seoDescription",
      type: "textarea",
      admin: {
        description: "Optional. If empty, the article excerpt is used automatically.",
      },
    },
    {
      name: "keywords",
      type: "array",
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: "keyword",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "keywordsText",
      type: "text",
      admin: {
        description:
          "Add keywords as a single comma-separated list. They will be formatted automatically on the site.",
      },
      label: "Keywords",
    },
    {
      name: "citationAuthors",
      type: "text",
      admin: {
        description: "Optional. Used for the generated article reference box.",
      },
      label: "Article authors",
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "references",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
        {
          name: "publisher",
          type: "text",
        },
        {
          name: "publishedAt",
          type: "date",
        },
        {
          name: "accessedAt",
          type: "date",
        },
      ],
    },
  ],
};
