import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, expect, it } from "vitest";
import { ContactModalProvider } from "../src/app/(site)/components/contact-actions";
import { ArticleFeedbackCta } from "../src/app/(site)/components/article-feedback-cta";
import { siteSystem } from "../src/features/site/theme/system";

describe("ArticleFeedbackCta", () => {
  it("renders the feedback copy and uses the existing contact trigger", () => {
    const markup = renderToStaticMarkup(
      createElement(ChakraProvider, {
        value: siteSystem,
        children: createElement(ContactModalProvider, {
          email: "hello@example.com",
          linkedinUrl: "https://www.linkedin.com/in/example",
          children: createElement(ArticleFeedbackCta),
        }),
      }),
    );

    expect(markup).toContain("Any thoughts or feedback?");
    expect(markup).toContain("Send me a message and let&#x27;s discuss. Go ahead, prove me wrong.");
    expect(markup).toContain(">Contact<");
  });
});
