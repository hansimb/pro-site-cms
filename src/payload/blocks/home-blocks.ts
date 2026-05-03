import type { Block } from "payload";

export const HeroBlock: Block = {
  slug: "hero",
  fields: [
    {
      name: "eyebrow",
      type: "text",
    },
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: true,
      label: "Show featured writing and case study cards",
    },
    {
      name: "primaryLink",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
        },
        {
          name: "href",
          type: "text",
        },
      ],
    },
  ],
};

export const TextBlock: Block = {
  slug: "text",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
  ],
};

export const QuoteBlock: Block = {
  slug: "quote",
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "attribution",
      type: "text",
    },
    {
      name: "role",
      type: "text",
    },
  ],
};

export const HighlightsBlock: Block = {
  slug: "highlights",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "eyebrow",
          type: "text",
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "body",
          type: "textarea",
          required: true,
        },
      ],
    },
  ],
};

export const TimelineBlock: Block = {
  slug: "timeline",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "period",
          type: "text",
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "summary",
          type: "textarea",
          required: true,
        },
      ],
    },
  ],
};

export const ContactCtaBlock: Block = {
  slug: "contactCta",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
    {
      name: "primaryLink",
      type: "group",
      admin: {
        description: "Single CTA button label. Opens the contact modal.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Button label",
        },
      ],
    },
  ],
};

export const FeaturedCaseStudiesBlock: Block = {
  slug: "featuredCaseStudies",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "items",
      type: "relationship",
      relationTo: "case-studies",
      hasMany: true,
      required: true,
      admin: {
        description: "Select 2-6 featured case studies for the homepage.",
      },
      validate: (value) => {
        if (!Array.isArray(value) || value.length < 2 || value.length > 6) {
          return "Select 2-6 case studies.";
        }

        return true;
      },
    },
  ],
};

export const CalloutBlock: Block = {
  slug: "callout",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
  ],
};

export const GithubProfileBlock: Block = {
  slug: "githubProfile",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "ctaLabel",
      type: "text",
      required: true,
    },
    {
      name: "ctaUrl",
      type: "text",
      required: true,
    },
    {
      name: "statsRepoUrl",
      type: "text",
      admin: {
        description:
          "Repository URL used for deployment statistics, for example https://github.com/hansimb/pro-site-cms",
      },
    },
    {
      name: "showPublicRepos",
      type: "checkbox",
      label: "Show public repositories",
      defaultValue: true,
    },
    {
      name: "showContributions",
      type: "checkbox",
      label: "Show contributions",
      defaultValue: true,
    },
    {
      name: "contributionWindow",
      type: "select",
      defaultValue: "year",
      options: [
        {
          label: "Contributions in the last year",
          value: "year",
        },
        {
          label: "All-time contributions",
          value: "allTime",
        },
      ],
    },
    {
      name: "showCodingTime",
      type: "checkbox",
      label: "Show tracked coding time",
      defaultValue: true,
    },
    {
      name: "showProductionDeployments",
      type: "checkbox",
      label: "Show repositories deployed to production",
      defaultValue: true,
    },
  ],
};

export const LinkListBlock: Block = {
  slug: "linkList",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
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
  ],
};

export const HomeBlocks = [
  HeroBlock,
  TextBlock,
  QuoteBlock,
  HighlightsBlock,
  TimelineBlock,
  ContactCtaBlock,
  FeaturedCaseStudiesBlock,
  GithubProfileBlock,
  CalloutBlock,
  LinkListBlock,
];
