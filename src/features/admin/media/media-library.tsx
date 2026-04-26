"use client";

import { useState } from "react";

export function MediaLibrary({ initialPaths }: { initialPaths: string[] }) {
  const [paths, setPaths] = useState(initialPaths);
  const [status, setStatus] = useState("Idle");

  async function handleUpload(file: File | null) {
    if (!file) {
      return;
    }

    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { path?: string };

    if (!response.ok || !payload.path) {
      setStatus("Upload failed.");
      return;
    }

    setPaths((current) => [payload.path as string, ...current]);
    setStatus("Uploaded.");
  }

  return (
    <section className="admin-panel section-stack">
      <div className="meta-row">
        <h2 className="content-card-title">Media</h2>
        <span className="status-text">{status}</span>
      </div>
      <p>Upload an image here, then copy the returned path into an image block.</p>
      <div className="field">
        <label htmlFor="media-upload">Upload image</label>
        <input
          id="media-upload"
          onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
          type="file"
        />
      </div>
      <div className="link-list">
        {paths.length > 0 ? (
          paths.map((item) => (
            <div className="link-item" key={item}>
              <span>{item}</span>
              <button
                className="button-secondary"
                onClick={() => navigator.clipboard.writeText(item)}
                type="button"
              >
                Copy path
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">No uploaded images yet.</div>
        )}
      </div>
    </section>
  );
}
