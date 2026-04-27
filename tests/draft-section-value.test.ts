import { describe, expect, it } from "vitest";
import { shouldReuseCurrentValue } from "../src/features/site/drafts/use-draft-section-value";

describe("shouldReuseCurrentValue", () => {
  it("reuses the current value when the next initial value only changes by reference", () => {
    const currentValue = {
      articles: [{ slug: "hello-world", title: "Hello world", published: true }],
      topics: [{ slug: "tech", title: "Tech" }],
    };

    const nextInitialValue = {
      articles: [{ slug: "hello-world", title: "Hello world", published: true }],
      topics: [{ slug: "tech", title: "Tech" }],
    };

    expect(shouldReuseCurrentValue(currentValue, nextInitialValue)).toBe(true);
  });

  it("does not reuse the current value when the content actually changes", () => {
    const currentValue = {
      articles: [{ slug: "hello-world", title: "Hello world", published: true }],
      topics: [{ slug: "tech", title: "Tech" }],
    };

    const nextInitialValue = {
      articles: [{ slug: "markets", title: "Markets", published: true }],
      topics: [{ slug: "business", title: "Business" }],
    };

    expect(shouldReuseCurrentValue(currentValue, nextInitialValue)).toBe(false);
  });
});
