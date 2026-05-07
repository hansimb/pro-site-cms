import { Fragment } from "react";
import { Box, Link } from "@chakra-ui/react";
import { defaultJSXConverters, RichText } from "@payloadcms/richtext-lexical/react";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { buildReferenceHref, linkCitationText } from "@/features/site/article-citations";

interface RichTextContentProps {
  content: unknown;
  referenceCount?: number;
}

function hasLexicalRoot(
  value: unknown,
): value is SerializedEditorState<SerializedLexicalNode> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "root" in value &&
      value.root &&
      typeof value.root === "object",
  );
}

function createConverters(referenceCount: number): JSXConverters {
  return {
    ...defaultJSXConverters,
    text: ({ node }) => {
      const parts = linkCitationText(node.text, referenceCount);

      const content = parts.map((part, index) => {
        if (part.type === "citation") {
          return (
            <Link
              color="accent"
              href={buildReferenceHref(part.index)}
              key={`${part.index}-${index}`}
              textDecoration="none"
            >
              [{part.index}]
            </Link>
          );
        }

        return <Fragment key={`text-${index}`}>{part.value}</Fragment>;
      });

      let formatted: React.ReactNode = <>{content}</>;

      if (node.format & 1) {
        formatted = <strong>{formatted}</strong>;
      }
      if (node.format & 2) {
        formatted = <em>{formatted}</em>;
      }
      if (node.format & 4) {
        formatted = <span style={{ textDecoration: "line-through" }}>{formatted}</span>;
      }
      if (node.format & 8) {
        formatted = <span style={{ textDecoration: "underline" }}>{formatted}</span>;
      }
      if (node.format & 16) {
        formatted = <code>{formatted}</code>;
      }
      if (node.format & 32) {
        formatted = <sub>{formatted}</sub>;
      }
      if (node.format & 64) {
        formatted = <sup>{formatted}</sup>;
      }

      return formatted;
    },
  };
}

export function RichTextContent({
  content,
  referenceCount = 0,
}: RichTextContentProps) {
  if (!hasLexicalRoot(content)) {
    return null;
  }

  return (
    <Box
      css={{
        "& a": {
          color: "var(--chakra-colors-accent)",
          textDecoration: "underline",
        },
        "& h1, & h2, & h3, & h4": {
          fontWeight: 700,
          letterSpacing: "0",
          marginBottom: "0.75rem",
          marginTop: "1.5rem",
        },
        "& li": {
          marginBottom: "0.5rem",
        },
        "& ol, & ul": {
          paddingInlineStart: "1.25rem",
        },
        "& p": {
          color: "var(--chakra-colors-text)",
          lineHeight: 1.8,
          marginBottom: "1rem",
        },
        "& picture, & img": {
          borderRadius: "0.75rem",
          display: "block",
          height: "auto",
          marginBottom: "0.75rem",
          marginTop: "1.25rem",
          maxWidth: "100%",
        },
        "& table": {
          borderCollapse: "collapse",
          display: "block",
          marginBottom: "1.25rem",
          overflowX: "auto",
          width: "100%",
        },
        "& td, & th": {
          borderBottom: "1px solid var(--chakra-colors-border)",
          padding: "0.65rem 0.75rem",
          textAlign: "left",
        },
      }}
      maxW="4xl"
    >
      <RichText converters={createConverters(referenceCount)} data={content} />
    </Box>
  );
}
