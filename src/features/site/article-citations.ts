type CitationPart =
  | { type: "text"; value: string }
  | { index: number; type: "citation" };

type FormatArticleCitationInput = {
  articleUrl: string;
  citationAuthors?: string;
  citationPublication?: string;
  citationTitle?: string;
  publishedAt?: string;
  siteTitle: string;
  title: string;
};

const citationPattern = /\[(\d+)\]/g;

function trimToUndefined(value?: string) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function buildReferenceHref(index: number) {
  return `#reference-${index}`;
}

export function formatArticleCitation(input: FormatArticleCitationInput) {
  const title = trimToUndefined(input.citationTitle) ?? input.title;
  const authors = trimToUndefined(input.citationAuthors) ?? "Unknown author";
  const publication =
    trimToUndefined(input.citationPublication) ?? input.siteTitle;

  const date = input.publishedAt
    ? new Date(input.publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "n.d.";

  return `${authors}, "${title}," ${publication}, ${date}. [Online]. Available: ${input.articleUrl}`;
}

export function linkCitationText(
  value: string,
  referenceCount: number,
): CitationPart[] {
  const parts: CitationPart[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(citationPattern)) {
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push({ type: "text", value: value.slice(lastIndex, start) });
    }

    const index = Number(match[1]);
    if (index >= 1 && index <= referenceCount) {
      parts.push({ index, type: "citation" });
    } else {
      parts.push({ type: "text", value: match[0] });
    }

    lastIndex = start + match[0].length;
  }

  if (lastIndex < value.length) {
    parts.push({ type: "text", value: value.slice(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ type: "text", value });
  }

  return parts;
}
