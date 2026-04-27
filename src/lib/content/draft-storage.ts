import {
  homeDocumentSchema,
  caseStudyIndexSchema,
  siteSettingsSchema,
} from "./schema";
import { writingDraftSchema, type PublishDraftPayload } from "./draft-schema";

const DRAFT_STORAGE_PREFIX = "pro-site-cms-draft";
export const DRAFT_UPDATED_EVENT = "pro-site-cms-draft-updated";

export type DraftSectionKey = "home" | "caseStudies" | "settings" | "writing";

function getStorageKey(section: DraftSectionKey) {
  return `${DRAFT_STORAGE_PREFIX}:${section}`;
}

function getParser(section: DraftSectionKey) {
  switch (section) {
    case "home":
      return homeDocumentSchema;
    case "caseStudies":
      return caseStudyIndexSchema.shape.items;
    case "settings":
      return siteSettingsSchema;
    case "writing":
      return writingDraftSchema;
  }
}

function dispatchDraftUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(DRAFT_UPDATED_EVENT));
}

export function readDraftSection<T>(section: DraftSectionKey): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(section));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const result = getParser(section).safeParse(parsed);
    return result.success ? (result.data as T) : null;
  } catch {
    return null;
  }
}

export function writeDraftSection(section: DraftSectionKey, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(section), JSON.stringify(value));
  dispatchDraftUpdated();
}

export function clearDraftSection(section: DraftSectionKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(section));
  dispatchDraftUpdated();
}

export function buildPublishPayloadFromDraftStorage(): PublishDraftPayload | null {
  const home = readDraftSection<PublishDraftPayload["home"]>("home");
  const caseStudies = readDraftSection<PublishDraftPayload["caseStudies"]>("caseStudies");
  const settings = readDraftSection<PublishDraftPayload["settings"]>("settings");
  const writing = readDraftSection<PublishDraftPayload["writing"]>("writing");

  if (!home && !caseStudies && !settings && !writing) {
    return null;
  }

  return {
    caseStudies: caseStudies ?? undefined,
    home: home ?? undefined,
    settings: settings ?? undefined,
    writing: writing ?? undefined,
  };
}

export function hasDraftSections() {
  return buildPublishPayloadFromDraftStorage() !== null;
}

export function subscribeToDraftUpdates(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = () => callback();
  const storageListener = (event: StorageEvent) => {
    if (event.key?.startsWith(DRAFT_STORAGE_PREFIX)) {
      callback();
    }
  };

  window.addEventListener(DRAFT_UPDATED_EVENT, listener);
  window.addEventListener("storage", storageListener);

  return () => {
    window.removeEventListener(DRAFT_UPDATED_EVENT, listener);
    window.removeEventListener("storage", storageListener);
  };
}
