"use client";

import { useEffect, useRef, useState } from "react";
import {
  readDraftSection,
  subscribeToDraftUpdates,
  type DraftSectionKey,
} from "@/lib/content/draft-storage";

function serializeValue(value: unknown) {
  return JSON.stringify(value);
}

export function shouldReuseCurrentValue<T>(currentValue: T, nextValue: T) {
  return serializeValue(currentValue) === serializeValue(nextValue);
}

export function useDraftSectionValue<T>(section: DraftSectionKey, initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const latestInitialValueRef = useRef(initialValue);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    latestInitialValueRef.current = initialValue;

    if (readDraftSection<T>(section) !== null) {
      return;
    }

    if (shouldReuseCurrentValue(latestValueRef.current, initialValue)) {
      return;
    }

    latestValueRef.current = initialValue;
    setValue(initialValue);
  }, [initialValue, section]);

  useEffect(() => {
    const applyDraft = () => {
      const draft = readDraftSection<T>(section);
      const nextValue = draft ?? latestInitialValueRef.current;

      if (shouldReuseCurrentValue(latestValueRef.current, nextValue)) {
        return;
      }

      latestValueRef.current = nextValue;
      setValue(nextValue);
    };

    applyDraft();
    return subscribeToDraftUpdates(applyDraft);
  }, [section]);

  return value;
}
