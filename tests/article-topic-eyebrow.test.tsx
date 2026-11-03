import { renderToStaticMarkup } from "react-dom/server";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, expect, it } from "vitest";
import { ArticleTopicEyebrow } from "../src/app/(site)/components/article-topic-eyebrow";
import { siteSystem } from "../src/features/site/theme/system";

describe("ArticleTopicEyebrow", () => {
  it("renders the topic as a link to the topic page", () => {
    const markup = renderToStaticMarkup(
      <ChakraProvider value={siteSystem}>
        <ArticleTopicEyebrow topic="Technology, Markets & Macro" />
      </ChakraProvider>,
    );

    expect(markup).toContain("/writing/Technology%2C%20Markets%20%26%20Macro");
    expect(markup).toContain("Technology, Markets &amp; Macro");
  });

  it("renders plain eyebrow text when linking is disabled", () => {
    const markup = renderToStaticMarkup(
      <ChakraProvider value={siteSystem}>
        <ArticleTopicEyebrow linked={false} topic="Analysis" />
      </ChakraProvider>,
    );

    expect(markup).toContain("Analysis");
    expect(markup).not.toContain("/writing/Analysis");
  });
});
