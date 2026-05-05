import type { CollectionConfig } from "payload";
import { revalidatePublicSite } from "../hooks/revalidate-site";

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
      ],
    },
  ],
};
