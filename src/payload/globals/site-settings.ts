import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  fields: [
    {
      name: "siteTitle",
      type: "text",
      defaultValue: "Pro Site CMS",
      required: true,
    },
    {
      name: "siteSubtitle",
      type: "text",
    },
    {
      name: "siteDescription",
      type: "textarea",
      defaultValue: "A minimal dark CMS-backed site.",
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
  ],
};
