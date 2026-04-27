"use client";

import { useEffect, useState } from "react";
import {
  readDraftSection,
  subscribeToDraftUpdates,
  type DraftSectionKey,
} from "@/lib/content/draft-storage";

export function useDraftSectionValue<T>(section: DraftSectionKey, initialValue: T) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const applyDraft = () => {
      const draft = readDraftSection<T>(section);
      setValue(draft ?? initialValue);
    };

    applyDraft();
    return subscribeToDraftUpdates(applyDraft);
  }, [initialValue, section]);

  return value;
}
