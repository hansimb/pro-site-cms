import type { GlobalConfig } from "payload";
import { revalidatePublicSite } from "../hooks/revalidate-site";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  hooks: {
    afterChange: [async () => revalidatePublicSite()],
  },
  fields: [
    {
      name: "siteTitle",
      type: "text",
      defaultValue: "imberg.dev",
      required: true,
    },
    {
      name: "siteSubtitle",
      type: "text",
    },
    {
      name: "siteDescription",
      type: "textarea",
      defaultValue: "Software, systems, and business-aware development.",
      required: true,
    },
    {
      name: "accentColor",
      type: "text",
      defaultValue: "#00ff88",
      required: true,
    },
    {
      name: "navigation",
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
      name: "contact",
      type: "group",
      fields: [
        {
          name: "email",
          type: "text",
        },
        {
          name: "linkedinUrl",
          type: "text",
        },
        {
          name: "githubUrl",
          type: "text",
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "siteUrl",
          type: "text",
          defaultValue: "https://imberg.dev",
          required: true,
        },
        {
          name: "metaTitle",
          type: "text",
          defaultValue: "imberg.dev",
          required: true,
        },
        {
          name: "metaDescription",
          type: "textarea",
          defaultValue:
            "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
          required: true,
        },
        {
          name: "openGraphTitle",
          type: "text",
          defaultValue: "imberg.dev",
        },
        {
          name: "openGraphDescription",
          type: "textarea",
          defaultValue:
            "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
        },
        {
          name: "twitterTitle",
          type: "text",
          defaultValue: "imberg.dev",
        },
        {
          name: "twitterDescription",
          type: "textarea",
          defaultValue:
            "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
        },
        {
          name: "noIndex",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};
