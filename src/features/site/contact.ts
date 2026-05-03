type RawContactSettings = {
  email?: unknown;
  githubUrl?: unknown;
  linkedinUrl?: unknown;
};

export type SiteContactSettings = {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

function readTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function normalizeContactSettings(
  value: RawContactSettings | null | undefined,
): SiteContactSettings {
  return {
    email: readTrimmedString(value?.email),
    githubUrl: readTrimmedString(value?.githubUrl),
    linkedinUrl: readTrimmedString(value?.linkedinUrl),
  };
}
