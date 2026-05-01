import type { CollectionConfig } from "payload";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    defaultColumns: ["title", "updatedAt"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
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
