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

        return data;
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
      fields: [
        {
          name: "keyword",
          type: "text",
          required: true,
        },
      ],
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
