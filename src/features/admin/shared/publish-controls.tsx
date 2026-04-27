"use client";

import { useEffect, useState } from "react";
import {
  buildPublishPayloadFromDraftStorage,
  hasDraftSections,
  subscribeToDraftUpdates,
} from "@/lib/content/draft-storage";
import { useAdminAction } from "./use-admin-action";

export function PublishControls({ enabled }: { enabled: boolean }) {
  const publishAction = useAdminAction("No draft changes yet.");
  const [hasDraft, setHasDraft] = useState(enabled ? hasDraftSections() : false);
  const canPublish = enabled && hasDraft;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const sync = () => setHasDraft(hasDraftSections());
    sync();
    return subscribeToDraftUpdates(sync);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  async function publishDraft() {
    const payload = buildPublishPayloadFromDraftStorage();

    if (!payload) {
      publishAction.reset("No draft changes to publish.");
      return;
    }

    await publishAction.run(async () => {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Publish failed");
      }
    }, {
      pending: "Publishing...",
      success: "Published to GitHub.",
      error: "Publish failed.",
    });
  }

  return (
    <div className="admin-panel section-stack">
      <div className="meta-row">
        <strong>Draft publish</strong>
        <span className="status-text">{publishAction.message}</span>
      </div>
      <button
        className="button-primary"
        data-status={publishAction.state}
        disabled={!canPublish || publishAction.state === "pending"}
        onClick={publishDraft}
        type="button"
      >
        {publishAction.state === "pending" ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}
