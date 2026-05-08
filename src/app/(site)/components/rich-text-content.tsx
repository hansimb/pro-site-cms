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

function appendVersionQuery(url: string | undefined, version: string | number | undefined) {
  if (!url) {
    return "";
  }

  if (version === undefined || version === null || String(version).trim().length === 0) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version))}`;
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
    upload: ({ node }) => {
      const uploadNode = node as {
        fields?: { alt?: string };
        value?: {
          alt?: string;
          filename?: string;
          height?: number;
          id?: number | string;
          mimeType?: string;
          sizes?: Record<
            string,
            | {
                filename?: string;
                filesize?: number;
                height?: number;
                mimeType?: string;
                url?: string;
                width?: number;
              }
            | null
            | undefined
          >;
          url?: string;
          width?: number;
        };
      };

      if (!uploadNode.value || typeof uploadNode.value !== "object") {
        return null;
      }

      const uploadDoc = uploadNode.value;
      const alt = uploadNode.fields?.alt || uploadDoc.alt || "";
      const version = uploadDoc.id ?? uploadDoc.filename;
      const url = appendVersionQuery(uploadDoc.url, version);

      if (!uploadDoc.mimeType?.startsWith("image")) {
        return (
          <a href={url} rel="noopener noreferrer">
            {uploadDoc.filename}
          </a>
        );
      }

      if (!uploadDoc.sizes || Object.keys(uploadDoc.sizes).length === 0) {
        return (
          <img
            alt={alt}
            decoding="async"
            height={uploadDoc.height}
            loading="lazy"
            src={url}
            width={uploadDoc.width}
          />
        );
      }

      const pictureSources = Object.entries(uploadDoc.sizes).flatMap(([size, imageSize]) => {
        if (
          !imageSize ||
          !imageSize.width ||
          !imageSize.height ||
          !imageSize.mimeType ||
          !imageSize.filesize ||
          !imageSize.filename ||
          !imageSize.url
        ) {
          return [];
        }

        return [
          <source
            key={size}
            media={`(max-width: ${imageSize.width}px)`}
            srcSet={appendVersionQuery(imageSize.url, version)}
            type={imageSize.mimeType}
          />,
        ];
      });

      return (
        <picture>
          {pictureSources}
          <img
            alt={alt}
            decoding="async"
            height={uploadDoc.height}
            loading="lazy"
            src={url}
            width={uploadDoc.width}
          />
        </picture>
      );
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
          color: "var(--chakra-colors-text)",
          fontWeight: 700,
          letterSpacing: "0",
          marginBottom: "0.75rem",
          marginTop: "1.75rem",
        },
        "& h1": {
          fontSize: "2rem",
          lineHeight: 1.15,
        },
        "& h2": {
          fontSize: "1.5rem",
          lineHeight: 1.2,
        },
        "& h3": {
          fontSize: "1.25rem",
          lineHeight: 1.25,
        },
        "& h4": {
          fontSize: "1.1rem",
          lineHeight: 1.3,
        },
        "& li": {
          color: "var(--chakra-colors-text)",
          marginBottom: "0.5rem",
          paddingInlineStart: "0.2rem",
        },
        "& ol": {
          listStyleType: "decimal",
          paddingInlineStart: "1.6rem",
        },
        "& ul": {
          listStyleType: "disc",
          paddingInlineStart: "1.6rem",
        },
        "& ol li::marker, & ul li::marker": {
          color: "var(--chakra-colors-text)",
          fontWeight: 600,
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
