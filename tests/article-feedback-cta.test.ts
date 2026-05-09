import { createElement } from "react";
import { readFileSync } from "node:fs";
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

  it("keeps text CTA triggers from stretching across the full card width", () => {
    const contactActions = readFileSync(
      "src/app/(site)/components/contact-actions.tsx",
      "utf8",
    );
    const homePage = readFileSync("src/app/(site)/page.tsx", "utf8");
    const articleFeedbackCta = readFileSync(
      "src/app/(site)/components/article-feedback-cta.tsx",
      "utf8",
    );

    expect(contactActions).toContain("alignSelf?: string");
    expect(contactActions).toContain("alignSelf={alignSelf}");
    expect(homePage).toContain('alignSelf="start"');
    expect(articleFeedbackCta).toContain('alignSelf="start"');
  });
});
