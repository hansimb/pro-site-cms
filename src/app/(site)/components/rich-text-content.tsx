import { Box } from "@chakra-ui/react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

interface RichTextContentProps {
  content: unknown;
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

export function RichTextContent({ content }: RichTextContentProps) {
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
      }}
      maxW="4xl"
    >
      <RichText data={content} />
    </Box>
  );
}
