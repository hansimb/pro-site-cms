import type { CollectionConfig } from "payload";
import { revalidatePublicSite } from "../hooks/revalidate-site";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    defaultColumns: ["title", "updatedAt"],
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
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "background",
      type: "textarea",
      required: true,
    },
    {
      name: "problem",
      type: "textarea",
      required: true,
    },
    {
      name: "solution",
      type: "textarea",
      required: true,
    },
    {
      name: "process",
      type: "textarea",
      required: true,
    },
    {
      name: "results",
      type: "textarea",
      required: true,
    },
    {
      name: "whatILearned",
      type: "textarea",
      label: "What I learned",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      admin: {
        hidden: true,
      },
    },
    {
      name: "links",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
