import { describe, expect, it } from "vitest";
import {
  hydrateLexicalUploadNodes,
  getFallbackSiteModel,
  isPublishedArticleStatus,
} from "../src/features/site/data/payload-site";

describe("site data contract", () => {
  it("provides a minimal public model while Payload content is empty", () => {
    expect(getFallbackSiteModel()).toMatchObject({
      navigation: [
        { href: "/", label: "Home" },
        { href: "/writing", label: "Writing" },
        { href: "/case-studies", label: "Case studies" },
      ],
      settings: {
        siteTitle: "imberg.dev",
        seo: {
          metaDescription:
            "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
          metaTitle: "imberg.dev",
        },
      },
    });
  });

  it("provides empty optional contact and social settings in the fallback model", () => {
    expect(getFallbackSiteModel().settings).toMatchObject({
      contact: {
        email: undefined,
        githubUrl: undefined,
        linkedinUrl: undefined,
      },
    });
  });

  it("treats only published articles as public content", () => {
    expect(isPublishedArticleStatus("published")).toBe(true);
    expect(isPublishedArticleStatus("draft")).toBe(false);
    expect(isPublishedArticleStatus(undefined)).toBe(false);
  });

  it("hydrates lexical upload nodes from numeric media ids", () => {
    const content = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "hello", detail: 0, format: 0, mode: "normal", style: "", version: 1 }],
            direction: "ltr",
            format: "",
            indent: 0,
            textFormat: 0,
            textStyle: "",
            version: 1,
          },
          {
            type: "upload",
            relationTo: "media",
            value: 5,
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      },
    };

    const hydrated = hydrateLexicalUploadNodes(content, [
      {
        id: 5,
        alt: "Semiconductor revenues 2026",
        filename: "semiconductor-revenues-2026.png",
        mimeType: "image/png",
        url: "/api/media/file/semiconductor-revenues-2026.png",
      },
    ]);

    const uploadNode = (
      (hydrated as { root: { children: Array<{ type: string; value?: unknown }> } }).root
        .children[1]
    );

    expect(uploadNode.type).toBe("upload");
    expect(uploadNode.value).toMatchObject({
      id: 5,
      alt: "Semiconductor revenues 2026",
      mimeType: "image/png",
      url: "/api/media/file/semiconductor-revenues-2026.png",
    });
  });
});
