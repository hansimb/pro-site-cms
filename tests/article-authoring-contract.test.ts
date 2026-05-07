import { describe, expect, it } from "vitest";
import { Articles } from "../src/payload/collections/articles";

describe("article authoring contract", () => {
  it("adds evergreen SEO and citation fields to articles", () => {
    const fieldNames = Articles.fields.map((field) =>
      "name" in field ? field.name : undefined,
    );

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "seoTitle",
        "seoDescription",
        "canonicalUrl",
        "keywords",
        "citationTitle",
        "citationAuthors",
        "citationPublication",
      ]),
    );
  });

  it("expands references beyond a plain label and URL", () => {
    const referencesField = Articles.fields.find(
      (field) => "name" in field && field.name === "references",
    );

    expect(referencesField && "fields" in referencesField ? referencesField.fields.map((field) =>
      "name" in field ? field.name : undefined,
    ) : []).toEqual(
      expect.arrayContaining([
        "label",
        "url",
        "publisher",
        "publishedAt",
        "accessedAt",
      ]),
    );
  });
});
